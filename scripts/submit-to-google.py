#!/usr/bin/env python3
"""
Google Search Console - Sitemap Submission & URL Indexing Script
Automates the submission process for better Google indexing
"""

import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build
import json
from datetime import datetime, timedelta

# Configuration
CREDENTIALS_FILE = '/Users/mbike/.config/google-cloud/search-console-credentials.json'
SITE_URL = 'https://eastatwest.com'
SITEMAP_URL = 'https://eastatwest.com/sitemap.xml'

# Important pages to request indexing for
KEY_PAGES = [
    'https://eastatwest.com',
    'https://eastatwest.com/about',
    'https://eastatwest.com/menu',
    'https://eastatwest.com/reservations',
    'https://eastatwest.com/blog',
    'https://eastatwest.com/contact',
    'https://eastatwest.com/gallery',
    'https://eastatwest.com/events-catering',
    'https://eastatwest.com/takeaway',
]

def get_service():
    """Initialize Google Search Console API service"""
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=['https://www.googleapis.com/auth/webmasters']
    )
    return build('searchconsole', 'v1', credentials=credentials)

def submit_sitemap(service):
    """Submit sitemap to Google Search Console"""
    print(f"\n📤 Submitting sitemap: {SITEMAP_URL}")
    try:
        service.sitemaps().submit(
            siteUrl=SITE_URL,
            feedpath=SITEMAP_URL
        ).execute()
        print("✅ Sitemap submitted successfully!")
        return True
    except Exception as e:
        print(f"❌ Error submitting sitemap: {e}")
        return False

def check_sitemap_status(service):
    """Check sitemap status"""
    print(f"\n🔍 Checking sitemap status...")
    try:
        response = service.sitemaps().get(
            siteUrl=SITE_URL,
            feedpath=SITEMAP_URL
        ).execute()

        print(f"✅ Sitemap Status:")
        print(f"   Last Submitted: {response.get('lastSubmitted', 'Never')}")
        print(f"   Last Downloaded: {response.get('lastDownloaded', 'N/A')}")
        print(f"   Errors: {response.get('errors', 0)}")
        print(f"   Warnings: {response.get('warnings', 0)}")

        if 'contents' in response:
            for content in response['contents']:
                print(f"   Type: {content.get('type')}")
                print(f"   Submitted: {content.get('submitted', 0)}")
                print(f"   Indexed: {content.get('indexed', 0)}")

        return response
    except Exception as e:
        print(f"⚠️  Sitemap not yet registered: {e}")
        return None

def list_sitemaps(service):
    """List all sitemaps"""
    print(f"\n📋 Listing all sitemaps for {SITE_URL}...")
    try:
        response = service.sitemaps().list(siteUrl=SITE_URL).execute()

        if 'sitemap' in response:
            for sitemap in response['sitemap']:
                print(f"\n  🗺️  {sitemap['path']}")
                print(f"     Last Submitted: {sitemap.get('lastSubmitted', 'N/A')}")
                print(f"     Last Downloaded: {sitemap.get('lastDownloaded', 'N/A')}")
                print(f"     Errors: {sitemap.get('errors', 0)}")
                print(f"     Warnings: {sitemap.get('warnings', 0)}")
        else:
            print("  No sitemaps found")

        return response
    except Exception as e:
        print(f"❌ Error listing sitemaps: {e}")
        return None

def inspect_url(service, url):
    """Inspect a URL to check indexing status"""
    print(f"\n🔎 Inspecting URL: {url}")
    try:
        response = service.urlInspection().index().inspect(
            body={
                'inspectionUrl': url,
                'siteUrl': SITE_URL
            }
        ).execute()

        # Extract key information
        inspection_result = response.get('inspectionResult', {})
        index_status = inspection_result.get('indexStatusResult', {})

        print(f"  Coverage State: {index_status.get('coverageState', 'Unknown')}")
        print(f"  Indexing State: {index_status.get('indexingState', 'Unknown')}")
        print(f"  Last Crawl: {index_status.get('lastCrawlTime', 'Never')}")

        verdict = index_status.get('verdict', 'Unknown')
        print(f"  Verdict: {verdict}")

        if verdict == 'PASS':
            print("  ✅ URL is indexed and accessible")
        else:
            print("  ⚠️  URL has indexing issues")

        return response
    except Exception as e:
        print(f"  ❌ Error inspecting URL: {e}")
        return None

def get_search_analytics(service, days=7):
    """Get search analytics for recent period"""
    print(f"\n📊 Fetching search analytics for last {days} days...")

    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)

    try:
        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['page'],
            'rowLimit': 10
        }

        response = service.searchanalytics().query(
            siteUrl=SITE_URL,
            body=request
        ).execute()

        print(f"  Top pages by clicks:")
        if 'rows' in response:
            for i, row in enumerate(response['rows'][:10], 1):
                print(f"  {i}. {row['keys'][0]}")
                print(f"     Clicks: {row.get('clicks', 0)}, Impressions: {row.get('impressions', 0)}, CTR: {row.get('ctr', 0):.2%}")
        else:
            print("  No data available yet")

        return response
    except Exception as e:
        print(f"  ❌ Error fetching analytics: {e}")
        return None

def main():
    """Main execution"""
    print("=" * 60)
    print("🔍 Google Search Console - Site Indexing Setup")
    print("=" * 60)
    print(f"Site: {SITE_URL}")
    print(f"Sitemap: {SITEMAP_URL}")
    print("=" * 60)

    try:
        service = get_service()
        print("✅ Connected to Google Search Console API")

        # 1. List existing sitemaps
        list_sitemaps(service)

        # 2. Submit sitemap
        submit_sitemap(service)

        # 3. Check sitemap status
        check_sitemap_status(service)

        # 4. Inspect key pages
        print("\n" + "=" * 60)
        print("🔍 Inspecting Key Pages")
        print("=" * 60)

        for url in KEY_PAGES[:3]:  # Inspect first 3 to avoid rate limits
            inspect_url(service, url)

        # 5. Get recent search analytics
        get_search_analytics(service, days=7)

        print("\n" + "=" * 60)
        print("✅ Setup Complete!")
        print("=" * 60)
        print("\n📝 Next Steps:")
        print("  1. Wait 24-48 hours for Google to crawl your sitemap")
        print("  2. Check Google Search Console for indexing status")
        print("  3. Use URL Inspection tool for any problematic pages")
        print("  4. Monitor search analytics in 1-2 weeks")
        print("\n🌐 Web Interface: https://search.google.com/search-console")

    except FileNotFoundError:
        print(f"\n❌ Error: Credentials file not found at {CREDENTIALS_FILE}")
        print("Please ensure you've completed the Google Cloud setup.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
