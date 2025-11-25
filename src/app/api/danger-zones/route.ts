import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dangerZones } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const riskLevel = searchParams.get('riskLevel');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let query = db.select().from(dangerZones);

    // Build where conditions
    const conditions = [];
    
    if (!includeInactive) {
      conditions.push(eq(dangerZones.active, true));
    }

    if (riskLevel) {
      conditions.push(eq(dangerZones.riskLevel, riskLevel));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, latitude, longitude, radius, riskLevel, crimeRate, description, active } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (latitude === undefined || latitude === null) {
      return NextResponse.json(
        { error: 'Latitude is required', code: 'MISSING_LATITUDE' },
        { status: 400 }
      );
    }

    if (longitude === undefined || longitude === null) {
      return NextResponse.json(
        { error: 'Longitude is required', code: 'MISSING_LONGITUDE' },
        { status: 400 }
      );
    }

    if (!radius) {
      return NextResponse.json(
        { error: 'Radius is required', code: 'MISSING_RADIUS' },
        { status: 400 }
      );
    }

    if (!riskLevel) {
      return NextResponse.json(
        { error: 'Risk level is required', code: 'MISSING_RISK_LEVEL' },
        { status: 400 }
      );
    }

    if (crimeRate === undefined || crimeRate === null) {
      return NextResponse.json(
        { error: 'Crime rate is required', code: 'MISSING_CRIME_RATE' },
        { status: 400 }
      );
    }

    // Validate riskLevel
    const validRiskLevels = ['low', 'medium', 'high', 'critical'];
    if (!validRiskLevels.includes(riskLevel)) {
      return NextResponse.json(
        { 
          error: 'Risk level must be one of: low, medium, high, critical', 
          code: 'INVALID_RISK_LEVEL' 
        },
        { status: 400 }
      );
    }

    // Validate crimeRate
    if (crimeRate < 0 || crimeRate > 100) {
      return NextResponse.json(
        { error: 'Crime rate must be between 0 and 100', code: 'INVALID_CRIME_RATE' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData = {
      name: name.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
      riskLevel,
      crimeRate: parseFloat(crimeRate),
      description: description ? description.trim() : null,
      active: active !== undefined ? Boolean(active) : true,
      createdAt: now,
      updatedAt: now,
    };

    const newDangerZone = await db
      .insert(dangerZones)
      .values(insertData)
      .returning();

    return NextResponse.json(newDangerZone[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}