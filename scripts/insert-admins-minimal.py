#!/usr/bin/env python3
import json
from urllib import request, error

SUPABASE_URL = "https://whixskigyxeligukorrm.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaXhza2lneXhlbGlndWtvcnJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTcyMzM4MCwiZXhwIjoyMDY3Mjk5MzgwfQ.9E66Bv5ujoMAketUCKgPWKX47BGjzrMV6s-QlzGCetU"

print("🚀 Inserting admin users with minimal fields...\n")

# Try with different field combinations
test_data_options = [
    # Option 1: Just email and username
    {
        "test": "email + username only",
        "data": [
            {"email": "mbagnickg@gmail.com", "username": "mbagnickg"},
            {"email": "infos.east.west@gmail.com", "username": "eastwest_admin"}
        ]
    },
    # Option 2: email, username, id
    {
        "test": "email + username + id",
        "data": [
            {
                "id": "0d208390-a566-4f07-81d4-7c8e08cbb95d",
                "email": "mbagnickg@gmail.com",
                "username": "mbagnickg"
            },
            {
                "id": "f3585d54-1420-4f42-b6cf-dfb98ca61f32",
                "email": "infos.east.west@gmail.com",
                "username": "eastwest_admin"
            }
        ]
    },
    # Option 3: Just email
    {
        "test": "email only",
        "data": [
            {"email": "mbagnickg@gmail.com"},
            {"email": "infos.east.west@gmail.com"}
        ]
    }
]

url = f"{SUPABASE_URL}/rest/v1/admin_users"
headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

for option in test_data_options:
    print(f"\n{'='*60}")
    print(f"Testing: {option['test']}")
    print(f"{'='*60}")

    for admin in option['data']:
        print(f"\n📧 Trying {admin.get('email', 'unknown')}...")
        print(f"   Fields: {list(admin.keys())}")

        data = json.dumps(admin).encode('utf-8')

        try:
            req = request.Request(url, data=data, headers=headers, method='POST')
            with request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                print(f"✅ SUCCESS!")
                print(f"   Response: {result}")
                # If one succeeds, use this pattern for all
                break
        except error.HTTPError as e:
            error_msg = e.read().decode('utf-8')
            print(f"❌ Failed: {error_msg}")
        except Exception as e:
            print(f"❌ Error: {e}")

    # Ask if we should continue testing other options
    else:
        continue
    break  # If we had success, stop testing

print("\n✨ Testing completed!")
