# GitHub Pages Deployment Guide

## Step 1: Initialize Git Repository

```bash
cd c:\github_repos\portfolio
git init
git add .
git commit -m "Initial commit: Portfolio website"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `portfolio`
3. Description: "Personal portfolio website showcasing DevSecOps, MLOps, and Cloud Engineering expertise"
4. Set to **Public**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 3: Push to GitHub

```bash
git remote add origin https://github.com/drakeshnag-rjo/portfolio.git
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository: https://github.com/drakeshnag-rjo/portfolio
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

Your site will be available at: `https://drakeshnag-rjo.github.io/portfolio/`

## Step 5: Register is-a.dev Domain

### 5.1 Fork the is-a.dev Register Repository

1. Go to: https://github.com/is-a-dev/register
2. Click **Fork** button (top right)
3. Create fork in your account

### 5.2 Create Domain JSON File

1. In your forked repository, navigate to the `domains/` folder
2. Click **Add file** → **Create new file**
3. Name the file: `drrakeshnagdasari.json`
4. Add the following content:

```json
{
  "owner": {
    "username": "drakeshnag-rjo"
  },
  "records": {
    "CNAME": "drakeshnag-rjo.github.io"
  },
  "proxied": true
}
```

5. Click **Commit changes**

### 5.3 Create Pull Request

1. Go to your forked repository
2. Click **Contribute** → **Open pull request**
3. Fill in the pull request template:
   - Title: `Add drrakeshnagdasari.is-a.dev`
   - Description: Include:
     - Link to your website: `https://drakeshnag-rjo.github.io/portfolio/`
     - Screenshot of your website
     - Brief description: "Personal portfolio for Dr. Rakeshnag Dasari - Sr. DevSecOps/MLOps Engineer"
4. Click **Create pull request**

### 5.4 Wait for Approval

- Maintainers will review your PR (usually within 24-48 hours)
- They may request changes
- Once approved and merged, your domain will be active within a few hours

## Step 6: Configure Custom Domain in GitHub Pages

**IMPORTANT:** Only do this AFTER your is-a.dev pull request is merged!

1. Go to your repository Settings → Pages
2. Under "Custom domain", the CNAME file should already have set: `drrakeshnagdasari.is-a.dev`
3. Check "Enforce HTTPS" (wait a few minutes for the certificate)

## Verification

After everything is set up:
- GitHub Pages URL: https://drakeshnag-rjo.github.io/portfolio/
- Custom Domain: https://drrakeshnagdasari.is-a.dev

## Troubleshooting

### GitHub Pages not working?
- Check that the repository is public
- Verify GitHub Pages is enabled in Settings
- Wait 5-10 minutes after enabling

### Custom domain not working?
- Ensure is-a.dev PR is merged
- Check DNS propagation (can take up to 24 hours)
- Verify CNAME file exists in repository root
- Make sure "Enforce HTTPS" is checked

### is-a.dev PR rejected?
- Ensure website is complete and professional
- Website must be personal/non-commercial
- Include proper screenshot and description
- Follow all guidelines in the PR template

## Future Updates

To update your portfolio:

```bash
cd c:\github_repos\portfolio
# Make your changes
git add .
git commit -m "Update: description of changes"
git push
```

Changes will be live on GitHub Pages within 1-2 minutes!

---

**Need help?** Check:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [is-a.dev Documentation](https://docs.is-a.dev/)
- [is-a.dev Discord](https://discord.gg/is-a-dev-830872854677422150)
