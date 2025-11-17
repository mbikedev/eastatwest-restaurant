# Google Search Console MCP Server Setup Guide

## ✅ Step 1: MCP Server Installation (COMPLETED)
The `mcp-server-gsc` package has been installed globally.

## 🔧 Step 2: Google Cloud Setup (ACTION REQUIRED)

### A. Create Google Cloud Project & Enable API

1. **Visit Google Cloud Console**: https://console.cloud.google.com/

2. **Create or Select Project**:
   - Click on project dropdown (top left)
   - Click "New Project" or select existing project
   - Project Name: `eastatwest-search-console` (or your choice)

3. **Enable Search Console API**:
   - Go to: https://console.cloud.google.com/apis/library
   - Search for: "Google Search Console API"
   - Click on it and click "ENABLE"

### B. Create Service Account Credentials

1. **Navigate to Credentials**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "Service Account"

2. **Fill in Service Account Details**:
   - Service account name: `search-console-mcp`
   - Service account ID: (auto-filled)
   - Description: "MCP server for Google Search Console access"
   - Click "CREATE AND CONTINUE"

3. **Skip Optional Steps**:
   - Role: Skip this (click "CONTINUE")
   - Grant users access: Skip this (click "DONE")

4. **Create JSON Key**:
   - Find your new service account in the list
   - Click on the service account email
   - Go to "KEYS" tab
   - Click "ADD KEY" → "Create new key"
   - Select "JSON" format
   - Click "CREATE"
   - **The file will download automatically** (e.g., `eastatwest-search-console-xxxxx.json`)

5. **Save the Credentials File**:
   ```bash
   # Move the downloaded file to a secure location
   mkdir -p ~/.config/google-cloud
   mv ~/Downloads/eastatwest-search-console-*.json ~/.config/google-cloud/search-console-credentials.json
   chmod 600 ~/.config/google-cloud/search-console-credentials.json
   ```

### C. Grant Service Account Access to Search Console

1. **Get Service Account Email**:
   - From the downloaded JSON file, find the email (format: `search-console-mcp@project-id.iam.gserviceaccount.com`)
   - OR from Google Cloud Console → IAM & Admin → Service Accounts

2. **Add to Search Console**:
   - Go to: https://search.google.com/search-console
   - Select your property: `eastatwest.com`
   - Click ⚙️ Settings (left sidebar)
   - Click "Users and permissions"
   - Click "ADD USER"
   - Enter the service account email
   - Permission level: "Owner" or "Full"
   - Click "ADD"

## 🎯 Step 3: Update Claude Desktop Config

After you've completed the steps above and saved your credentials file, run:

```bash
# Update Claude Desktop config automatically
cat << 'EOF' > /tmp/update_claude_config.sh
#!/bin/bash

CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
CREDENTIALS_PATH="$HOME/.config/google-cloud/search-console-credentials.json"

# Check if credentials file exists
if [ ! -f "$CREDENTIALS_PATH" ]; then
  echo "❌ Error: Credentials file not found at $CREDENTIALS_PATH"
  echo "Please complete Step 2B first."
  exit 1
fi

# Backup current config
cp "$CONFIG_FILE" "$CONFIG_FILE.backup"

# Update config using jq
jq '.mcpServers.gsc = {
  "command": "npx",
  "args": ["-y", "mcp-server-gsc"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "'$CREDENTIALS_PATH'"
  }
}' "$CONFIG_FILE" > "$CONFIG_FILE.tmp"

mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"

echo "✅ Claude Desktop config updated!"
echo "📝 Backup saved to: $CONFIG_FILE.backup"
echo ""
echo "🔄 Please restart Claude Desktop for changes to take effect."
EOF

chmod +x /tmp/update_claude_config.sh
/tmp/update_claude_config.sh
```

## 📋 Verification Checklist

- [ ] Google Cloud project created
- [ ] Search Console API enabled
- [ ] Service account created
- [ ] JSON credentials file downloaded and saved to `~/.config/google-cloud/search-console-credentials.json`
- [ ] Service account email added to Search Console with Owner/Full permissions
- [ ] Claude Desktop config updated
- [ ] Claude Desktop restarted

## 🚀 Testing the Connection

After restarting Claude Desktop, you can test the connection by asking Claude:

```
Can you fetch the search analytics data for eastatwest.com from the last 7 days?
```

## 📊 Available Commands

Once configured, you can ask Claude to:
- Get search performance data (queries, clicks, impressions, CTR, position)
- Filter by date range, country, device, search type
- Analyze top pages and queries
- Compare time periods
- Detect quick wins and optimization opportunities
- Get up to 25,000 rows of data per query

## 🔒 Security Notes

- Keep your credentials file secure (permissions set to 600)
- Never commit credentials to git
- The service account has limited scope (only Search Console access)
- You can revoke access anytime from Google Cloud Console

## 📚 Documentation

- MCP Server: https://github.com/ahonn/mcp-server-gsc
- Google Search Console API: https://developers.google.com/webmaster-tools
- Service Accounts: https://cloud.google.com/iam/docs/service-account-overview
