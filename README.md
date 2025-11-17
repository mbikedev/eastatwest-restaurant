# East at West Restaurant

[![Netlify Status](https://api.netlify.com/api/v1/badges/0c104db5-7908-463e-a098-cf776c2ac2e8/deploy-status)](https://app.netlify.com/projects/eastatwest-restaurant/deploys)

A comprehensive, production-ready Lebanese restaurant web application featuring online reservations, takeaway ordering with payments, multilingual content management, and an admin dashboard.

## Overview

East at West is a modern full-stack restaurant website built with Next.js 15 and React 19, offering a complete digital presence for a Lebanese restaurant in Brussels. The application combines elegant UI with powerful backend functionality to manage reservations, orders, blog content, and customer interactions.

## Key Features

### Customer-Facing Features
- **Smart Reservation System** - Intelligent auto-approval based on party size (1-6 guests auto-confirmed, 7-22 require approval)
- **Online Takeaway Ordering** - Full e-commerce experience with Stripe payment integration
- **Multilingual Support** - Complete i18n implementation (English, French, Dutch)
- **Digital Menu** - Database-driven menu with 9+ categories and multilingual descriptions
- **Blog & Content** - Dynamic blog system with commenting and moderation
- **Gallery** - Image showcase with responsive layouts
- **Contact Integration** - Form submissions with email notifications and Google reCAPTCHA protection

### Admin Features
- **Admin Dashboard** - Protected route with email whitelist authentication
- **Reservation Management** - Approve/reject reservations with automated email notifications
- **Order Management** - Track takeaway orders from placement to completion
- **Comment Moderation** - Review and approve blog comments
- **Email Notifications** - Comprehensive notification system for all major events

### Technical Highlights
- **Performance Optimized** - AVIF/WebP image formats, aggressive caching, code splitting
- **Secure** - Row Level Security (RLS), passwordless authentication, reCAPTCHA, CSP headers
- **SEO-Ready** - Meta tags, Open Graph, structured data (FAQ Schema), canonical URLs
- **Mobile-First** - Responsive design with reduced motion support for accessibility
- **Type-Safe** - Full TypeScript implementation with strict mode

## Tech Stack

### Frontend
- **Next.js** 15.3.4 (App Router, Server Components)
- **React** 19.0.0
- **TypeScript** 5
- **Tailwind CSS** 4.1.11
- **Framer Motion** 12.23.0 (animations)
- **i18next** 25.2.1 (internationalization)

### Backend & Database
- **Supabase** - PostgreSQL database with Row Level Security
- **Supabase Auth** - Magic link authentication for admins
- **20+ API Routes** - RESTful endpoints for all operations

### Payment & Email
- **Stripe** 18.4.0 - Payment processing with webhook integration
- **Nodemailer** 6.9.15 - SMTP email service (supports Titan Email, Gmail, etc.)

### Developer Tools
- **ESLint** 9 with Next.js config
- **Playwright** 1.54.2 (E2E testing)
- **PostCSS** 8.5.6 with Autoprefixer

## Project Structure

```
eastatwest-restaurant/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/          # Public pages (home, menu, reservations, etc.)
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Protected admin dashboard
│   │   └── api/               # 20+ API endpoints
│   ├── components/            # Reusable React components
│   ├── lib/                   # Core utilities (Supabase, email, blog)
│   ├── context/               # React Context (Cart, Theme)
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript definitions
│   └── config/                # Centralized configuration
├── public/
│   ├── locales/               # Translation files (en, fr, nl)
│   └── images/                # Optimized static assets
├── database/                  # SQL scripts and migrations
└── scripts/                   # Utility scripts (testing, deployment)
```

## Database Schema

### Core Tables
- **reservations** - Customer bookings with status tracking
- **orders** & **order_items** - E-commerce order management
- **products** - Multilingual menu items
- **blogs** & **blog_comments** - Content management system
- **admin_users** - Staff authentication
- **restaurant_tables** - Table availability tracking

All tables include Row Level Security policies and proper indexing for performance.

## Environment Variables

### Required Configuration

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# SMTP Email (Titan Email / Gmail / etc.)
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_USER=your_email@eastatwest.com
SMTP_PASS=your_email_password
SMTP_FROM_EMAIL=your_email@eastatwest.com

# Google Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
RECAPTCHA_SECRET_KEY=

# Application
NEXT_PUBLIC_BASE_URL=
NOTIFICATION_EMAIL=
```

## Installation & Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase account
- Stripe account
- SMTP Email account (Titan Email via Hostinger, Gmail, or similar)

### Local Development

```bash
# Clone the repository
git clone https://github.com/mbikedev/eastatwest-restaurant.git
cd eastatwest-restaurant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
# Execute SQL scripts in database/scripts/ in your Supabase dashboard

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test:email       # Test email functionality
npm run test:auth-emails # Test authentication emails
```

## Deployment

### Netlify Configuration

The application is optimized for Netlify deployment with:
- Automatic builds from the Master branch
- Next.js plugin for optimal performance
- Security headers (X-Frame-Options, CSP, etc.)
- Aggressive caching strategy:
  - Static assets: 1 year immutable
  - HTML pages: 1 hour with revalidation
  - Next.js data: 1 year immutable

### Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Node Version**: 18

### Performance Features
- AVIF and WebP image optimization
- Font preconnect optimization
- Reduced motion support
- Code splitting and tree shaking
- Console removal in production

## Admin Access

Admin features are protected by email whitelist authentication. Authorized users receive magic link emails to access:
- `/admin/reservations` - Manage bookings
- `/admin/orders` - Track takeaway orders
- `/admin/comments` - Moderate blog comments

## API Endpoints

The application includes 20+ API routes:

### Authentication
- `POST /api/auth/send-magic-link`
- `POST /api/auth/send-password-reset`

### Reservations
- `POST /api/admin/add-reservation`
- `POST /api/admin/delete-reservation`
- `POST /api/cancel-reservation`

### Orders & Payments
- `POST /api/orders`
- `GET /api/orders`
- `POST /api/create-payment-intent`
- `POST /api/webhooks/stripe`

### Email Notifications
- `POST /api/send-reservation-email`
- `POST /api/send-notification-emails`
- `POST /api/send-order-email`
- And more...

### Utilities
- `POST /api/verify-recaptcha`
- `GET /api/products`

## Security

- **Row Level Security** - Database policies for data access control
- **Passwordless Auth** - Magic link authentication via Supabase
- **Email Whitelist** - Only authorized emails can access admin features
- **reCAPTCHA v3** - Bot protection on forms (0.5+ score threshold)
- **Content Security Policy** - Strict CSP headers for image optimization
- **HTTPS Only** - Enforced via Netlify
- **Input Sanitization** - SSR-safe sanitization for user content

## Internationalization

The application supports three languages with complete translations:
- **English (en)** - Default
- **French (fr)**
- **Dutch (nl)**

Translation files are located in `public/locales/{lang}/common.json` and include:
- Navigation and UI elements
- Form labels and validation messages
- Email templates
- Error messages
- Content pages

## Browser Support

```
Chrome >= 92
Edge >= 92
Firefox >= 90
Safari >= 15.4
```

Modern browser targeting eliminates unnecessary polyfills and reduces bundle size.

## Contributing

This is a production project. For major changes, please open an issue first to discuss what you would like to change.

## License

Proprietary - All rights reserved
East At West Restaurant
## Contact
mbagnickg@gmail.com
- **Website**: https://eastatwest.com
- **Email**: infos.east.west@gmail.com
- **Repository**: https://github.com/mbikedev/eastatwest-restaurant

## Acknowledgments

- Built with Next.js and React
- Powered by Supabase, Stripe, and Nodemailer
- Email via Titan Email (Hostinger)
- Deployed on Netlify
- Icons by Lucide React
- Animations by Framer Motion

---

**Version Tracking**: The application includes automated version tracking for deployment verification. Check `public/version.txt` for the current build version.
