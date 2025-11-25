import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { safetyResources } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_TYPES = ['police', 'hospital', 'embassy', 'help_center'] as const;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const type = searchParams.get('type');
    const available247Param = searchParams.get('available247');

    let query = db.select().from(safetyResources);

    const conditions = [];

    if (type) {
      if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
        return NextResponse.json(
          { 
            error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
            code: 'INVALID_TYPE'
          },
          { status: 400 }
        );
      }
      conditions.push(eq(safetyResources.type, type));
    }

    if (available247Param !== null) {
      const available247 = available247Param === 'true';
      conditions.push(eq(safetyResources.available247, available247));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
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
    const { type, name, latitude, longitude, address, phone, available247 } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { error: 'Type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

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

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required', code: 'MISSING_ADDRESS' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone is required', code: 'MISSING_PHONE' },
        { status: 400 }
      );
    }

    if (available247 === undefined || available247 === null) {
      return NextResponse.json(
        { error: 'available247 is required', code: 'MISSING_AVAILABLE_247' },
        { status: 400 }
      );
    }

    // Validate type
    if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
      return NextResponse.json(
        { 
          error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
          code: 'INVALID_TYPE'
        },
        { status: 400 }
      );
    }

    // Validate latitude and longitude are numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return NextResponse.json(
        { error: 'Latitude must be a valid number between -90 and 90', code: 'INVALID_LATITUDE' },
        { status: 400 }
      );
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
      return NextResponse.json(
        { error: 'Longitude must be a valid number between -180 and 180', code: 'INVALID_LONGITUDE' },
        { status: 400 }
      );
    }

    // Validate available247 is boolean
    if (typeof available247 !== 'boolean') {
      return NextResponse.json(
        { error: 'available247 must be a boolean', code: 'INVALID_AVAILABLE_247' },
        { status: 400 }
      );
    }

    const newResource = await db.insert(safetyResources)
      .values({
        type: type.trim(),
        name: name.trim(),
        latitude: lat,
        longitude: lon,
        address: address.trim(),
        phone: phone.trim(),
        available247,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newResource[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}