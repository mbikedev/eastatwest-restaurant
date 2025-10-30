# East at West Restaurant

A modern, full-stack restaurant web application built with Next.js 15, featuring online ordering, table reservations, blog platform, and comprehensive admin dashboard.

## Features

- **Online Ordering**: Browse menu, add items to cart, and checkout with Stripe payments
- **Reservations System**: Table booking with email notifications and admin approval workflow
- **Blog Platform**: Multi-language blog with nested comments and moderation
- **Admin Dashboard**: Manage orders, reservations, blog posts, and comments
- **Email Notifications**: Automated emails for orders, reservations, and status updates
- **User Authentication**: Secure login system with role-based access control (admin/customer)
- **Responsive Design**: Mobile-first UI built with Tailwind CSS
- **Performance Optimized**: Image optimization, lazy loading, and critical CSS handling

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations

### Backend
- **Supabase** - PostgreSQL database, authentication, and storage
- **Next.js API Routes** - Server-side API endpoints
- **@supabase/ssr** - Server-side rendering support

### Payments & Email
- **Stripe** - Secure payment processing
- **Resend** - Transactional email service

### Tools & Libraries
- **Marked** - Markdown parsing for blog posts
- **DOMPurify** - XSS protection for user-generated content
- **Highlight.js** - Code syntax highlighting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Stripe account ([stripe.com](https://stripe.com))
- Resend account ([resend.com](https://resend.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mbikedev/eastatwest-restaurant.git
   cd eastatwest-restaurant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

   Fill in your credentials in `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx

   # Resend (Email)
   RESEND_API_KEY=re_xxx
   NOTIFICATION_EMAIL=admin@yourdomain.com

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   Run the SQL migration scripts in order from `database/scripts/`:
   ```bash
   # In Supabase SQL Editor, run these files in order:
   1. database_setup.sql           # Creates tables and RLS policies
   2. create_user.sql              # Creates admin user account
   3. COMPLETE_PRODUCTS_SETUP.sql  # Adds sample products/menu items
   4. complete_blog_setup.sql      # Sets up blog structure
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
eastatwest-restaurant/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── admin/               # Admin dashboard (protected)
│   │   │   ├── comments/        # Comment moderation
│   │   │   ├── orders/          # Order management
│   │   │   └── reservations/    # Reservation management
│   │   ├── api/                 # API routes
│   │   │   ├── orders/          # Order endpoints
│   │   │   ├── products/        # Product endpoints
│   │   │   ├── send-*-email/    # Email notification endpoints
│   │   │   └── webhooks/        # Stripe webhooks
│   │   ├── blog/                # Blog pages
│   │   │   └── [slug]/          # Individual blog posts
│   │   ├── reservations/        # Reservation booking page
│   │   ├── takeaway/            # Online ordering
│   │   │   └── checkout/        # Checkout flow
│   │   ├── login/               # Authentication
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Homepage
│   ├── components/              # React components
│   │   ├── CommentSection.jsx   # Blog comment system
│   │   ├── ErrorBoundary.tsx    # Error handling
│   │   ├── Header.tsx           # Navigation header
│   │   └── ...                  # Other components
│   ├── context/                 # React Context providers
│   │   ├── CartContext.tsx      # Shopping cart state
│   │   └── AuthContext.tsx      # Authentication state
│   ├── lib/                     # Utility functions
│   │   ├── supabaseClient.ts    # Browser Supabase client
│   │   ├── supabaseServer.ts    # Server Supabase client
│   │   ├── products.ts          # Product data access layer
│   │   ├── blog.ts              # Blog data access layer
│   │   ├── commentUtils.ts      # Comment operations
│   │   └── emailNotifications.ts # Email service
│   ├── types/                   # TypeScript type definitions
│   │   ├── blog.ts
│   │   ├── comments.ts
│   │   └── ...
│   └── config/                  # Configuration files
│       └── app.config.ts        # Centralized app config
├── public/                      # Static assets
│   ├── images/                  # Image files
│   └── ...
├── database/                    # Database setup
│   ├── scripts/                 # SQL setup scripts
│   └── migrations/              # Supabase migrations
├── docs/                        # Documentation
│   └── setup/                   # Setup guides
├── supabase/                    # Supabase config
│   └── migrations/              # Schema migrations
├── .env.local                   # Environment variables (create this)
├── env.example                  # Example env file
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS config
└── package.json                 # Dependencies
```

## Key Features Explained

### Online Ordering System
- Browse products by category (sandwiches, sides, drinks, desserts)
- Shopping cart with React Context for state management
- Secure checkout with Stripe Payment Intents
- Order confirmation emails sent automatically
- Admin dashboard for order management and fulfillment

### Reservation System
- Interactive date and time picker
- Real-time table availability checking
- Special requests and party size selection
- Email notifications for customers and restaurant staff
- Admin approval workflow with status tracking
- Cancellation support with email notifications

### Blog Platform
- Multi-language support (English, Chinese, more languages easily added)
- Rich markdown content with syntax highlighting for code blocks
- Nested comment system with threaded replies
- Comment moderation by admins before public display
- Admin reply capability with visual indicators
- SEO-optimized with dynamic metadata

### Admin Dashboard
- Protected routes using Supabase Row Level Security
- Real-time order and reservation management
- Comment moderation interface with approve/delete actions
- Email notification triggers for customer communication
- Statistics and overview dashboards

## Environment Variables

All environment variables are managed in `.env.local`. See `env.example` for the complete list.

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_) | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |
| `RESEND_API_KEY` | Resend API key for sending emails | Yes |
| `NOTIFICATION_EMAIL` | Email address to receive notifications | Yes |
| `NEXT_PUBLIC_APP_URL` | Your application URL | No |

## Database Schema

### Main Tables
- **products** - Menu items, sides, drinks, and desserts
- **orders** - Customer orders with line items
- **reservations** - Table reservations with approval status
- **blogs** - Blog posts with multi-language support
- **comments** - Blog comments with nested replies and moderation
- **users** - User accounts (managed by Supabase Auth)

All tables have Row Level Security (RLS) policies enabled. See `database/scripts/database_setup.sql` for the complete schema.

## API Routes

### Public Routes
- `GET /api/products` - Fetch all products or filter by category
- `POST /api/orders` - Create a new order
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/send-reservation-email` - Submit reservation request
- `POST /api/cancel-reservation` - Cancel a reservation
- `GET /api/check-table` - Check table availability

### Admin Routes (Authentication Required)
- `POST /api/send-approval-notification` - Approve order/reservation
- `POST /api/send-customer-notification` - Send notification to customer
- `DELETE /api/admin/delete-reservation` - Delete a reservation
- `PATCH /api/orders/[id]` - Update order status

### Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe payment events

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy automatically

### Post-Deployment Setup

1. **Configure Stripe Webhooks**
   - Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

2. **Configure Supabase**
   - Add your deployment URL to "Redirect URLs" in Supabase Auth settings
   - Update CORS settings if needed

3. **Test Email Delivery**
   - Send a test email to verify Resend integration
   - Check spam folders if emails aren't received

## Development

### Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
npm run type-check   # TypeScript type checking
```

### Code Style & Standards
- TypeScript for type safety throughout the codebase
- ESLint for code quality and consistency
- Functional components with React Hooks
- Server Components by default (use 'use client' when needed)

## Security Features

- **Row Level Security (RLS)** - All Supabase tables have RLS policies
- **Server-Side Validation** - API routes validate all inputs
- **Environment Variables** - Secrets stored securely, never committed
- **XSS Protection** - DOMPurify sanitizes user-generated content
- **CSRF Protection** - Supabase handles CSRF tokens
- **Stripe Webhook Verification** - Signatures verified before processing
- **Authentication** - Supabase Auth with secure session management

## Troubleshooting

### Common Issues

**Issue**: Orders not appearing in admin dashboard
- Check that RLS policies are correctly set up in Supabase
- Verify the admin user has the correct role in `user_metadata`

**Issue**: Emails not sending
- Verify `RESEND_API_KEY` is correct
- Check that sender email is verified in Resend dashboard
- Look for errors in the API route logs

**Issue**: Stripe payments failing
- Ensure webhook secret matches Stripe dashboard
- Check that publishable and secret keys are for the same environment (test/live)
- Verify webhook endpoint is accessible from the internet

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with descriptive messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is private and proprietary.

## Support & Contact

For questions, issues, or support:
- **GitHub Issues**: [Create an issue](https://github.com/mbikedev/eastatwest-restaurant/issues)
- **Email**: info@eastatwest.com
- **Phone**: +32 496 93 57 45

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Stripe](https://stripe.com/) - Payment processing platform
- [Vercel](https://vercel.com/) - Deployment and hosting
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

**Built with ❤️ by the East at West team**

*Where East meets West in every bite!* 🍽️
