import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { incidentReports } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

const VALID_INCIDENT_TYPES = ['suspicious_activity', 'theft', 'harassment', 'accident', 'other'];
const VALID_THREAT_LEVELS = ['low', 'medium', 'high'];
const VALID_STATUSES = ['pending', 'verified', 'resolved'];

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: 'User ID cannot be provided in request body',
        code: 'USER_ID_NOT_ALLOWED' 
      }, { status: 400 });
    }

    const { latitude, longitude, incidentType, description, threatLevel, photoUrl, videoUrl } = body;

    // Validate required fields
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

    if (!incidentType) {
      return NextResponse.json({ 
        error: 'Incident type is required',
        code: 'MISSING_INCIDENT_TYPE' 
      }, { status: 400 });
    }

    if (!description || description.trim() === '') {
      return NextResponse.json({ 
        error: 'Description is required',
        code: 'MISSING_DESCRIPTION' 
      }, { status: 400 });
    }

    if (!threatLevel) {
      return NextResponse.json({ 
        error: 'Threat level is required',
        code: 'MISSING_THREAT_LEVEL' 
      }, { status: 400 });
    }

    // Validate incident type
    if (!VALID_INCIDENT_TYPES.includes(incidentType)) {
      return NextResponse.json({ 
        error: `Invalid incident type. Must be one of: ${VALID_INCIDENT_TYPES.join(', ')}`,
        code: 'INVALID_INCIDENT_TYPE' 
      }, { status: 400 });
    }

    // Validate threat level
    if (!VALID_THREAT_LEVELS.includes(threatLevel)) {
      return NextResponse.json({ 
        error: `Invalid threat level. Must be one of: ${VALID_THREAT_LEVELS.join(', ')}`,
        code: 'INVALID_THREAT_LEVEL' 
      }, { status: 400 });
    }

    // Validate latitude and longitude ranges
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      return NextResponse.json({ 
        error: 'Latitude must be a number between -90 and 90',
        code: 'INVALID_LATITUDE' 
      }, { status: 400 });
    }

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      return NextResponse.json({ 
        error: 'Longitude must be a number between -180 and 180',
        code: 'INVALID_LONGITUDE' 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    const newIncident = await db.insert(incidentReports)
      .values({
        userId: user.id,
        latitude,
        longitude,
        incidentType,
        description: description.trim(),
        threatLevel,
        photoUrl: photoUrl || null,
        videoUrl: videoUrl || null,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newIncident[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const threatLevel = searchParams.get('threatLevel');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        code: 'INVALID_STATUS' 
      }, { status: 400 });
    }

    // Validate threat level if provided
    if (threatLevel && !VALID_THREAT_LEVELS.includes(threatLevel)) {
      return NextResponse.json({ 
        error: `Invalid threat level. Must be one of: ${VALID_THREAT_LEVELS.join(', ')}`,
        code: 'INVALID_THREAT_LEVEL' 
      }, { status: 400 });
    }

    let query = db.select().from(incidentReports);

    // Build filter conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(incidentReports.status, status));
    }

    if (threatLevel) {
      conditions.push(eq(incidentReports.threatLevel, threatLevel));
    }

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply ordering and pagination
    const results = await query
      .orderBy(desc(incidentReports.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}