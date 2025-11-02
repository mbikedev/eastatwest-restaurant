#!/usr/bin/env python3
import json
from urllib import request, error, parse

SUPABASE_URL = "https://whixskigyxeligukorrm.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaXhza2lneXhlbGlndWtvcnJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTcyMzM4MCwiZXhwIjoyMDY3Mjk5MzgwfQ.9E66Bv5ujoMAketUCKgPWKX47BGjzrMV6s-QlzGCetU"

print("🚀 Inserting admin users into admin_users table...\n")

# Admin users with correct schema: user_id, email, name
admin_users = [
    {
        "user_id": "0d208390-a566-4f07-81d4-7c8e08cbb95d",
        "email": "mbagnickg@gmail.com",
        "name": "mbagnick"
    },
    {
        "user_id": "f3585d54-1420-4f42-b6cf-dfb98ca61f32",
        "email": "infos.east.west@gmail.com",
        "name": "Hanna"
    }
]

url = f"{SUPABASE_URL}/rest/v1/admin_users"

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

for admin in admin_users:
    print(f"📧 Inserting {admin['name']} ({admin['email']})...")

    data = json.dumps(admin).encode('utf-8')

    try:
        req = request.Request(url, data=data, headers=headers, method='POST')
        with request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"✅ SUCCESS!")
            print(f"   User ID: {admin['user_id']}")
            print(f"   Email: {admin['email']}")
            print(f"   Name: {admin['name']}")
    except error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"❌ Error {e.code}: {error_msg}")

        # If duplicate, try to update
        if 'duplicate' in error_msg.lower() or 'unique' in error_msg.lower():
            print("   User might already exist, trying to update...")
            update_url = f"{url}?user_id=eq.{admin['user_id']}"
            update_headers = headers.copy()

            try:
                req = request.Request(update_url, data=data, headers=update_headers, method='PATCH')
                with request.urlopen(req) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    print(f"✅ Updated successfully!")
            except Exception as update_error:
                print(f"❌ Update failed: {update_error}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

print("\n✨ Admin user insertion completed!")
print("\n📝 Summary:")
print("   Admin 1: mbagnick (mbagnickg@gmail.com)")
print("   Admin 2: Hanna (infos.east.west@gmail.com)")
print("\nBoth users should now appear in the admin_users table!")
