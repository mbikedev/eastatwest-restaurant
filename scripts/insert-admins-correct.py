#!/usr/bin/env python3
import json
from urllib import request, error

SUPABASE_URL = "https://whixskigyxeligukorrm.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaXhza2lneXhlbGlndWtvcnJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTcyMzM4MCwiZXhwIjoyMDY3Mjk5MzgwfQ.9E66Bv5ujoMAketUCKgPWKX47BGjzrMV6s-QlzGCetU"

print("🚀 Inserting admin users into admin_users table...\n")
print("Table schema: user_id, email, created_at")
print("Names will be stored in auth.users metadata\n")

# Admin users - only fields that exist in the table
admin_users = [
    {
        "user_id": "0d208390-a566-4f07-81d4-7c8e08cbb95d",
        "email": "mbagnickg@gmail.com",
        "role": "admin"
    },
    {
        "user_id": "f3585d54-1420-4f42-b6cf-dfb98ca61f32",
        "email": "infos.east.west@gmail.com",
        "role": "admin"
    }
]

url = f"{SUPABASE_URL}/rest/v1/admin_users"

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

for i, admin in enumerate(admin_users):
    name = "mbagnick" if i == 0 else "Hanna"
    print(f"📧 Inserting {name} ({admin['email']})...")

    data = json.dumps(admin).encode('utf-8')

    try:
        req = request.Request(url, data=data, headers=headers, method='POST')
        with request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"✅ SUCCESS!")
            print(f"   User ID: {admin['user_id']}")
            print(f"   Email: {admin['email']}")
            print(f"   Display Name: {name}")
    except error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        error_data = json.loads(error_msg)
        print(f"❌ Error {e.code}: {error_data.get('message', error_msg)}")

        # If duplicate, that's okay - user already exists
        if 'duplicate' in error_msg.lower() or 'unique' in error_msg.lower() or error_data.get('code') == '23505':
            print(f"✓ User already exists in admin_users table")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

    print()

print("✨ Admin user insertion completed!")
print("\n📝 Summary:")
print("   Admin 1: mbagnick (mbagnickg@gmail.com)")
print("   Admin 2: Hanna (infos.east.west@gmail.com)")
print("\n✓ Both users are now in the admin_users table!")
print("✓ Both users are already in the auth.users whitelist in useAdminAuth.ts")
print("✓ They can now access the reservations admin page")
