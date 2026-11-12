# Deploying OpsFlow to Vercel

OpsFlow has no backend, database or environment variables, so a Vercel deployment needs no extra configuration.

## Before you deploy

Run the full quality check locally:

```bash
npm run check
```

This runs lint, typecheck, unit tests and a production build. If it passes locally, it will build on Vercel too.

## Option A: Deploy from GitHub (recommended)

1. **Push the project to GitHub.**
   ```bash
   git add .
   git commit -m "Initial OpsFlow release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/opsflow.git
   git push -u origin main
   ```
2. **Import it into Vercel.** Sign in at [vercel.com](https://vercel.com), click **Add New… → Project**, and select the `opsflow` repository.
3. **Check the settings.** Vercel detects Next.js automatically. Keep the defaults:
   | Setting | Value |
   | --- | --- |
   | Framework preset | Next.js |
   | Build command | `next build` (default) |
   | Output directory | `.next` (default) |
   | Install command | `npm install` (default) |
   | Environment variables | none |
4. Click **Deploy**. After about a minute you'll get a URL like `https://opsflow-<hash>.vercel.app`.
5. **Optional:** in **Settings → Domains**, add a nicer subdomain (e.g. `opsflow-demo.vercel.app`) or your own domain.

From now on, every push to `main` deploys to production, and every pull request gets its own preview URL.

## Option B: Deploy from the command line

```bash
npm i -g vercel
vercel login
vercel          # creates a preview deployment
vercel --prod   # promotes to production
```

The first run asks a few questions (project name, scope). The defaults are fine.

## After deploying

- Open the URL in a private window to see what a first-time visitor sees: the demo data should load automatically.
- Add an order, refresh the page, and confirm it is still there.
- Use **Reset demo data** in the sidebar to return to a clean state before recording a demo or taking screenshots.

## Node.js version

The project declares `"node": ">=22.12"` in `package.json` (`engines`). Vercel's default Node.js 24 LTS satisfies it. To pin a specific version, use **Settings → General → Node.js Version**, or tighten the `engines` field:

```json
"engines": { "node": ">=22.12" }
```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Build fails on lint or type errors | Run `npm run check` locally and fix the reported issue |
| Fonts fail to download during build | Retry the deployment; Inter is fetched from Google Fonts at build time |
| Data differs between devices | Expected: data is stored per browser in `localStorage` |
