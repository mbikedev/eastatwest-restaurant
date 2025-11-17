# ⚠️ URGENT: Apply Database Migrations for "Completed" Status

## Problem
The reservation status "completed" cannot be saved because:
1. ~~Database CHECK constraint doesn't allow it~~ ✅ FIXED (migration was applied)
2. **RLS (Row Level Security) policies prevent admins from updating customer reservations** ❌ NEEDS FIX

## Root Cause Found
The console showed: `✅ Update response from database: []`

An empty array means the database **rejected** the update due to RLS policies. Currently, only users can update their own reservations. Admins need special permission.

## Solution - Takes 2 Minutes

### Step 1: Open Supabase SQL Editor

**Click this link:** https://supabase.com/dashboard/project/whixskigyxeligukorrm/sql/new

### Step 2: Copy This SQL

Copy **ONLY** the SQL below (NOT the markdown code fences):

**IMPORTANT: Run BOTH migration blocks below:**

#### Migration 1: Add "Completed" to CHECK Constraint (Already Applied ✅)

This migration was already applied - Lucy's reservation shows as "completed" in the database.

#### Migration 2: Fix RLS Policies for Admin Access (APPLY THIS NOW ❌)

```
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;

-- Create new policies that allow admins to manage all reservations
CREATE POLICY "Users and admins can update reservations" ON public.reservations
  FOR UPDATE
  USING (
    auth.email() = email OR
    auth.email() IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

CREATE POLICY "Users and admins can view reservations" ON public.reservations
  FOR SELECT
  USING (
    auth.email() = email OR
    auth.email() IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

CREATE POLICY "Admins can delete reservations" ON public.reservations
  FOR DELETE
  USING (
    auth.email() IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );
```

### Step 3: Paste and Run

1. Paste the SQL into the editor
2. Click **"Run"** button (or press Ctrl+Enter on Windows, Cmd+Enter on Mac)
3. Wait for success message

### Step 4: Verify It Works

1. Go to: https://eastatwest.com/admin/reservations
2. Find any reservation
3. Change status to "Completed"
4. Click the checkmark to save
5. Refresh the page (F5)
6. **The status should still be "Completed"** ✅

---

## Why This is Necessary

The database was originally created with this constraint:

```sql
CHECK (status IN ('pending', 'confirmed', 'cancelled'))
```

Notice that **'completed' is NOT in the list**. The database silently rejects any attempt to set status to 'completed', even though the UI shows it temporarily.

This migration adds 'completed' to the allowed values.

---

## Technical Details

- **File:** `supabase/migrations/20250102000000_add_completed_status.sql`
- **Action:** Updates CHECK constraint on `reservations.status` column
- **Safety:** Uses IF EXISTS to prevent errors if already applied
- **Idempotent:** Can be run multiple times safely

---

## Troubleshooting

### If you see "syntax error"
- Make sure you didn't copy the ``` code fence markers
- Copy only the SQL statements between the fences

### If you see "constraint already exists"
- This means the migration was already partially applied
- Just run it again - the IF EXISTS block will handle it

### If status still doesn't save after migration
- Check browser console for errors (F12)
- Look for detailed error messages from the enhanced logging
- Verify you're logged in as admin: mbagnickg@gmail.com

---

## After Success

Once the migration is applied, you can:
- ✅ Mark reservations as "Completed"
- ✅ Status will persist after page refresh
- ✅ Historical data remains unchanged
- ✅ All other statuses still work normally
