import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sosAlerts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { status, message } = body;

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    if (status && !['active', 'resolved', 'cancelled'].includes(status)) {
      return NextResponse.json({ 
        error: "Status must be 'active', 'resolved', or 'cancelled'",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    const existingAlert = await db.select()
      .from(sosAlerts)
      .where(and(
        eq(sosAlerts.id, parseInt(id)),
        eq(sosAlerts.userId, user.id)
      ))
      .limit(1);

    if (existingAlert.length === 0) {
      return NextResponse.json({ 
        error: 'SOS alert not found',
        code: 'ALERT_NOT_FOUND' 
      }, { status: 404 });
    }

    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (status !== undefined) {
      updates.status = status;
      
      if (status === 'resolved' || status === 'cancelled') {
        updates.resolvedAt = new Date().toISOString();
      }
    }

    if (message !== undefined) {
      updates.message = message;
    }

    const updatedAlert = await db.update(sosAlerts)
      .set(updates)
      .where(and(
        eq(sosAlerts.id, parseInt(id)),
        eq(sosAlerts.userId, user.id)
      ))
      .returning();

    if (updatedAlert.length === 0) {
      return NextResponse.json({ 
        error: 'SOS alert not found',
        code: 'ALERT_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(updatedAlert[0], { status: 200 });

  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}