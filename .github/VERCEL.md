# Vercel Deployment Setup

Auto-deploy docs-v2 to Vercel on changes.

## Setup Steps

### 1. Create Vercel Project

```bash
cd docs-v2
npm i -g vercel
vercel link
```

This creates `.vercel/project.json`.

### 2. Get Vercel Credentials

From Vercel dashboard:
- Account Settings → Tokens → Create
- Copy token (VERCEL_TOKEN)

Get IDs from `.vercel/project.json`:
- `orgId` → VERCEL_ORG_ID
- `projectId` → VERCEL_PROJECT_ID

### 3. Add GitHub Secrets

Settings → Secrets and variables → Actions

Add:
- `VERCEL_TOKEN` — Personal access token
- `VERCEL_ORG_ID` — Organization ID
- `VERCEL_PROJECT_ID` — Project ID

### 4. Configure Vercel Build

Create `vercel.json` in docs-v2:

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_DOCS_VERSION": "@latest"
  }
}
```

## Deployment Triggers

- **Preview:** Push to `dev` or feature branches
- **Production:** Push to `main`
- **Only:** When docs-v2/ files change

## Domains

Configure custom domains in Vercel:
- Production: docs.lunar-kit.dev (or your domain)
- Preview: [branch]--lunar-kit-docs.vercel.app

## Rollback

If deploy fails:
- Previous version stays live
- Check GitHub Actions logs for build errors
- Vercel dashboard shows deployment history

## Monitoring

- Vercel dashboard for deployment status
- GitHub Actions logs for build output
- Email notifications on failures
