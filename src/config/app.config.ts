/**
 * Centralized Application Configuration
 * All environment variables and app settings are defined here
 */

// Supabase Configuration
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

// Stripe Configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
} as const;

// Email Configuration (SMTP - Titan Email)
export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.titan.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@eastatwest.com',
  toEmail: process.env.NOTIFICATION_EMAIL || 'admin@eastatwest.com',
} as const;

// Application Settings
export const appConfig = {
  name: 'East at West Restaurant',
  description: 'Authentic Asian cuisine in the heart of the city',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  locale: 'en-US',
  currency: 'USD',
  timezone: 'America/New_York',
} as const;

// Feature Flags
export const features = {
  enableOnlineOrdering: true,
  enableReservations: true,
  enableBlog: true,
  enableComments: true,
  enableNewsletterSignup: false,
  enableLoyaltyProgram: false,
} as const;

// Business Hours
export const businessHours = {
  monday: { open: '11:00', close: '22:00', closed: false },
  tuesday: { open: '11:00', close: '22:00', closed: false },
  wednesday: { open: '11:00', close: '22:00', closed: false },
  thursday: { open: '11:00', close: '22:00', closed: false },
  friday: { open: '11:00', close: '23:00', closed: false },
  saturday: { open: '11:00', close: '23:00', closed: false },
  sunday: { open: '12:00', close: '21:00', closed: false },
} as const;

// Reservation Settings
export const reservationConfig = {
  minPartySize: 1,
  maxPartySize: 12,
  timeSlotDuration: 30, // minutes
  advanceBookingDays: 30,
  minAdvanceHours: 2,
} as const;

// Order Settings
export const orderConfig = {
  minimumOrderAmount: 10,
  deliveryFee: 5,
  freeDeliveryThreshold: 50,
  processingFee: 0, // Stripe fee is handled automatically
} as const;

// Contact Information
export const contactInfo = {
  phone: '+1 (555) 123-4567',
  email: 'info@eastatwest.com',
  address: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
  },
  social: {
    facebook: 'https://facebook.com/eastatwest',
    instagram: 'https://instagram.com/eastatwest',
    twitter: 'https://twitter.com/eastatwest',
  },
} as const;

// Validate required environment variables
export function validateConfig() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
  ];

  const missing = requiredEnvVars.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Helper to check if we're in production
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';
