import { NextRequest, NextResponse } from 'next/server';

/**
 * Environment Variable Checker API
 *
 * This endpoint helps debug production issues by checking which
 * environment variables are configured.
 *
 * SECURITY: Does not expose actual values, only checks existence
 */
export async function GET(req: NextRequest) {
  // Check if request has authorization (optional security)
  const authHeader = req.headers.get('authorization');
  const validToken = process.env.ADMIN_CHECK_TOKEN || 'dev-token';

  // Check if public mode is requested (basic health check without details)
  const url = new URL(req.url);
  const publicMode = url.searchParams.get('public') === 'true';

  // In production, require auth unless public mode
  if (process.env.NODE_ENV === 'production' && !publicMode && authHeader !== `Bearer ${validToken}`) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        hint: 'Add ?public=true for basic health check'
      },
      { status: 401 }
    );
  }

  // Public mode returns minimal info
  if (publicMode) {
    const criticalMissing = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) criticalMissing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) criticalMissing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) criticalMissing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!process.env.SENDGRID_API_KEY) criticalMissing.push('SENDGRID_API_KEY');
    if (!process.env.SENDGRID_FROM_EMAIL) criticalMissing.push('SENDGRID_FROM_EMAIL');

    return NextResponse.json({
      status: criticalMissing.length === 0 ? 'healthy' : 'missing_config',
      environment: process.env.NODE_ENV,
      allConfigured: criticalMissing.length === 0,
      criticalMissing,
      timestamp: new Date().toISOString()
    });
  }

  const envStatus = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,

    // Supabase configuration
    supabase: {
      url: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...`
          : 'NOT SET'
      },
      anonKey: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
      },
      serviceRoleKey: {
        exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
      }
    },

    // SendGrid email configuration
    sendgrid: {
      apiKey: {
        exists: !!process.env.SENDGRID_API_KEY,
        length: process.env.SENDGRID_API_KEY?.length || 0,
        startsWithSG: process.env.SENDGRID_API_KEY?.startsWith('SG.') || false
      },
      fromEmail: {
        exists: !!process.env.SENDGRID_FROM_EMAIL,
        value: process.env.SENDGRID_FROM_EMAIL || 'NOT SET'
      }
    },

    // Base URL configuration
    baseUrl: {
      exists: !!process.env.NEXT_PUBLIC_BASE_URL,
      value: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET'
    },

    // Stripe configuration (if used)
    stripe: {
      publishableKey: {
        exists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        length: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0
      },
      secretKey: {
        exists: !!process.env.STRIPE_SECRET_KEY,
        length: process.env.STRIPE_SECRET_KEY?.length || 0
      },
      webhookSecret: {
        exists: !!process.env.STRIPE_WEBHOOK_SECRET,
        length: process.env.STRIPE_WEBHOOK_SECRET?.length || 0
      }
    }
  };

  // Check for critical missing variables
  const criticalMissing = [];

  if (!envStatus.supabase.url.exists) criticalMissing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!envStatus.supabase.anonKey.exists) criticalMissing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!envStatus.supabase.serviceRoleKey.exists) criticalMissing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!envStatus.sendgrid.apiKey.exists) criticalMissing.push('SENDGRID_API_KEY');
  if (!envStatus.sendgrid.fromEmail.exists) criticalMissing.push('SENDGRID_FROM_EMAIL');

  const allConfigured = criticalMissing.length === 0;

  return NextResponse.json({
    status: allConfigured ? 'healthy' : 'missing_config',
    allConfigured,
    criticalMissing,
    envStatus,
    recommendations: criticalMissing.length > 0 ? [
      'Set missing environment variables in your hosting platform',
      'Redeploy the application after setting variables',
      'Check that variable names match exactly (case-sensitive)'
    ] : [
      'All critical environment variables are configured',
      'If issues persist, check variable values are correct',
      'Verify SendGrid API key is valid and has correct permissions'
    ]
  });
}
