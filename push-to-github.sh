#!/bin/bash
# Script to push code to GitHub using MCP

# Check if GITHUB_TOKEN environment variable is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN environment variable not set."
  echo "Please set it with: export GITHUB_TOKEN=your_github_token"
  exit 1
fi

# Get the owner from the user if not provided
if [ -z "$1" ]; then
  read -p "Enter GitHub username or organization: " OWNER
else
  OWNER="$1"
fi

# Repository name (from MCP config)
REPO="WatchLaterZap"

# Branch name
BRANCH="main"

# Get commit message
if [ -z "$2" ]; then
  read -p "Enter commit message: " COMMIT_MSG
else
  COMMIT_MSG="$2"
fi

echo "Pushing to GitHub repository $OWNER/$REPO..."

# Use GitHub MCP API to push files
# This is a simplified example - in practice you would need to format the files array correctly
curl -X POST "https://api.github.com/mcp/github/push_files" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "'"$OWNER"'",
    "repo": "'"$REPO"'",
    "branch": "'"$BRANCH"'",
    "message": "'"$COMMIT_MSG"'",
    "files": [
      {
        "path": "manifest.json",
        "content": "'"$(cat manifest.json | sed 's/"/\\"/g')"'"
      },
      {
        "path": "popup.html",
        "content": "'"$(cat popup.html | sed 's/"/\\"/g')"'"
      },
      {
        "path": "css/popup.css",
        "content": "'"$(cat css/popup.css | sed 's/"/\\"/g')"'"
      },
      {
        "path": "js/popup.js",
        "content": "'"$(cat js/popup.js | sed 's/"/\\"/g')"'"
      },
      {
        "path": "js/content.js",
        "content": "'"$(cat js/content.js | sed 's/"/\\"/g')"'"
      },
      {
        "path": "README.md",
        "content": "'"$(cat README.md | sed 's/"/\\"/g')"'"
      }
    ]
  }'

echo "Push completed! Check your GitHub repository." 