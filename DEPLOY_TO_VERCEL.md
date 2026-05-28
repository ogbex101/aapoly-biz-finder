# Deploying AAPoly Biz Finder to Vercel via GitHub

## What changed from the Lovable version
- Removed Cloudflare Workers / SSR setup
- Removed `@lovable.dev/vite-tanstack-config` and `@tanstack/react-start`
- Now a standard Vite + React SPA — builds to a static `dist/` folder
- Added `vercel.json` so all routes fall back to `index.html` (required for client-side routing)

---

## Step 1: Push to GitHub

1. Create a new repo on [github.com/new](https://github.com/new)
   - Name it e.g. `aapoly-biz-finder`
   - Set it to **Private** (recommended — your Supabase credentials are in the code)
   - Do **not** initialize with a README

2. In your terminal, inside this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — SPA build for Vercel"
   git remote add origin https://github.com/YOUR_USERNAME/aapoly-biz-finder.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or sign up with GitHub)
2. Click **Add New → Project**
3. Select your `aapoly-biz-finder` repo from the list
4. Vercel will auto-detect it as a Vite project. Confirm these settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

---

## Step 3: Set Environment Variables in Vercel

Before deploying, add your Supabase credentials:

1. In the Vercel project setup, click **Environment Variables**
2. Add these two:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

   Get these from: https://supabase.com/dashboard/project/_/settings/api

3. Click **Deploy**

---

## Step 4: Done!

Vercel will build and deploy. Every time you push to the `main` branch on GitHub, Vercel will automatically redeploy.

---

## Local development

```bash
npm install

# Create a .env.local file with your Supabase keys
cp .env.example .env.local
# Edit .env.local and fill in your values

npm run dev
```
