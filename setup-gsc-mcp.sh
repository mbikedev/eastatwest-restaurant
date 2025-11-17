#!/bin/bash

# Google Search Console MCP Server Setup Helper
# This script helps configure the MCP server after you've obtained credentials

set -e

echo "🔍 Google Search Console MCP Server Setup"
echo "=========================================="
echo ""

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "📦 Installing jq (JSON processor)..."
    brew install jq
fi

CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
CREDENTIALS_DIR="$HOME/.config/google-cloud"
CREDENTIALS_PATH="$CREDENTIALS_DIR/search-console-credentials.json"

echo "📍 Expected credentials location: $CREDENTIALS_PATH"
echo ""

# Check if credentials exist
if [ ! -f "$CREDENTIALS_PATH" ]; then
    echo "❌ Credentials file not found!"
    echo ""
    echo "Please complete these steps first:"
    echo ""
    echo "1. Go to: https://console.cloud.google.com/"
    echo "2. Enable Search Console API"
    echo "3. Create a Service Account"
    echo "4. Download the JSON key file"
    echo "5. Save it to: $CREDENTIALS_PATH"
    echo ""
    echo "Quick setup:"
    echo "  mkdir -p $CREDENTIALS_DIR"
    echo "  mv ~/Downloads/your-credentials-file.json $CREDENTIALS_PATH"
    echo "  chmod 600 $CREDENTIALS_PATH"
    echo ""

    # Check Downloads folder for potential credentials files
    POTENTIAL_FILES=$(find ~/Downloads -name "*service-account*.json" -o -name "*eastatwest*.json" -o -name "*search-console*.json" 2>/dev/null | head -5)

    if [ ! -z "$POTENTIAL_FILES" ]; then
        echo "💡 Found potential credential files in Downloads:"
        echo "$POTENTIAL_FILES"
        echo ""
        read -p "Would you like to move one of these files? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "$POTENTIAL_FILES" | nl
            read -p "Enter the number of the file to use: " FILE_NUM
            SELECTED_FILE=$(echo "$POTENTIAL_FILES" | sed -n "${FILE_NUM}p")

            if [ -f "$SELECTED_FILE" ]; then
                mkdir -p "$CREDENTIALS_DIR"
                cp "$SELECTED_FILE" "$CREDENTIALS_PATH"
                chmod 600 "$CREDENTIALS_PATH"
                echo "✅ Credentials file copied!"
            else
                echo "❌ Invalid selection"
                exit 1
            fi
        else
            exit 1
        fi
    else
        exit 1
    fi
fi

echo "✅ Credentials file found!"
echo ""

# Extract service account email
SERVICE_ACCOUNT_EMAIL=$(jq -r '.client_email' "$CREDENTIALS_PATH")
echo "📧 Service Account Email: $SERVICE_ACCOUNT_EMAIL"
echo ""
echo "⚠️  IMPORTANT: Add this email to Google Search Console!"
echo "   1. Go to: https://search.google.com/search-console"
echo "   2. Select property: eastatwest.com"
echo "   3. Settings → Users and permissions → ADD USER"
echo "   4. Add: $SERVICE_ACCOUNT_EMAIL (with Owner/Full permission)"
echo ""
read -p "Have you added the service account to Search Console? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⏸️  Please add the service account first, then run this script again."
    exit 1
fi

# Backup current config
if [ -f "$CONFIG_FILE" ]; then
    BACKUP_FILE="$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo "💾 Backup created: $BACKUP_FILE"
fi

# Update Claude Desktop config
echo "🔧 Updating Claude Desktop configuration..."

jq --arg creds "$CREDENTIALS_PATH" '.mcpServers.gsc = {
  "command": "npx",
  "args": ["-y", "mcp-server-gsc"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": $creds
  }
}' "$CONFIG_FILE" > "$CONFIG_FILE.tmp"

mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Restart Claude Desktop (⌘+Q and reopen)"
echo "  2. Test by asking Claude: 'Can you fetch search analytics for eastatwest.com?'"
echo ""
echo "🎉 You can now analyze Google Search Console data with Claude!"
