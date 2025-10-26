# GitHub Actions Setup Guide

Complete guide for setting up automated translation workflows with GitHub Actions.

## Overview

This guide covers two approaches:

1. **PR Workflow** - Creates pull requests for review
2. **Direct Commit** - Commits directly to main branch

## Prerequisites

- GitHub repository with i18nexus-tools
- Google Sheets with translations
- Google Service Account credentials

## Setup Steps

### 1. Prepare Google Credentials

Get your `credentials.json` file content:

```bash
# View credentials file
cat credentials.json

# Or copy to clipboard (macOS)
pbcopy < credentials.json

# Or copy to clipboard (Linux)
xclip -selection clipboard < credentials.json
```

### 2. Add GitHub Secret

1. Go to your repository on GitHub
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Fill in:
   - **Name**: `GOOGLE_CREDENTIALS`
   - **Secret**: Paste your entire `credentials.json` content
5. Click **"Add secret"**

### 3. Enable Workflow Permissions

1. Go to: **Settings → Actions → General**
2. Scroll to **"Workflow permissions"**
3. Select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
4. Click **"Save"**

## Workflow Options

### Option 1: PR Workflow (Recommended)

Creates a pull request for review before merging.

**File**: `.github/workflows/i18n-download.yml`

**Features:**

- ✅ Creates PR for review
- ✅ Only creates PR if changes exist
- ✅ Includes detailed PR description
- ✅ Adds labels automatically
- ✅ Safe for production

**When to use:**

- Production environments
- Team review required
- Quality control needed

### Option 2: Direct Commit

Commits directly to main branch without PR.

**File**: `.github/workflows/i18n-download-direct.yml`

**Features:**

- ✅ Faster deployment
- ✅ No manual approval needed
- ✅ Includes `[skip ci]` to prevent loops
- ⚠️ No review process

**When to use:**

- Development environments
- Trusted translation source
- Automated workflows

## Testing

### Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select workflow:
   - "Download Translations" (PR workflow)
   - "Download Translations (Direct Commit)"
3. Click **"Run workflow"**
4. Select branch (usually `main`)
5. Click **"Run workflow"** button
6. Wait for completion

### Check Results

**PR Workflow:**

- Check **Pull requests** tab for new PR
- Review translation changes
- Merge when ready

**Direct Commit:**

- Check **Commits** for new commit
- Pull latest changes: `git pull`

## Troubleshooting

### Error: Authentication Failed

**Symptoms:**

```
Error: Failed to authenticate with Google Sheets
```

**Solutions:**

1. Verify `GOOGLE_CREDENTIALS` secret exists
2. Check secret contains valid JSON
3. Ensure service account has access to spreadsheet

### Error: Permission Denied

**Symptoms:**

```
Error: refusing to allow a GitHub App to create or update workflow
```

**Solutions:**

1. Enable workflow permissions (see Setup Steps #3)
2. Check repository settings allow Actions

### Error: No Changes to Commit

**Not an error** - Workflow completes successfully but:

- No changes detected in translations
- PR/commit not created (expected behavior)

### Error: npm ci Failed

**Symptoms:**

```
Error: Cannot find module
```

**Solutions:**

1. Ensure `package-lock.json` exists
2. Check `package.json` has i18nexus-tools dependency
3. Try using `npm install` instead

## Advanced Configuration

### Custom Schedule

Change cron schedule:

```yaml
on:
  schedule:
    - cron: "0 */6 * * *" # Every 6 hours
    - cron: "0 9 * * 1-5" # 9 AM weekdays only
```

**Cron Examples:**

- `0 0 * * *` - Daily at midnight
- `0 */6 * * *` - Every 6 hours
- `0 9 * * 1-5` - 9 AM weekdays
- `0 0 * * 0` - Weekly on Sunday

### Multiple Languages

Handle multiple locale directories:

```yaml
- name: Download translations
  run: |
    npx i18n-download
    # Additional commands if needed

- name: Check for changes
  id: check_changes
  run: |
    git diff --quiet locales/ public/locales/ || echo "changes=true" >> $GITHUB_OUTPUT
```

### Custom PR Configuration

Customize PR creation:

```yaml
- name: Create Pull Request
  uses: peter-evans/create-pull-request@v5
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    commit-message: "chore: update translations"
    title: "🌍 [Automated] Translation Update"
    body: |
      ## Automated Translation Update

      Downloaded from Google Sheets at ${{ github.run_id }}
    branch: "translations-${{ github.run_number }}"
    labels: |
      translations
      automated
      priority: low
    reviewers: |
      translator-team
    assignees: |
      project-manager
```

### Notification on Failure

Add Slack or Discord notification:

```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Translation download failed!",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Translation download failed in ${{ github.repository }}"
            }
          }
        ]
      }
```

## Security Best Practices

### 1. Protect Credentials

✅ **Do:**

- Store credentials in GitHub Secrets
- Use `chmod 600` for credentials file
- Clean up credentials after use
- Never commit credentials to repository

❌ **Don't:**

- Hardcode credentials in workflow
- Echo credentials in logs
- Commit credentials file

### 2. Use Least Privilege

- Give service account only necessary permissions
- Use read-only access where possible
- Limit workflow permissions

### 3. Review Changes

- Use PR workflow for production
- Review translation changes before merge
- Test with new translations

## Monitoring

### View Workflow Runs

1. Go to **Actions** tab
2. Select workflow name
3. View recent runs
4. Click run to see details

### Check Logs

1. Click on workflow run
2. Click on job name
3. Expand steps to view logs
4. Download logs if needed

### Set Up Notifications

Enable notifications for:

- ✅ Workflow failures
- ✅ PR creation
- ✅ Successful completions

## Examples

### Complete PR Workflow

See: `.github/workflows/i18n-download.yml`

### Complete Direct Commit Workflow

See: `.github/workflows/i18n-download-direct.yml`

### Hybrid Approach

Use PR for main branch, direct commit for dev:

```yaml
on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  download:
    runs-on: ubuntu-latest
    steps:
      # ... setup steps ...

      - name: Decide workflow based on branch
        id: decide
        run: |
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "mode=pr" >> $GITHUB_OUTPUT
          else
            echo "mode=direct" >> $GITHUB_OUTPUT
          fi

      - name: Create PR (production)
        if: steps.decide.outputs.mode == 'pr'
        uses: peter-evans/create-pull-request@v5
        # ... PR config ...

      - name: Direct commit (development)
        if: steps.decide.outputs.mode == 'direct'
        run: |
          # ... commit and push ...
```

## Support

### Documentation

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [i18n-download Command](./cli/i18n-download.md)
- [Google Sheets Guide](./guides/google-sheets.md)

### Community

- [Report Issues](https://github.com/manNomi/i18nexus/issues)
- [Discussions](https://github.com/manNomi/i18nexus/discussions)
