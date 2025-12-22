#!/usr/bin/env python3
import os
import json
from urllib import request, error, parse

# Load environment variables
SUPABASE_URL = "https://whixskigyxeligukorrm.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaXhza2lneXhlbGlndWtvcnJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTcyMzM4MCwiZXhwIjoyMDY3Mjk5MzgwfQ.9E66Bv5ujoMAketUCKgPWKX47BGjzrMV6s-QlzGCetU"

def execute_sql(sql):
    """Execute SQL via Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec"

    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    data = json.dumps({"query": sql}).encode('utf-8')

    try:
        req = request.Request(url, data=data, headers=headers, method='POST')
        with request.urlopen(req) as response:
            result = response.read().decode('utf-8')
            print(f"✅ SQL executed successfully")
            print(f"Response: {result}")
            return result
    except error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code}")
        print(f"Response: {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def insert_via_rest():
    """Insert admin users via REST API"""
    print("🚀 Inserting admin users via REST API...\n")

    # Admin users data
    admin_users = [
        {
            "id": "0d208390-a566-4f07-81d4-7c8e08cbb95d",
            "username": "mbagnickg",
            "email": "mbagnickg@gmail.com",
            "full_name": "Mbagnick Gaye",
            "role": "admin",
            "is_active": True
        },
        {
            "id": "f3585d54-1420-4f42-b6cf-dfb98ca61f32",
            "username": "eastwest_admin",
            "email": "infos.east.west@gmail.com",
            "full_name": "East At West Admin",
            "role": "admin",
            "is_active": True
        }
    ]

    url = f"{SUPABASE_URL}/rest/v1/admin_users"

    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation,resolution=merge-duplicates"
    }

    for admin in admin_users:
        print(f"\n📧 Inserting {admin['email']}...")

        data = json.dumps(admin).encode('utf-8')

        try:
            req = request.Request(url, data=data, headers=headers, method='POST')
            with request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                print(f"✅ Success: {result}")
        except error.HTTPError as e:
            error_msg = e.read().decode('utf-8')
            print(f"❌ Error {e.code}: {error_msg}")

            # Try to update if insert failed
            if e.code == 409 or 'duplicate' in error_msg.lower():
                print("Trying to update instead...")
                update_url = f"{url}?email=eq.{parse.quote(admin['email'])}"
                try:
                    req = request.Request(update_url, data=data, headers=headers, method='PATCH')
                    with request.urlopen(req) as response:
                        result = json.loads(response.read().decode('utf-8'))
                        print(f"✅ Updated: {result}")
                except Exception as update_error:
                    print(f"❌ Update also failed: {update_error}")

if __name__ == "__main__":
    insert_via_rest()
    print("\n✨ Process completed!")
