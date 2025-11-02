# ⚠️ URGENT: Apply Database Migration for "Completed" Status

## Problem
The reservation status "completed" cannot be saved because the database CHECK constraint doesn't allow it.

## Solution - Takes 2 Minutes

### Step 1: Open Supabase SQL Editor

**Click this link:** https://supabase.com/dashboard/project/whixskigyxeligukorrm/sql/new

### Step 2: Copy This SQL

Copy **ONLY** the SQL below (NOT the markdown code fences):

```
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

ALTER TABLE public.reservations
ADD CONSTRAINT reservations_status_check
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

COMMENT ON COLUMN public.reservations.status IS 'Reservation status: pending (for 7+ guests), confirmed, cancelled, completed';
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
