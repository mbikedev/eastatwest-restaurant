# Google Search Console Access - Alternative Solutions

## ⚠️ Issue Summary

The `mcp-server-gsc` MCP server causes Claude Desktop to display a black screen on your system. This is a compatibility issue between the MCP server and your Claude Desktop version.

**What was attempted:**
- ✅ MCP server installed successfully
- ✅ Google Cloud credentials created and configured
- ✅ Service account granted access to Search Console
- ❌ Claude Desktop crashes/black screen when GSC MCP server is added to config

## 🎯 Alternative Solutions

### Solution 1: Use Google Search Console API Directly via Claude Code CLI

Since you're already using Claude Code (CLI), you can use the Google Search Console API directly in your terminal sessions:

#### Setup (One-time):

```bash
# Install Google API Python client
pip3 install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib

# Create a simple Python wrapper
cat > ~/bin/gsc-query << 'EOF'
#!/usr/bin/env python3
import sys
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Credentials
CREDENTIALS_FILE = '/Users/mbike/.config/google-cloud/search-console-credentials.json'
SITE_URL = 'https://eastatwest.com'

credentials = service_account.Credentials.from_service_account_file(
    CREDENTIALS_FILE,
    scopes=['https://www.googleapis.com/auth/webmasters.readonly']
)

service = build('searchconsole', 'v1', credentials=credentials)

# Get command from arguments
command = sys.argv[1] if len(sys.argv) > 1 else 'sites'

if command == 'sites':
    # List all sites
    sites = service.sites().list().execute()
    print(json.dumps(sites, indent=2))

elif command == 'analytics':
    # Get search analytics
    start_date = sys.argv[2] if len(sys.argv) > 2 else '2025-01-01'
    end_date = sys.argv[3] if len(sys.argv) > 3 else '2025-01-03'

    request = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['query', 'page'],
        'rowLimit': 100
    }

    response = service.searchanalytics().query(
        siteUrl=SITE_URL,
        body=request
    ).execute()

    print(json.dumps(response, indent=2))

elif command == 'inspect':
    # Inspect URL
    url = sys.argv[2] if len(sys.argv) > 2 else SITE_URL

    response = service.urlInspection().index().inspect(
        body={
            'inspectionUrl': url,
            'siteUrl': SITE_URL
        }
    ).execute()

    print(json.dumps(response, indent=2))
EOF

chmod +x ~/bin/gsc-query
```

#### Usage:

```bash
# List all sites
gsc-query sites

# Get search analytics for date range
gsc-query analytics 2025-10-01 2025-10-31

# Inspect a URL
gsc-query inspect https://eastatwest.com/blog/some-post
```

Then in Claude Code CLI sessions, you can ask:
```
Can you run `gsc-query analytics 2025-10-01 2025-10-31` and analyze the search performance?
```

---

### Solution 2: Use Google Search Console Web Interface + Screenshots

The simplest approach:

1. Open Google Search Console: https://search.google.com/search-console
2. Navigate to the data you need
3. Take a screenshot (⌘+Shift+4 on Mac)
4. Share the screenshot with Claude Code

Example:
```
I have a screenshot from Google Search Console showing indexing issues. Can you analyze it?
[Share screenshot]
```

---

### Solution 3: Export CSV Data from Search Console

1. Go to Google Search Console
2. Navigate to Performance → Export data
3. Save as CSV
4. Ask Claude Code to analyze:

```
Can you analyze this Search Console CSV file at ~/Downloads/search-console-data.csv?
```

---

### Solution 4: Use Alternative MCP Server (Apify or bdmarvin)

There are other GSC MCP implementations that might work better:

#### Try bdmarvin's OAuth-based version:

```bash
npm install -g @bdmarvin/mcp-server-gsc
```

Then configure in Claude Desktop:
```json
{
  "mcpServers": {
    "gsc-oauth": {
      "command": "npx",
      "args": ["-y", "@bdmarvin/mcp-server-gsc"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-oauth-secret",
        "GOOGLE_REFRESH_TOKEN": "your-refresh-token"
      }
    }
  }
}
```

This uses OAuth instead of service accounts and might have better compatibility.

---

### Solution 5: Direct API Calls via Bash

Add these functions to your `~/.zshrc` or `~/.bashrc`:

```bash
# Google Search Console helpers
export GSC_CREDENTIALS="/Users/mbike/.config/google-cloud/search-console-credentials.json"
export GSC_SITE="https://eastatwest.com"

gsc_get_token() {
    python3 << EOF
from google.oauth2 import service_account
creds = service_account.Credentials.from_service_account_file(
    "$GSC_CREDENTIALS",
    scopes=['https://www.googleapis.com/auth/webmasters.readonly']
)
print(creds.token)
EOF
}

gsc_search_analytics() {
    local start_date="${1:-2025-01-01}"
    local end_date="${2:-2025-01-03}"
    local token=$(gsc_get_token)

    curl -s -X POST \
        "https://searchconsole.googleapis.com/v1/sites/${GSC_SITE}/searchAnalytics/query" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "{
            \"startDate\": \"$start_date\",
            \"endDate\": \"$end_date\",
            \"dimensions\": [\"query\"],
            \"rowLimit\": 25
        }" | jq .
}
```

Usage:
```bash
gsc_search_analytics 2025-10-01 2025-10-31
```

---

## 🏆 Recommended Approach

**For now, use Solution 2 (Screenshots) and Solution 3 (CSV Export)** as they are:
- ✅ Simple and reliable
- ✅ No compatibility issues
- ✅ Work immediately
- ✅ Claude Code can analyze images and CSV files

**For advanced usage, implement Solution 1 (Python wrapper)** which gives you:
- ✅ Full API access
- ✅ Scriptable queries
- ✅ Integration with Claude Code CLI
- ✅ No Claude Desktop dependency

---

## 📝 What You've Already Set Up

All the Google Cloud infrastructure is ready:
- ✅ Google Cloud Project: `eastatwest-search-console`
- ✅ Search Console API: Enabled
- ✅ Service Account: `search-console-mcp@eastatwest-search-console.iam.gserviceaccount.com`
- ✅ Credentials: `/Users/mbike/.config/google-cloud/search-console-credentials.json`
- ✅ Property Access: Service account added to eastatwest.com

This means Solutions 1, 4, and 5 can be implemented immediately without additional setup!

---

## 🐛 Reporting the Issue

If you want to help improve the MCP server, you can report this issue:
- GitHub: https://github.com/ahonn/mcp-server-gsc/issues
- Mention: "Black screen on Claude Desktop (macOS) when mcp-server-gsc is added to config"

---

## ✅ Next Steps

1. Claude Desktop is now working again (only Supabase MCP)
2. Choose one of the alternative solutions above
3. You still have full Google Search Console access via web interface
4. The API credentials are ready if you want programmatic access

Would you like me to help you set up Solution 1 (Python wrapper) for terminal-based GSC queries?
