import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sosAlerts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

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
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { latitude, longitude, message, notifiedContacts } = body;

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

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return NextResponse.json({ 
        error: "Invalid latitude. Must be between -90 and 90",
        code: "INVALID_LATITUDE" 
      }, { status: 400 });
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      return NextResponse.json({ 
        error: "Invalid longitude. Must be between -180 and 180",
        code: "INVALID_LONGITUDE" 
      }, { status: 400 });
    }

    // Validate notifiedContacts if provided
    let parsedNotifiedContacts = null;
    if (notifiedContacts) {
      if (Array.isArray(notifiedContacts)) {
        parsedNotifiedContacts = notifiedContacts;
      } else if (typeof notifiedContacts === 'string') {
        try {
          parsedNotifiedContacts = JSON.parse(notifiedContacts);
          if (!Array.isArray(parsedNotifiedContacts)) {
            return NextResponse.json({ 
              error: "notifiedContacts must be an array",
              code: "INVALID_NOTIFIED_CONTACTS" 
            }, { status: 400 });
          }
        } catch {
          return NextResponse.json({ 
            error: "Invalid JSON format for notifiedContacts",
            code: "INVALID_JSON" 
          }, { status: 400 });
        }
      } else {
        return NextResponse.json({ 
          error: "notifiedContacts must be an array or JSON string",
          code: "INVALID_NOTIFIED_CONTACTS_FORMAT" 
        }, { status: 400 });
      }
    }

    // Create SOS alert
    const newAlert = await db.insert(sosAlerts)
      .values({
        userId: user.id,
        latitude: lat,
        longitude: lng,
        status: 'active',
        message: message ? String(message).trim() : null,
        notifiedContacts: parsedNotifiedContacts,
        createdAt: new Date().toISOString(),
        resolvedAt: null
      })
      .returning();

    return NextResponse.json(newAlert[0], { status: 201 });
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? 'active';
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate status
    const validStatuses = ['active', 'resolved', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Query SOS alerts filtered by status
    const alerts = await db.select()
      .from(sosAlerts)
      .where(eq(sosAlerts.status, status))
      .orderBy(desc(sosAlerts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(alerts, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}