#!/bin/bash

# ============================================
# Git Ownership Transfer Script
# WARNING: This rewrites ALL commit history.
# Commit hashes will change. Backup before running.
# ============================================

# Your new identity
NEW_NAME="Samwoker"
NEW_EMAIL="samwoker112@gmail.com"
REMOTE_URL="https://github.com/Samwoker/AASTU-HR.git"
BRANCH="main" # Change this to "master" if your default branch is master

echo "This will rewrite all commits to:"
echo "Author & Committer: $NEW_NAME <$NEW_EMAIL>"
echo
read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 1
fi

# Rewrite commit history with git-filter-repo
echo "Rewriting commit history..."
git filter-repo --force --commit-callback '
commit.author_name = b"'"$NEW_NAME"'"
commit.author_email = b"'"$NEW_EMAIL"'"
commit.committer_name = b"'"$NEW_NAME"'"
commit.committer_email = b"'"$NEW_EMAIL"'"
'

# Remove old remote
git remote remove origin 2>/dev/null

# Add your GitHub repo as the new remote
git remote add origin "$REMOTE_URL"

# Force-push the rewritten history
echo "Pushing rewritten history to GitHub..."
git push --force -u origin "$BRANCH"
git push --force --tags

echo
echo "✅ Ownership transferred! All commits now show $NEW_NAME <$NEW_EMAIL>"
echo "Check your GitHub repo to confirm the history."
