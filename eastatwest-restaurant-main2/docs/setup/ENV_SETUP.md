# Environment Variables Setup

## Quick Fix for Supabase Error

The "Supabase error: {}" is occurring because the environment variables are not configured. Here's how to fix it:

### 1. Create .env.local file

Create a file named `.env.local` in your project root (same level as package.json) with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://whixskigyxeligukorrm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaXhza2lneXhlbGlndWtvcnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjMzODAsImV4cCI6MjA2NzI5OTM4MH0.VE9SqC8EIVhIm5Tt73F7YqHh9U3MvWQLuQXJx8xyN0c
```

### 2. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Go to Settings → API
4. Copy the following values:
   - **Project URL** (https://whixskigyxeligukorrm.supabase.co)
   - **Anon (public) key** (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaXhza2lneXhlbGlndWtvcnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjMzODAsImV4cCI6MjA2NzI5OTM4MH0.VE9SqC8EIVhIm5Tt73F7YqHh9U3MvWQLuQXJx8xyN0c)

### 3. Update .env.local

Replace the placeholder values in your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Restart Your Development Server

After updating the `.env.local` file:

```bash
npm run dev
```

### 5. Test the Reservation Form

The reservation form should now work without the "Supabase error: {}" message.

## Alternative: Temporary Disable Supabase

If you want to test the form without Supabase for now, you can temporarily modify the `handleSubmit` function in `src/app/reservations/page.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Temporary: Skip Supabase and show success message
  setTimeout(() => {
    const guest_count = Number(form.guests);
    if (guest_count >= 7) {
      toast.success(t('reservations.pending'));
    } else {
      toast.success(t('reservations.confirmed'));
    }
    
    // Reset form
    setForm({
      name: "",
      email: "",
      phone: "",
      startTime: "",
      endTime: "",
      guests: "",
      specialRequests: "",
      date: "",
    });
    setIsSubmitting(false);
  }, 1000);
};
```

## Database Setup

Once you have Supabase configured, you'll need to create the database tables. See `SUPABASE_SETUP.md` for complete database setup instructions.

## Troubleshooting

- **"Module not found" errors**: Make sure you've installed `@supabase/supabase-js` and `@supabase/ssr`
- **Environment variables not loading**: Restart your development server after creating `.env.local`
- **CORS errors**: Check your Supabase project settings
- **Authentication errors**: Verify your environment variables are correct 