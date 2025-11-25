import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dangerZones } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Haversine formula to calculate distance between two coordinates in meters
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS = 6371000; // Earth's radius in meters
  
  // Convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return EARTH_RADIUS * c;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') ?? '5000';

    // Validate required coordinates
    if (!lat || !lng) {
      return NextResponse.json(
        { 
          error: 'Latitude and longitude are required',
          code: 'MISSING_COORDINATES'
        },
        { status: 400 }
      );
    }

    // Parse and validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
      return NextResponse.json(
        { 
          error: 'Invalid coordinates or radius format',
          code: 'INVALID_COORDINATES'
        },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { 
          error: 'Coordinates out of valid range',
          code: 'INVALID_COORDINATE_RANGE'
        },
        { status: 400 }
      );
    }

    // Validate radius is positive
    if (searchRadius <= 0) {
      return NextResponse.json(
        { 
          error: 'Radius must be a positive number',
          code: 'INVALID_RADIUS'
        },
        { status: 400 }
      );
    }

    // Fetch all active danger zones
    const allZones = await db
      .select()
      .from(dangerZones)
      .where(eq(dangerZones.active, true));

    // Calculate distance for each zone and filter by radius
    const zonesWithDistance = allZones
      .map(zone => {
        const distance = calculateDistance(
          latitude,
          longitude,
          zone.latitude,
          zone.longitude
        );
        
        return {
          ...zone,
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        };
      })
      .filter(zone => zone.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(zonesWithDistance, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}