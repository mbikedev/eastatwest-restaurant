#!/usr/bin/env python3
import json
from urllib import request

SUPABASE_URL = "https://whixskigyxeligukorrm.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaXhza2lneXhlbGlndWtvcnJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTcyMzM4MCwiZXhwIjoyMDY3Mjk5MzgwfQ.9E66Bv5ujoMAketUCKgPWKX47BGjzrMV6s-QlzGCetU"

print("🔍 Verifying admin_users table...\n")

url = f"{SUPABASE_URL}/rest/v1/admin_users?select=*"

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
}

try:
    req = request.Request(url, headers=headers)
    with request.urlopen(req) as response:
        users = json.loads(response.read().decode('utf-8'))

        print(f"📊 Found {len(users)} admin user(s) in the table:\n")
        print("─" * 80)

        for i, user in enumerate(users, 1):
            name = "mbagnick" if user['email'] == 'mbagnickg@gmail.com' else "Hanna"
            print(f"\n{i}. {name}")
            print(f"   User ID: {user['user_id']}")
            print(f"   Email: {user['email']}")
            print(f"   Role: {user['role']}")
            print(f"   Created: {user['created_at']}")

        print("\n" + "─" * 80)
        print("\n✅ Admin users successfully verified!")

except Exception as e:
    print(f"❌ Error: {e}")
