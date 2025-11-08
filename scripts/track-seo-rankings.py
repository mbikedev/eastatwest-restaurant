#!/usr/bin/env python3
"""
Google Search Console SEO Ranking Tracker
==========================================

This script tracks your website's SEO performance using Google Search Console API.
It monitors:
- Keyword rankings
- Click-through rates (CTR)
- Total clicks and impressions
- Position changes over time
- Top performing pages

Setup Instructions:
------------------
1. Ensure you have Google Search Console credentials JSON file
2. Install required packages: pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
3. Run: python scripts/track-seo-rankings.py

Output:
-------
- Console report with current rankings
- CSV file with historical data for tracking
- Alerts for significant position changes
"""

import os
import json
import csv
from datetime import datetime, timedelta
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configuration
SITE_URL = 'https://eastatwest.com'
CREDENTIALS_PATH = os.path.expanduser('~/.config/gsc/credentials.json')
SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']

# Target keywords to track
TARGET_KEYWORDS = [
    'lebanese restaurant brussels',
    'best lebanese food brussels',
    'halal restaurant brussels',
    'mezze brussels',
    'lebanese catering brussels',
    'authentic lebanese cuisine brussels',
    'middle eastern restaurant brussels',
    'falafel brussels',
    'shawarma brussels',
    'vegan lebanese brussels',
    'east at west brussels',
    'restaurant libanais bruxelles',
    'traiteur libanais bruxelles',
    'halal bruxelles',
    'mezze bruxelles'
]

def get_service():
    """Authenticate and return Google Search Console service"""
    try:
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIALS_PATH,
            scopes=SCOPES
        )
        service = build('searchconsole', 'v1', credentials=credentials)
        return service
    except FileNotFoundError:
        print(f"❌ Credentials file not found at {CREDENTIALS_PATH}")
        print("\nPlease ensure your Google Service Account JSON file is placed at:")
        print(f"   {CREDENTIALS_PATH}")
        return None
    except Exception as e:
        print(f"❌ Error authenticating: {e}")
        return None

def get_query_data(service, start_date, end_date, query=None):
    """
    Fetch search analytics data for a specific query or all queries

    Args:
        service: Google Search Console API service
        start_date: Start date (YYYY-MM-DD format)
        end_date: End date (YYYY-MM-DD format)
        query: Specific search query (optional)

    Returns:
        List of query data rows
    """
    request_body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['query'],
        'rowLimit': 25000  # Max allowed
    }

    if query:
        request_body['dimensionFilterGroups'] = [{
            'filters': [{
                'dimension': 'query',
                'expression': query,
                'operator': 'equals'
            }]
        }]

    try:
        response = service.searchanalytics().query(
            siteUrl=SITE_URL,
            body=request_body
        ).execute()

        return response.get('rows', [])
    except HttpError as e:
        print(f"❌ HTTP Error: {e}")
        return []
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return []

def get_top_pages(service, start_date, end_date, limit=10):
    """Get top performing pages by clicks"""
    request_body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['page'],
        'rowLimit': limit
    }

    try:
        response = service.searchanalytics().query(
            siteUrl=SITE_URL,
            body=request_body
        ).execute()

        rows = response.get('rows', [])
        # Sort by clicks
        rows.sort(key=lambda x: x.get('clicks', 0), reverse=True)
        return rows
    except Exception as e:
        print(f"❌ Error fetching top pages: {e}")
        return []

def format_position_change(old_pos, new_pos):
    """Format position change with colored arrow"""
    if old_pos is None:
        return "🆕 New"

    change = old_pos - new_pos
    if change > 0:
        return f"⬆️ +{change:.1f}"
    elif change < 0:
        return f"⬇️ {change:.1f}"
    else:
        return "➡️ No change"

def save_to_csv(data, filename):
    """Save ranking data to CSV for historical tracking"""
    filepath = Path(__file__).parent.parent / 'seo-reports' / filename
    filepath.parent.mkdir(parents=True, exist_ok=True)

    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        if not data:
            return

        fieldnames = ['date', 'keyword', 'position', 'clicks', 'impressions', 'ctr']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

    print(f"\n📄 Data saved to: {filepath}")

def load_previous_data(filename):
    """Load previous ranking data for comparison"""
    filepath = Path(__file__).parent.parent / 'seo-reports' / filename

    if not filepath.exists():
        return {}

    previous_data = {}
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                previous_data[row['keyword']] = {
                    'position': float(row['position']),
                    'clicks': int(row['clicks']),
                    'impressions': int(row['impressions']),
                    'ctr': float(row['ctr'])
                }
    except Exception as e:
        print(f"⚠️ Could not load previous data: {e}")

    return previous_data

def main():
    """Main execution function"""
    print("=" * 80)
    print("🔍 GOOGLE SEARCH CONSOLE SEO RANKING TRACKER")
    print("=" * 80)
    print(f"\n📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Site: {SITE_URL}\n")

    # Authenticate
    service = get_service()
    if not service:
        return

    # Date ranges
    end_date = datetime.now() - timedelta(days=3)  # GSC has 3-day delay
    start_date = end_date - timedelta(days=28)  # Last 28 days

    end_date_str = end_date.strftime('%Y-%m-%d')
    start_date_str = start_date.strftime('%Y-%m-%d')

    print(f"📊 Analyzing period: {start_date_str} to {end_date_str}\n")
    print("-" * 80)

    # Load previous data for comparison
    previous_filename = 'rankings_previous.csv'
    previous_data = load_previous_data(previous_filename)

    # Track target keywords
    print("\n🎯 TARGET KEYWORDS PERFORMANCE")
    print("=" * 80)

    current_data = []
    found_keywords = []

    for keyword in TARGET_KEYWORDS:
        rows = get_query_data(service, start_date_str, end_date_str, keyword)

        if rows:
            for row in rows:
                query = row['keys'][0]
                position = row.get('position', 0)
                clicks = row.get('clicks', 0)
                impressions = row.get('impressions', 0)
                ctr = row.get('ctr', 0) * 100

                # Compare with previous data
                prev = previous_data.get(query, {})
                prev_position = prev.get('position')
                position_change = format_position_change(prev_position, position)

                # Alert for significant changes
                alert = ""
                if prev_position and abs(prev_position - position) >= 5:
                    alert = " ⚠️ SIGNIFICANT CHANGE"

                print(f"\nKeyword: {query}")
                print(f"  📍 Position: {position:.1f} {position_change}{alert}")
                print(f"  👆 Clicks: {clicks} | 👁️  Impressions: {impressions} | 📈 CTR: {ctr:.2f}%")

                found_keywords.append(query)

                current_data.append({
                    'date': end_date_str,
                    'keyword': query,
                    'position': position,
                    'clicks': clicks,
                    'impressions': impressions,
                    'ctr': ctr
                })

    # Check for keywords not ranking
    not_ranking = set(TARGET_KEYWORDS) - set(found_keywords)
    if not_ranking:
        print("\n\n⚠️  KEYWORDS NOT RANKING (or below position 100):")
        print("=" * 80)
        for keyword in not_ranking:
            print(f"  • {keyword}")

    # Get overall site performance
    print("\n\n📈 OVERALL SITE PERFORMANCE (Last 28 Days)")
    print("=" * 80)

    all_queries = get_query_data(service, start_date_str, end_date_str)

    if all_queries:
        total_clicks = sum(row.get('clicks', 0) for row in all_queries)
        total_impressions = sum(row.get('impressions', 0) for row in all_queries)
        avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
        avg_position = sum(row.get('position', 0) for row in all_queries) / len(all_queries)

        print(f"  Total Clicks: {total_clicks:,}")
        print(f"  Total Impressions: {total_impressions:,}")
        print(f"  Average CTR: {avg_ctr:.2f}%")
        print(f"  Average Position: {avg_position:.1f}")
        print(f"  Total Queries: {len(all_queries):,}")

    # Get top performing pages
    print("\n\n🏆 TOP 10 PERFORMING PAGES")
    print("=" * 80)

    top_pages = get_top_pages(service, start_date_str, end_date_str, limit=10)

    for i, page_data in enumerate(top_pages, 1):
        page = page_data['keys'][0]
        clicks = page_data.get('clicks', 0)
        impressions = page_data.get('impressions', 0)
        ctr = page_data.get('ctr', 0) * 100
        position = page_data.get('position', 0)

        # Shorten URL for display
        page_display = page.replace(SITE_URL, '')
        if not page_display:
            page_display = '/'

        print(f"\n{i}. {page_display}")
        print(f"   Clicks: {clicks} | Impressions: {impressions} | CTR: {ctr:.2f}% | Avg Position: {position:.1f}")

    # Save current data
    current_filename = f'rankings_{end_date_str}.csv'
    save_to_csv(current_data, current_filename)

    # Copy to previous for next comparison
    save_to_csv(current_data, previous_filename)

    # Recommendations
    print("\n\n💡 SEO RECOMMENDATIONS")
    print("=" * 80)

    if not_ranking:
        print(f"  • Create content targeting: {', '.join(list(not_ranking)[:3])}")

    if avg_ctr < 3.0:
        print(f"  • Your average CTR ({avg_ctr:.2f}%) is low. Improve meta titles and descriptions.")

    if avg_position > 20:
        print(f"  • Your average position ({avg_position:.1f}) needs improvement. Focus on on-page SEO and backlinks.")

    print("  • Continue publishing weekly blog posts using the template in BLOG_POST_TEMPLATE.md")
    print("  • Get more customer reviews on Google Business Profile")
    print("  • Build backlinks from Belgian food blogs and directories")

    print("\n" + "=" * 80)
    print("✅ Report Complete!")
    print("=" * 80)
    print(f"\n📁 Historical data saved in: seo-reports/")
    print(f"🔄 Run this script weekly to track progress\n")

if __name__ == '__main__':
    main()
