import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { authenticated: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = session.user as any;

    return NextResponse.json({
      authenticated: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
      session,
    });
  } catch (error) {
    console.error('Auth user endpoint error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
