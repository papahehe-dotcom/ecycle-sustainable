# E-Cycle Deployment Guide: Supabase + GitHub + Vercel

This guide outlines the exact, step-by-step process to connect E-Cycle to your Supabase PostgreSQL database, push the repository to GitHub, and deploy it to Vercel.

---

## 1. Setup Your Supabase Database

### Step 1.1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in or sign up.
2. Click **New Project** and fill in your project details:
   - **Name:** `e-cycle-mvp` (or any name you prefer)
   - **Database Password:** Store this securely.
   - **Region:** Choose a region closest to your users (e.g. *South Asia (Mumbai)* or *Southeast Asia (Singapore)*).
3. Click **Create new project** and wait ~2 minutes for provisioning to finish.

### Step 1.2: Run the SQL Schema
1. In your Supabase dashboard, click on the **SQL Editor** icon in the left navigation sidebar.
2. Click **New Query**.
3. Open the file `supabase/schema.sql` located in this project, copy its entire contents, and paste it into the Supabase SQL editor.
4. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).
5. You should see `Success. No rows returned`.
   - This automatically creates:
     - `public.profiles`
     - `public.appliance_requests`
     - `public.logistics_stops`
     - Row Level Security (RLS) policies allowing public web access with the anon key
     - Realtime replication for instant cross-dashboard updates
     - Pre-seeded initial appliances and demo stops!

### Step 1.3: Copy Your Supabase API Keys
1. In the Supabase dashboard, navigate to **Project Settings** (gear icon) → **API**.
2. Copy two values:
   - **Project URL** (e.g., `https://abcdefghijkl.supabase.co`)
   - **Project API Keys → `anon` `public`** key (starts with `eyJ...`)

---

## 2. Push Code to GitHub

Open your terminal in the root directory of this project and run:

```bash
# 1. Initialize git repository (if not already initialized)
git init

# 2. Add all files to git
git add .

# 3. Commit files
git commit -m "feat: complete E-Cycle MVP connected to Supabase"

# 4. Create your main branch
git branch -M main

# 5. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 3. Deploy to Vercel

### Step 3.1: Import Your Repository
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** → **Project**.
3. Select your GitHub account and find your newly pushed repository (`e-cycle-mvp`).
4. Click **Import**.

### Step 3.2: Configure Environment Variables
In the **Configure Project** screen on Vercel:
1. Ensure the Framework Preset is set to **Vite**.
2. Expand the **Environment Variables** section and add:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://your-project-id.supabase.co` (Your Supabase Project URL)
   <br />
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `your-supabase-anon-key` (Your Supabase Anon Public Key)
3. Click **Deploy**.

Vercel will build the project using `npm run build` and launch your live production website in under a minute!

---

## 4. SPA Routing Configuration

This repository includes a `vercel.json` file configured with the required Single Page Application (SPA) rewrites:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This prevents `404 Not Found` errors when refreshing deep URLs or navigating routes.

---

## 5. Testing the Live App
- **Live Database:** Whenever a customer submits an appliance, it writes directly into Supabase's `appliance_requests` table.
- **Engineer Updates:** When an engineer inspects or revises an offer, the record is immediately updated in Supabase.
- **Realtime Sync:** Supabase broadcasts changes automatically, so open tabs across customers and engineers sync without needing page reloads!
