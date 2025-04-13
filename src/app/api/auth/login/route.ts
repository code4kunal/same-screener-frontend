import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with actual authentication logic
    // For now, we'll just check for a hardcoded test user
    if (email === 'test@example.com' && password === 'password') {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      };

      // Set session cookie
      const response = NextResponse.json(user);
      response.cookies.set('session', 'valid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 