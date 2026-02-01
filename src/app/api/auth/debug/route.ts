import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check authentication status and session details
 * GET /api/auth/debug
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD ? '***' : 'NOT SET';

    return NextResponse.json({
      debug: true,
      timestamp: new Date().toISOString(),
      sessionExists: !!session,
      session: session ? {
        user: {
          email: session.user?.email,
          name: session.user?.name,
          role: (session.user as any)?.role || 'not set',
        },
        expires: session.expires,
      } : null,
      environment: {
        adminEmailConfigured: !!adminEmail,
        adminEmail: adminEmail || 'NOT SET',
        adminPasswordConfigured: !!process.env.ADMIN_PASSWORD,
        nodeEnv: process.env.NODE_ENV,
      },
      nextAuthUrl: process.env.NEXTAUTH_URL,
      message: 'Debug information for authentication',
    });
  } catch (error) {
    console.error('Auth debug endpoint error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get debug info',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
