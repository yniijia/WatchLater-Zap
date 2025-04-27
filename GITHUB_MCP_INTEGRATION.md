# GitHub MCP Integration for WatchLater Zap

This guide explains how to use GitHub's MCP (Machine-Callable Protocols) with the WatchLater Zap Chrome extension to automate repository operations.

## Prerequisites

1. A GitHub account
2. A Personal Access Token (PAT) with appropriate permissions:
   - `repo` - Full control of private repositories
   - `workflow` - Update GitHub Action workflows

## Setup Instructions

### 1. Set Your GitHub Token

```bash
export GITHUB_TOKEN=your_personal_access_token
```

For persistent storage, add this to your `.bashrc` or `.zshrc` file.

### 2. Create a GitHub Repository (First Time Only)

If you don't already have a repository for this project:

```bash
./create-repo.sh
```

This script uses the GitHub MCP API to create a new repository named "WatchLaterZap" with the appropriate description.

### 3. Push Code Changes to GitHub

After making changes to your code, you can push them to GitHub using:

```bash
./push-to-github.sh [username] [commit_message]
```

Example:
```bash
./push-to-github.sh johndoe "Add progress indicator"
```

If you don't provide the username or commit message, the script will prompt you for them.

## Automation with GitHub Actions

This project includes a GitHub Actions workflow that uses MCP to automate code pushes:

- Located at `.github/workflows/push-to-github.yml`
- Can be triggered manually from the GitHub Actions tab
- Automatically pushes all files to the repository

## Configuration

The MCP configuration is stored in `.github/mcp-config.json` and includes:

- Repository settings
- Commit settings (automatic pushing)
- Branch protection rules
- Pull request settings

## Using MCP Functions

GitHub's MCP Server (https://github.com/github/github-mcp-server) provides many functions to interact with GitHub. The most relevant for this project are:

- `create_repository` - Create a new repository
- `push_files` - Push multiple files in one commit
- `create_or_update_file` - Create or update a single file
- `list_branches` - List all branches in a repository

For a complete list of available functions, see the [GitHub MCP Server documentation](https://github.com/github/github-mcp-server).

## Troubleshooting

If you encounter errors:

1. Verify your GitHub token has the correct permissions
2. Check that your repository exists and you have push access
3. Examine the API response for specific error messages
4. Ensure the MCP endpoints are correctly specified

## References

- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) 