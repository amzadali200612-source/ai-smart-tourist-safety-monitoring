import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      }, { status: 401 });
    }

    const body = await request.json();

    // SECURITY: Reject if userId provided in request body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { latitude, longitude, accuracy, address } = body;

    // Validate required fields
    if (latitude === undefined || latitude === null) {
      return NextResponse.json({ 
        error: "Latitude is required",
        code: "MISSING_LATITUDE" 
      }, { status: 400 });
    }

    if (longitude === undefined || longitude === null) {
      return NextResponse.json({ 
        error: "Longitude is required",
        code: "MISSING_LONGITUDE" 
      }, { status: 400 });
    }

    // Validate latitude range (-90 to 90)
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      return NextResponse.json({ 
        error: "Latitude must be a number between -90 and 90",
        code: "INVALID_LATITUDE" 
      }, { status: 400 });
    }

    // Validate longitude range (-180 to 180)
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      return NextResponse.json({ 
        error: "Longitude must be a number between -180 and 180",
        code: "INVALID_LONGITUDE" 
      }, { status: 400 });
    }

    // Validate accuracy if provided
    if (accuracy !== undefined && accuracy !== null && typeof accuracy !== 'number') {
      return NextResponse.json({ 
        error: "Accuracy must be a number",
        code: "INVALID_ACCURACY" 
      }, { status: 400 });
    }

    // Prepare insert data
    const locationData: any = {
      userId: user.id,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    };

    if (accuracy !== undefined && accuracy !== null) {
      locationData.accuracy = accuracy;
    }

    if (address) {
      locationData.address = typeof address === 'string' ? address.trim() : address;
    }

    // Insert location record
    const newLocation = await db.insert(locations)
      .values(locationData)
      .returning();

    return NextResponse.json(newLocation[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}