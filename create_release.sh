#!/bin/bash

# GitHub Release Creation Script
# This script creates a new release on GitHub with the changes made

# Configuration
REPO_OWNER="aseefahmed"  # Replace with your GitHub username
REPO_NAME="cloudindepth-dot-com"  # Replace with your repository name
VERSION="v2.1.0"
TAG_NAME="v2.1.0"
RELEASE_TITLE="Enhanced Free Course Management & User Experience Improvements"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first:"
    echo "https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "Please authenticate with GitHub CLI first:"
    echo "gh auth login"
    exit 1
fi

# Create the release
echo "Creating GitHub release: $VERSION"
echo "Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# Create release with release notes
gh release create "$TAG_NAME" \
    --title "$RELEASE_TITLE" \
    --notes-file RELEASE_NOTES.md \
    --repo "$REPO_OWNER/$REPO_NAME"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Release created successfully!"
    echo "🔗 View your release at: https://github.com/$REPO_OWNER/$REPO_NAME/releases/tag/$TAG_NAME"
else
    echo ""
    echo "❌ Failed to create release. Please check your authentication and repository permissions."
    exit 1
fi

