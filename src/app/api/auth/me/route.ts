import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const hasSession = cookieStore.has('session');
    
    if (!hasSession) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // TODO: Replace with actual user data from your database
    // For now, we'll return the test user
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User'
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 