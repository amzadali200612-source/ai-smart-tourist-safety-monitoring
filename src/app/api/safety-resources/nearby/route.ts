import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { safetyResources } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius');
    const typeParam = searchParams.get('type');

    // Validate required parameters
    if (!latParam || !lngParam) {
      return NextResponse.json(
        {
          error: 'Latitude and longitude are required',
          code: 'MISSING_COORDINATES',
        },
        { status: 400 }
      );
    }

    // Parse and validate coordinates
    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        {
          error: 'Invalid coordinates provided',
          code: 'INVALID_COORDINATES',
        },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        {
          error: 'Coordinates out of valid range',
          code: 'COORDINATES_OUT_OF_RANGE',
        },
        { status: 400 }
      );
    }

    // Parse radius with default value of 10000 meters
    const radius = radiusParam ? parseFloat(radiusParam) : 10000;

    if (isNaN(radius) || radius <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid radius value',
          code: 'INVALID_RADIUS',
        },
        { status: 400 }
      );
    }

    // Build query with optional type filter
    let query = db.select().from(safetyResources);

    if (typeParam) {
      // Validate type parameter
      const validTypes = ['police', 'hospital', 'embassy', 'help_center'];
      if (!validTypes.includes(typeParam)) {
        return NextResponse.json(
          {
            error: 'Invalid type parameter. Valid types: police, hospital, embassy, help_center',
            code: 'INVALID_TYPE',
          },
          { status: 400 }
        );
      }
      query = query.where(eq(safetyResources.type, typeParam));
    }

    // Fetch all resources (with optional type filter)
    const allResources = await query;

    // Calculate distance for each resource and filter by radius
    const resourcesWithDistance = allResources
      .map((resource) => {
        const distance = calculateDistance(
          lat,
          lng,
          resource.latitude,
          resource.longitude
        );

        return {
          ...resource,
          distance,
        };
      })
      .filter((resource) => resource.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(resourcesWithDistance, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}