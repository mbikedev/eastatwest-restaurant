# Admin Reservations Dashboard

This document describes the staff admin dashboard for managing pending reservations with conflict detection.

## Features

### 🎯 Core Functionality
- **Staff-Only Access**: RLS (Row Level Security) ensures only users with `admin` role can access
- **Pending Reservations**: Lists all reservations with `status = 'pending'`
- **Approve/Reject**: One-click approval or rejection of reservations
- **Conflict Detection**: Highlights overlapping reservations on the same date/time
- **Real-time Updates**: Automatic refresh after actions

### 🔒 Security
- **Role-Based Access**: Uses Supabase RLS policies with admin role checking
- **JWT Validation**: Checks user role from JWT tokens
- **Error Handling**: Graceful fallbacks for access control

### ⚠️ Conflict Detection
- **Visual Warnings**: Red highlighting for conflicting reservations
- **Detailed Information**: Shows exactly which reservations overlap
- **SQL Function**: Uses `check_reservation_overlap()` for efficient detection
- **Client-side Fallback**: Backup conflict detection if SQL function fails

## Setup Instructions

### 1. Database Migrations

Run the following migrations in order:

```bash
# Apply the overlap constraint migration (includes conflict detection functions)
supabase db reset --linked
# or apply individual migrations:
# supabase migration up 20250628030000_add_overlap_constraint
```

### 2. Staff User Setup

To grant admin access to a user:

```sql
-- Option 1: Update user metadata (recommended for testing)
UPDATE auth.users 
SET user_metadata = jsonb_set(user_metadata, '{role}', '"admin"')
WHERE email = 'staff@example.com';

-- Option 2: Update app metadata (for production)
UPDATE auth.users 
SET app_metadata = jsonb_set(app_metadata, '{role}', '"admin"')
WHERE email = 'staff@example.com';
```

### 3. Optional: Strict Non-Overlap Constraint

To enable strict database-level overlap prevention, uncomment the EXCLUDE constraint in the migration:

```sql
-- In migration file: 20250628030000_add_overlap_constraint.sql
-- Uncomment lines 16-28 to enable strict overlap prevention

ALTER TABLE public.reservations 
ADD CONSTRAINT no_overlapping_reservations 
EXCLUDE USING gist (
  reservation_date WITH =,
  tsrange(
    (reservation_date || ' ' || start_time)::timestamp,
    (reservation_date || ' ' || end_time)::timestamp,
    '[)'
  ) WITH &&
) 
WHERE (status != 'cancelled');
```

⚠️ **Warning**: This will prevent any overlapping reservations from being inserted into the database. Apply only if your business requires strict non-overlap enforcement.

## Usage

### Accessing the Dashboard

1. Navigate to `/admin/reservations`
2. Log in as a user with admin role
3. View pending reservations with conflict highlights

### Managing Reservations

#### Approving Reservations
- Click **"Approve"** button to change status to `confirmed`
- Reservation will no longer appear in pending list
- Customer receives confirmation

#### Rejecting Reservations
- Click **"Reject"** button to change status to `cancelled`
- Reservation will no longer appear in pending list
- Customer should be notified of rejection

#### Handling Conflicts
- **Red highlighted reservations** have time conflicts
- Review conflicting reservation details
- Decide whether to:
  - Approve both (if capacity allows)
  - Approve one and reject the other
  - Contact customers to reschedule

### Conflict Detection Logic

Two reservations conflict if:
1. Same reservation date
2. Both are not cancelled
3. Time ranges overlap: `start1 < end2 AND start2 < end1`

## Database Functions

### `check_reservation_overlap()`

Efficiently finds overlapping reservations:

```sql
SELECT * FROM check_reservation_overlap(
  '2024-12-25',  -- reservation_date
  '18:00',       -- start_time
  '20:00',       -- end_time
  null           -- exclude_id (optional)
);
```

### `reservation_conflicts` View

Pre-computed view showing all reservations with conflict counts:

```sql
SELECT * FROM reservation_conflicts 
WHERE conflict_count > 0;
```

## File Structure

```
src/app/admin/reservations/
└── page.tsx                    # Main admin dashboard component

supabase/migrations/
├── 20250628015333_create_reservations.sql     # Base reservations table
├── 20250628020000_update_rls_policies.sql     # RLS policies with staff access
└── 20250628030000_add_overlap_constraint.sql  # Conflict detection & constraints
```

## RLS Policies

The admin dashboard relies on these Supabase RLS policies:

1. **customer access**: Customers can CRUD their own reservations
2. **public insert**: Anonymous users can create reservations
3. **staff management**: Admin users can manage ALL reservations

```sql
-- Staff can access everything
CREATE POLICY "staff management" ON public.reservations
FOR ALL
USING (
  auth.role() = 'service_role' OR 
  (auth.jwt() ->> 'role') = 'admin'
);
```

## Troubleshooting

### Access Denied
- Verify user has `admin` role in user_metadata or app_metadata
- Check RLS policies are enabled and correct
- Ensure user is authenticated

### Conflicts Not Detected
- Check if `check_reservation_overlap()` function exists
- Verify `btree_gist` extension is installed
- Review client-side fallback logic

### Database Errors
- Check Supabase logs for constraint violations
- Verify all migrations have been applied
- Ensure proper indexes exist for performance

## Performance Considerations

- **Indexes**: Migration includes optimized indexes for conflict detection
- **RLS**: Policies are optimized for admin access patterns
- **Caching**: Consider adding Redis caching for high-traffic scenarios
- **Pagination**: Add pagination for large numbers of pending reservations

## Future Enhancements

- **Email Notifications**: Automatic customer notifications on approve/reject
- **Bulk Actions**: Select multiple reservations for batch operations
- **Calendar View**: Visual calendar showing all reservations and conflicts
- **Analytics**: Dashboard showing reservation patterns and conflicts
- **Audit Log**: Track all staff actions for compliance
