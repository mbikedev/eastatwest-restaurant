# Fix for "Completed" Status Not Saving

## Problem Identified

The reservation status does not persist when set to "completed" because the database CHECK constraint only allows these values:
- `'pending'`
- `'confirmed'`
- `'cancelled'`

The `'completed'` status is **NOT** in the allowed list, so the database rejects the update even though the UI temporarily shows it.

## Solution

Run the following SQL migration to add `'completed'` to the allowed status values.

## Steps to Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project for eastatwest.com
3. Click on **SQL Editor** in the left sidebar
4. Click **"New Query"**
5. Copy and paste the following SQL:

```sql
-- First, check if the constraint exists and drop it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'reservations_status_check'
        AND conrelid = 'public.reservations'::regclass
    ) THEN
        ALTER TABLE public.reservations DROP CONSTRAINT reservations_status_check;
    END IF;
END $$;

-- Add new constraint including 'completed' status
ALTER TABLE public.reservations
ADD CONSTRAINT reservations_status_check
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Update comment
COMMENT ON COLUMN public.reservations.status IS 'Reservation status: pending (for 7+ guests), confirmed, cancelled, completed';
```

6. Click **"Run"** or press `Ctrl+Enter`
7. Verify the success message appears

### Option 2: Using Supabase CLI

If you have the Supabase CLI set up and linked:

```bash
# Make sure you're in the project directory
cd /Users/mbike/Documents/Eastatwest-site/eastatwest-restaurant-main4

# Apply the migration
npx supabase db push
```

## Verification

After running the SQL:

1. Go to your admin reservations page: https://eastatwest.com/admin/reservations
2. Find any reservation
3. Change its status to "Completed"
4. Refresh the page
5. Verify the status is still "Completed"

## Technical Details

**Root Cause:**
- Database table: `public.reservations`
- Column: `status VARCHAR(50)`
- Original CHECK constraint: `CHECK (status IN ('pending', 'confirmed', 'cancelled'))`
- Missing value: `'completed'`

**Fix:**
- Drop old constraint
- Add new constraint with `'completed'` included
- Update column comment for documentation

**Files Created:**
- Migration file: `/supabase/migrations/20250102000000_add_completed_status.sql`
- This guide: `FIX_COMPLETED_STATUS.md`

## After Applying the Fix

The status changes will now persist correctly:
- **Pending** → Still works
- **Confirmed** → Still works
- **Cancelled** → Still works
- **Completed** → ✅ NOW WORKS (previously failed silently)

## Troubleshooting

### If the migration fails:

1. Check if the constraint name is different:
   ```sql
   -- Check existing constraints
   SELECT constraint_name, check_clause
   FROM information_schema.check_constraints
   WHERE constraint_schema = 'public'
   AND constraint_name LIKE '%reservations%status%';
   ```

2. Use the exact constraint name found above in the DROP statement

3. If constraint doesn't exist, just run the ADD part:
   ```sql
   ALTER TABLE public.reservations
   ADD CONSTRAINT reservations_status_check
   CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));
   ```

## Related Files

- Database schema: `/supabase/migrations/20250628015333_create_reservations.sql`
- Admin page: `/src/app/admin/reservations/page.tsx`
- Migration file: `/supabase/migrations/20250102000000_add_completed_status.sql`
