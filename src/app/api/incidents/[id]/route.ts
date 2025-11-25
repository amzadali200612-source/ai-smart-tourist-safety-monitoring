import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { incidentReports } from '@/db/schema';
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

    const incidentId = parseInt(id);

    // Parse request body
    const body = await request.json();
    const { status, threatLevel, description } = body;

    // Validate that at least one field is provided
    if (!status && !threatLevel && !description) {
      return NextResponse.json(
        { 
          error: 'At least one field (status, threatLevel, or description) must be provided',
          code: 'NO_FIELDS_PROVIDED' 
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['pending', 'verified', 'resolved'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          error: 'Status must be one of: pending, verified, resolved',
          code: 'INVALID_STATUS' 
        },
        { status: 400 }
      );
    }

    // Validate threatLevel if provided
    const validThreatLevels = ['low', 'medium', 'high'];
    if (threatLevel && !validThreatLevels.includes(threatLevel)) {
      return NextResponse.json(
        { 
          error: 'Threat level must be one of: low, medium, high',
          code: 'INVALID_THREAT_LEVEL' 
        },
        { status: 400 }
      );
    }

    // Check if incident exists
    const existingIncident = await db
      .select()
      .from(incidentReports)
      .where(eq(incidentReports.id, incidentId))
      .limit(1);

    if (existingIncident.length === 0) {
      return NextResponse.json(
        { 
          error: 'Incident not found',
          code: 'INCIDENT_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updateData: {
      status?: string;
      threatLevel?: string;
      description?: string;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (threatLevel) updateData.threatLevel = threatLevel;
    if (description) updateData.description = description;

    // Update the incident
    const updated = await db
      .update(incidentReports)
      .set(updateData)
      .where(eq(incidentReports.id, incidentId))
      .returning();

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