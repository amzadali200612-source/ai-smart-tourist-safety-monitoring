import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userProfiles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { phone, role, language, locationTrackingEnabled, emergencyContactName, emergencyContactPhone } = body;

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate role if provided
    if (role && !['tourist', 'admin'].includes(role)) {
      return NextResponse.json({ 
        error: "Role must be 'tourist' or 'admin'",
        code: "INVALID_ROLE" 
      }, { status: 400 });
    }

    // Check if profile exists for the authenticated user
    const existingProfile = await db.select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    const timestamp = new Date().toISOString();

    if (existingProfile.length > 0) {
      // UPDATE existing profile
      const updateData: any = {
        updatedAt: timestamp
      };

      if (phone !== undefined) updateData.phone = phone;
      if (role !== undefined) updateData.role = role;
      if (language !== undefined) updateData.language = language;
      if (locationTrackingEnabled !== undefined) updateData.locationTrackingEnabled = locationTrackingEnabled;
      if (emergencyContactName !== undefined) updateData.emergencyContactName = emergencyContactName;
      if (emergencyContactPhone !== undefined) updateData.emergencyContactPhone = emergencyContactPhone;

      const updated = await db.update(userProfiles)
        .set(updateData)
        .where(eq(userProfiles.userId, user.id))
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      // INSERT new profile
      const insertData = {
        userId: user.id,
        phone: phone ?? null,
        role: role ?? 'tourist',
        language: language ?? 'en',
        locationTrackingEnabled: locationTrackingEnabled ?? true,
        emergencyContactName: emergencyContactName ?? null,
        emergencyContactPhone: emergencyContactPhone ?? null,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const newProfile = await db.insert(userProfiles)
        .values(insertData)
        .returning();

      return NextResponse.json(newProfile[0], { status: 201 });
    }
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get('userId');

    if (!queryUserId) {
      return NextResponse.json({ 
        error: "userId query parameter is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    // Security: Users can only access their own profile
    if (queryUserId !== user.id) {
      return NextResponse.json({ 
        error: "Access denied",
        code: "ACCESS_DENIED" 
      }, { status: 403 });
    }

    const profile = await db.select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, queryUserId))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ 
        error: 'Profile not found',
        code: "PROFILE_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json(profile[0], { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}