# 🚀 Trim - Deployment Plan

## Overview
Complete plan to deploy **Trim** (File Converter for Architects) online with:
- ✅ Always-on, 24/7 uptime
- ✅ 100% FREE
- ✅ Reliable & scalable
- ✅ Auto-deploys from GitHub

---

## 📊 Architecture

```
Frontend (Vercel)         Backend (Railway)       Database (Supabase)
✅ Always awake           ✅ Always awake        ✅ Already hosted
✅ 100% free              ✅ $5/mo credit free   ✅ 100% free tier
✅ 100GB bandwidth        ✅ Stays on 24/7       ✅ 500MB storage
✅ Auto-deploys           ✅ Reliable
```

---

## 📋 STEP-BY-STEP DEPLOYMENT PLAN

### **PHASE 1: Code Preparation** (20 min)

#### Step 1.1: Initialize Git Repository
```bash
cd c:\01_Data\Personal Projects\Trim.app
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git add .
git commit -m "Initial commit: Trim file converter - Phase 4 complete"
```

#### Step 1.2: Create `.gitignore` (don't commit secrets)
Create file: `Trim.app/.gitignore`
```
# Environment variables (NEVER commit these!)
.env
.env.local
.env.production
.env.production.local

# Dependencies
node_modules/
.next/
dist/

# Build files
.DS_Store
*.log
```

#### Step 1.3: Create Production Environment Files

**File: `frontend/.env.production`**
```
NEXT_PUBLIC_SUPABASE_URL=https://ypbqrwqvqzfozvycmxht.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_FD_cCF8eYmwGOW-lYNESfQ_PHpHIClw
BACKEND_CONVERSION_URL=https://trim-api-XXXX.railway.app
```

**Important**: Don't commit `.env` files! Vercel & Railway will set these via UI.

#### Step 1.4: Verify package.json files

**`frontend/package.json` should have:**
```json
{
  "name": "trim-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

**`backend/package.json` should have:**
```json
{
  "name": "trim-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  }
}
```

#### Step 1.5: Push to GitHub

```bash
# Create GitHub repo first at github.com/new (name: trim)
git remote add origin https://github.com/YOUR_USERNAME/trim.git
git branch -M main
git push -u origin main
```

---

### **PHASE 2: Deploy Frontend to Vercel** (5 min)

#### Step 2.1: Create Vercel Account
- Go to **https://vercel.com**
- Sign up with GitHub
- Authorize Vercel to access your repos

#### Step 2.2: Create New Project
1. Click **"New Project"**
2. Select your `trim` repository
3. Click **Import**

#### Step 2.3: Configure Project Settings
1. **Framework Preset**: Next.js (auto-detected) ✅
2. **Root Directory**: `./frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

#### Step 2.4: Set Environment Variables
In Vercel dashboard, add under "Environment Variables":

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://ypbqrwqvqzfozvycmxht.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_FD_cCF8eYmwGOW-lYNESfQ_PHpHIClw

Name: BACKEND_CONVERSION_URL
Value: https://trim-api-XXXX.railway.app
(You'll get this URL after deploying backend)
```

#### Step 2.5: Deploy
- Click **"Deploy"**
- Wait for build to complete (2-3 min)
- Get URL: `https://trim-XXXXX.vercel.app` ✅

**Save this URL!** You'll need it later.

---

### **PHASE 3: Deploy Backend to Railway** (10 min)

#### Step 3.1: Create Railway Account
- Go to **https://railway.app**
- Sign up with GitHub
- Authorize Railway

#### Step 3.2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Select your `trim` repository
4. Confirm

#### Step 3.3: Configure Backend Service
Railway should auto-detect Node.js. If not:

1. Click **"New"** → **"Database"** (skip, using Supabase)
2. Click service card → **"Settings"**
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `npm start`
5. Set **Port**: `8080`

#### Step 3.4: Set Environment Variables
In Railway dashboard, under Variables:

```
SUPABASE_URL=https://ypbqrwqvqzfozvycmxht.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwYnFyd3F2cXpmb3p2eWNteGh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjk3ODg1OCwiZXhwIjoyMDk4NTU0ODU4fQ.GhB6QixYqKsOdnVtWjNj0XYbkhJ3gMh6EXiTGZPk_Vc
PORT=8080
```

#### Step 3.5: Deploy & Get URL
1. Click **"Deploy"**
2. Wait for build (1-2 min)
3. Go to **"Settings"** → **"Domains"**
4. Copy the Railway-assigned domain: `https://trim-api-XXXX.railway.app` ✅

**Save this URL!**

---

### **PHASE 4: Connect Frontend → Backend** (2 min)

#### Step 4.1: Update Frontend with Backend URL
1. Go to your GitHub repo
2. Edit `frontend/.env.production`:
   ```
   BACKEND_CONVERSION_URL=https://trim-api-XXXX.railway.app
   ```
3. Commit & push:
   ```bash
   git add frontend/.env.production
   git commit -m "Update backend URL for production"
   git push
   ```

#### Step 4.2: Update Vercel Environment Variable
1. Go to **vercel.com** dashboard
2. Select your `trim` project
3. Go to **Settings** → **Environment Variables**
4. Update `BACKEND_CONVERSION_URL`:
   ```
   https://trim-api-XXXX.railway.app
   ```
5. Click **Save**
6. Vercel auto-redeploys ✅

---

### **PHASE 5: Final Testing** (5 min)

#### Step 5.1: Test Frontend
1. Go to your Vercel URL: `https://trim-XXXXX.vercel.app`
2. You should see the Trim upload interface

#### Step 5.2: Test Upload & Conversion
1. Upload a PPT/DOC file
2. Watch progress bar (0-100%)
3. Download the PDF
4. Verify it contains real content ✅

#### Step 5.3: Check Logs
- **Vercel logs**: Dashboard → Project → **Deployments** → **View Function Logs**
- **Railway logs**: Dashboard → Service → **Logs**

---

## 💰 COST BREAKDOWN

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Frontend | **$0/month** | 100GB bandwidth free |
| Railway Backend | **$0/month** | $5 free credit monthly |
| Supabase Database | **$0/month** | 500MB storage free |
| **TOTAL** | **$0/month** | ✅ Completely free |

**Why Free?**
- Vercel free tier for startups/projects
- Railway gives $5/month free credit
- Supabase free tier sufficient for 500MB
- Conversions use CPU (Railway charges ~$0.25 per hour)

---

## ⚡ PERFORMANCE & RELIABILITY

### Uptime Guarantees
- ✅ Vercel: 99.99% uptime SLA
- ✅ Railway: 99.9% uptime SLA
- ✅ Supabase: 99.9% uptime SLA

### Always-On Status
- ✅ Vercel: Never sleeps
- ✅ Railway: Never sleeps (with $5 credit)
- ✅ Supabase: Cloud-hosted, always on

### Auto-Deployment
- Push to `main` branch → auto-deploys in 2-3 min
- Instant rollback if issues

---

## 🔒 SECURITY NOTES

### What NOT to Commit
```
❌ .env files (secrets)
❌ SUPABASE_KEY (service role)
❌ Private API keys
✅ Only commit .env.example
```

### Environment Variables Setup
- **Vercel**: Set via UI (not in repo)
- **Railway**: Set via UI (not in repo)
- **Never paste secrets in GitHub!**

---

## 📱 Domain Names (Optional)

After deployment, you can add custom domain:

**Vercel Custom Domain**:
1. Go to Vercel dashboard → Project → Settings → Domains
2. Add custom domain (e.g., `trim.yourdomain.com`)
3. Update DNS records

**Railway Custom Domain**:
1. Go to Railway → Project → Settings → Domains
2. Add custom domain
3. Update DNS records

---

## 🆘 Troubleshooting

### Frontend won't load
```
✓ Check Vercel deployment logs
✓ Verify env variables are set
✓ Clear browser cache
```

### Backend not converting files
```
✓ Check Railway deployment logs
✓ Verify SUPABASE_KEY is correct
✓ Check LibreOffice is installed on Railway (it is by default)
```

### Files not uploading to Supabase
```
✓ Check Supabase credentials
✓ Verify bucket permissions
✓ Check Supabase logs
```

---

## 📊 Monitoring & Analytics

### Monitor Your App
- **Vercel Analytics**: Dashboard → Insights
- **Railway Metrics**: Dashboard → Metrics
- **Supabase Stats**: https://supabase.com/dashboard

### Track Conversions
- Check Supabase `conversions` table for:
  - Total uploads
  - Conversion success rate
  - Average time per conversion

---

## ✅ CHECKLIST

Before going live:

- [ ] GitHub repo created and pushed
- [ ] Vercel project created
- [ ] Frontend environment variables set
- [ ] Frontend deployed successfully
- [ ] Railway project created
- [ ] Backend environment variables set
- [ ] Backend deployed successfully
- [ ] Frontend connected to backend URL
- [ ] Test file uploaded & converted
- [ ] Download works
- [ ] Both services showing green status

---

## 🎉 DEPLOYMENT COMPLETE!

Your app is now:
- ✅ Online 24/7
- ✅ Auto-scaling
- ✅ Free forever
- ✅ Reliable

**Share your URL**: `https://trim-XXXXX.vercel.app`

---

## 📝 NEXT STEPS (After Launch)

1. **Monitor Performance**
   - Track conversion times
   - Monitor server logs
   - Check error rates

2. **Add Features**
   - User authentication (Supabase Auth)
   - File history dashboard
   - Batch conversions
   - Email notifications

3. **Optimize**
   - Add caching for frequently converted files
   - Implement WebSocket for real-time updates
   - Add progress indicators

4. **Scale**
   - When free tier fills up, upgrade to paid
   - Consider background job queue (Bull, Celery)
   - Add CDN for PDF downloads

---

**Questions? Check logs or ask for help!** 🚀
