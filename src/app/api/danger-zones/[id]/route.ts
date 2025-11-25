import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dangerZones } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const dangerZoneId = parseInt(id);

    // Check if danger zone exists
    const existingZone = await db
      .select()
      .from(dangerZones)
      .where(eq(dangerZones.id, dangerZoneId))
      .limit(1);

    if (existingZone.length === 0) {
      return NextResponse.json(
        { 
          error: 'Danger zone not found',
          code: 'NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      name,
      latitude,
      longitude,
      radius,
      riskLevel,
      crimeRate,
      description,
      active
    } = body;

    // Validate riskLevel if provided
    if (riskLevel !== undefined) {
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
    }

    // Validate crimeRate if provided
    if (crimeRate !== undefined) {
      if (typeof crimeRate !== 'number' || crimeRate < 0 || crimeRate > 100) {
        return NextResponse.json(
          {
            error: 'Crime rate must be a number between 0 and 100',
            code: 'INVALID_CRIME_RATE'
          },
          { status: 400 }
        );
      }
    }

    // Validate latitude if provided
    if (latitude !== undefined) {
      if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return NextResponse.json(
          {
            error: 'Latitude must be a number between -90 and 90',
            code: 'INVALID_LATITUDE'
          },
          { status: 400 }
        );
      }
    }

    // Validate longitude if provided
    if (longitude !== undefined) {
      if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return NextResponse.json(
          {
            error: 'Longitude must be a number between -180 and 180',
            code: 'INVALID_LONGITUDE'
          },
          { status: 400 }
        );
      }
    }

    // Validate radius if provided
    if (radius !== undefined) {
      if (typeof radius !== 'number' || radius <= 0) {
        return NextResponse.json(
          {
            error: 'Radius must be a positive number',
            code: 'INVALID_RADIUS'
          },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) updates.name = name.trim();
    if (latitude !== undefined) updates.latitude = latitude;
    if (longitude !== undefined) updates.longitude = longitude;
    if (radius !== undefined) updates.radius = radius;
    if (riskLevel !== undefined) updates.riskLevel = riskLevel;
    if (crimeRate !== undefined) updates.crimeRate = crimeRate;
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (active !== undefined) updates.active = Boolean(active);

    // Update danger zone
    const updated = await db
      .update(dangerZones)
      .set(updates)
      .where(eq(dangerZones.id, dangerZoneId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update danger zone',
          code: 'UPDATE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}