import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { areaSafetyScores } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // If lat/lng provided, find nearest area
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json({
          error: 'Invalid latitude or longitude',
          code: 'INVALID_COORDINATES'
        }, { status: 400 });
      }

      // Get all areas
      const areas = await db.select().from(areaSafetyScores);

      if (areas.length === 0) {
        return NextResponse.json({
          error: 'No areas found',
          code: 'NO_AREAS'
        }, { status: 404 });
      }

      // Calculate distances and find nearest
      let nearestArea: any = null;
      let minDistance = Infinity;

      for (const area of areas) {
        const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
        if (distance < minDistance) {
          minDistance = distance;
          nearestArea = { ...area, distance };
        }
      }

      return NextResponse.json(nearestArea, { status: 200 });
    }

    // Otherwise return paginated list
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const areas = await db.select()
      .from(areaSafetyScores)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(areas, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { areaName, latitude, longitude, safetyScore, crimeRate, crowdDensity, recentIncidents } = body;

    // Validate required fields
    if (!areaName) {
      return NextResponse.json({
        error: 'Area name is required',
        code: 'MISSING_AREA_NAME'
      }, { status: 400 });
    }

    if (latitude === undefined || latitude === null) {
      return NextResponse.json({
        error: 'Latitude is required',
        code: 'MISSING_LATITUDE'
      }, { status: 400 });
    }

    if (longitude === undefined || longitude === null) {
      return NextResponse.json({
        error: 'Longitude is required',
        code: 'MISSING_LONGITUDE'
      }, { status: 400 });
    }

    if (safetyScore === undefined || safetyScore === null) {
      return NextResponse.json({
        error: 'Safety score is required',
        code: 'MISSING_SAFETY_SCORE'
      }, { status: 400 });
    }

    if (crimeRate === undefined || crimeRate === null) {
      return NextResponse.json({
        error: 'Crime rate is required',
        code: 'MISSING_CRIME_RATE'
      }, { status: 400 });
    }

    if (!crowdDensity) {
      return NextResponse.json({
        error: 'Crowd density is required',
        code: 'MISSING_CROWD_DENSITY'
      }, { status: 400 });
    }

    if (recentIncidents === undefined || recentIncidents === null) {
      return NextResponse.json({
        error: 'Recent incidents count is required',
        code: 'MISSING_RECENT_INCIDENTS'
      }, { status: 400 });
    }

    // Validate safetyScore range
    if (safetyScore < 0 || safetyScore > 100) {
      return NextResponse.json({
        error: 'Safety score must be between 0 and 100',
        code: 'INVALID_SAFETY_SCORE'
      }, { status: 400 });
    }

    // Validate crowdDensity values
    const validDensities = ['low', 'medium', 'high'];
    if (!validDensities.includes(crowdDensity.toLowerCase())) {
      return NextResponse.json({
        error: 'Crowd density must be "low", "medium", or "high"',
        code: 'INVALID_CROWD_DENSITY'
      }, { status: 400 });
    }

    // Validate numeric fields
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({
        error: 'Latitude and longitude must be valid numbers',
        code: 'INVALID_COORDINATES'
      }, { status: 400 });
    }

    if (isNaN(safetyScore) || isNaN(crimeRate)) {
      return NextResponse.json({
        error: 'Safety score and crime rate must be valid numbers',
        code: 'INVALID_NUMERIC_VALUES'
      }, { status: 400 });
    }

    if (isNaN(recentIncidents) || recentIncidents < 0 || !Number.isInteger(recentIncidents)) {
      return NextResponse.json({
        error: 'Recent incidents must be a non-negative integer',
        code: 'INVALID_RECENT_INCIDENTS'
      }, { status: 400 });
    }

    // Create new area safety score
    const newArea = await db.insert(areaSafetyScores)
      .values({
        areaName: areaName.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        safetyScore: parseFloat(safetyScore),
        crimeRate: parseFloat(crimeRate),
        crowdDensity: crowdDensity.toLowerCase(),
        recentIncidents: parseInt(recentIncidents),
        lastUpdated: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newArea[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}