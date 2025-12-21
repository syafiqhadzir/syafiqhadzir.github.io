#!/usr/bin/env pwsh
# ==============================================================================
# Git Hygiene Script - Branch Cleanup
# ==============================================================================
# Safely removes local branches that have been merged into main
# Run: pwsh scripts/git-cleanup.ps1
# ==============================================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "🧹 Git Branch Cleanup"
Write-Host "═" * 60

# Ensure we're on main
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Host "⚠️  Switching to main branch first..."
    git checkout main
}

# Fetch latest
Write-Host "`n📥 Fetching latest from remote..."
git fetch --prune

# Get merged branches (excluding main and current)
Write-Host "`n🔍 Finding merged branches..."
$mergedBranches = git branch --merged | 
    Where-Object { $_ -notmatch '^\*' } | 
    Where-Object { $_ -notmatch 'main' } |
    ForEach-Object { $_.Trim() }

if ($mergedBranches.Count -eq 0) {
    Write-Host "`n✅ No merged branches to clean up!"
} else {
    Write-Host "`n📋 Branches that can be safely deleted:"
    $mergedBranches | ForEach-Object { Write-Host "   - $_" }
    
    Write-Host ""
    $confirm = Read-Host "Delete these branches? (y/N)"
    
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        $mergedBranches | ForEach-Object {
            Write-Host "   🗑️ Deleting $_..."
            git branch -d $_
        }
        Write-Host "`n✅ Cleanup complete!"
    } else {
        Write-Host "`n⏭️ Skipped - no branches deleted."
    }
}

# Show stale remote tracking branches
Write-Host "`n🔍 Checking for stale remote tracking branches..."
$staleBranches = git remote prune origin --dry-run 2>&1

if ($staleBranches -match "would prune") {
    Write-Host "`n📋 Stale remote tracking branches:"
    $staleBranches | ForEach-Object { Write-Host "   $_" }
    
    $confirm = Read-Host "`nPrune these? (y/N)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        git remote prune origin
        Write-Host "`n✅ Remote branches pruned!"
    }
} else {
    Write-Host "✅ No stale remote tracking branches."
}

Write-Host ""
Write-Host "═" * 60
Write-Host "🎉 Git hygiene complete!"
Write-Host "═" * 60
Write-Host ""
