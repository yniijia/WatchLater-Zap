#!/bin/bash
# Script to create a GitHub repository using MCP

# Check if GITHUB_TOKEN environment variable is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN environment variable not set."
  echo "Please set it with: export GITHUB_TOKEN=your_github_token"
  exit 1
fi

# Repository name
REPO="WatchLaterZap"

# Repository description
DESCRIPTION="Chrome extension to delete all YouTube Watch Later videos with one click"

# Private repository? (true/false)
PRIVATE="false"

# Auto-initialize with README?
AUTO_INIT="true"

echo "Creating GitHub repository $REPO..."

# Use GitHub MCP API to create repository
curl -X POST "https://api.github.com/mcp/github/create_repository" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'"$REPO"'",
    "description": "'"$DESCRIPTION"'",
    "private": '"$PRIVATE"',
    "autoInit": '"$AUTO_INIT"'
  }'

echo "Repository creation completed! Check your GitHub profile." 