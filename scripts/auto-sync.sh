#!/bin/bash

# Auto-sync script for Open Trellis
# This script watches for file changes and automatically commits and pushes them

echo "🚀 Starting auto-sync for Open Trellis..."
echo "📁 Watching for changes in: $(pwd)"
echo "🔗 Repository: https://github.com/Orphy123/open-Trellis-Trial"
echo ""

# Function to commit and push changes
commit_and_push() {
    echo "📝 Changes detected! Committing and pushing..."
    
    # Stage all changes
    git add .
    
    # Create commit message with timestamp and changed files
    CHANGED_FILES=$(git diff --cached --name-only | head -5 | tr '\n' ' ' | sed 's/ $//')
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S') - $CHANGED_FILES"
    
    # Commit changes
    git commit -m "$COMMIT_MSG"
    
    # Push to GitHub
    git push origin main
    
    echo "✅ Successfully pushed changes to GitHub!"
    echo "📋 Commit: $COMMIT_MSG"
    echo ""
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository!"
    exit 1
fi

# Check if we have a remote origin
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Error: No remote origin found!"
    exit 1
fi

echo "✅ Git repository found"
echo "✅ Remote origin configured"
echo ""

# Initial commit if there are uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📝 Found uncommitted changes, committing them first..."
    commit_and_push
fi

echo "👀 Watching for file changes... (Press Ctrl+C to stop)"
echo ""

# Watch for changes using fswatch (macOS) or inotifywait (Linux)
if command -v fswatch > /dev/null; then
    # macOS
    fswatch -o . | while read f; do
        # Ignore .git directory and node_modules
        if [[ ! "$f" =~ \.git ]] && [[ ! "$f" =~ node_modules ]]; then
            commit_and_push
        fi
    done
elif command -v inotifywait > /dev/null; then
    # Linux
    while inotifywait -r -e modify,create,delete,move . --exclude '\.git|node_modules'; do
        commit_and_push
    done
else
    echo "❌ Error: No file watcher found. Please install fswatch (macOS) or inotifywait (Linux)"
    echo "macOS: brew install fswatch"
    echo "Linux: sudo apt-get install inotify-tools"
    exit 1
fi 