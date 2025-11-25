import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatMessages } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

function generateAIResponse(userMessage: string): string {
  const messageLower = userMessage.toLowerCase();
  
  if (messageLower.includes('danger') || messageLower.includes('safety')) {
    return "Here are some important safety tips for tourists:\n\n" +
           "1. Always keep your valuables secure and out of sight\n" +
           "2. Stay in well-lit, populated areas, especially at night\n" +
           "3. Keep digital copies of important documents\n" +
           "4. Share your location with trusted contacts\n" +
           "5. Trust your instincts - if something feels wrong, leave the area\n\n" +
           "Would you like specific safety information about a particular area?";
  }
  
  if (messageLower.includes('help') || messageLower.includes('emergency')) {
    return "Emergency Contacts:\n\n" +
           "🚨 Emergency Services: 911\n" +
           "👮 Police: 911\n" +
           "🚑 Ambulance: 911\n" +
           "🚒 Fire Department: 911\n\n" +
           "💡 Tip: Use the SOS button in the app to alert your emergency contacts and share your location automatically.\n\n" +
           "Are you in immediate danger? If so, please call emergency services right away.";
  }
  
  if (messageLower.includes('police') || messageLower.includes('hospital')) {
    return "I can help you find nearby safety resources!\n\n" +
           "🏥 Hospitals and Medical Centers\n" +
           "👮 Police Stations\n" +
           "🏛️ Embassy Locations\n\n" +
           "Check the 'Safety Resources' section in the app to see locations near you on the map, " +
           "complete with addresses, phone numbers, and directions.\n\n" +
           "Would you like me to help you with anything else?";
  }
  
  return "Hello! I'm your personal safety assistant. I can help you with:\n\n" +
         "✓ Safety tips and advice for tourists\n" +
         "✓ Information about danger zones and safe areas\n" +
         "✓ Emergency contacts and resources\n" +
         "✓ Nearby police stations, hospitals, and embassies\n" +
         "✓ What to do in case of an emergency\n\n" +
         "How can I assist you today?";
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED'
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Message is required and must be a non-empty string',
          code: 'MISSING_MESSAGE'
        },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    const currentTimestamp = new Date().toISOString();

    const userMessageData = {
      userId: user.id,
      message: trimmedMessage,
      sender: 'user',
      timestamp: currentTimestamp,
    };

    const [userMessage] = await db
      .insert(chatMessages)
      .values(userMessageData)
      .returning();

    const aiResponseText = generateAIResponse(trimmedMessage);
    const aiTimestamp = new Date().toISOString();

    const aiMessageData = {
      userId: user.id,
      message: aiResponseText,
      sender: 'ai',
      timestamp: aiTimestamp,
    };

    const [aiResponse] = await db
      .insert(chatMessages)
      .values(aiMessageData)
      .returning();

    return NextResponse.json(
      {
        userMessage,
        aiResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}