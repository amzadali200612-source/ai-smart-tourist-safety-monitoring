import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { incidentReports } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);

    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Valid userId is required',
          code: 'INVALID_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Parse pagination parameters
    const limit = Math.min(
      parseInt(searchParams.get('limit') ?? '20'),
      100
    );
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const statusFilter = searchParams.get('status');

    // Build query
    let query = db
      .select()
      .from(incidentReports)
      .where(eq(incidentReports.userId, userId))
      .orderBy(desc(incidentReports.createdAt));

    // Add status filter if provided
    if (statusFilter) {
      query = db
        .select()
        .from(incidentReports)
        .where(
          and(
            eq(incidentReports.userId, userId),
            eq(incidentReports.status, statusFilter)
          )
        )
        .orderBy(desc(incidentReports.createdAt));
    }

    // Execute query with pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET incident reports error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}