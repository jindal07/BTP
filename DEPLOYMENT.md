# 🚀 Vercel Deployment Guide

## Quick Deploy (2 Minutes)

### Method 1: GitHub + Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy" (auto-detects configuration!)
   - Done! ✅

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

---

## 📁 Project Structure

```
json/
├── vercel.json              # Vercel configuration (builds & routes)
├── .vercelignore           # Files to exclude from deployment
├── package.json            # Build script for frontend
├── api/
│   ├── index.py           # FastAPI serverless function
│   └── requirements.txt   # Python dependencies
├── csv_data/
│   └── nirf_combined_data.csv  # College data
├── nirf_predictions_2025.csv   # Predictions data
└── react-frontend/
    ├── src/               # React source code
    ├── package.json       # Frontend dependencies
    └── dist/             # Build output (auto-generated)
```

---

## ⚙️ Configuration Files

### `vercel.json`
```json
{
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "react-frontend/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**What this does:**
- **Build 1**: Compiles Python API using `@vercel/python`
- **Build 2**: Builds React frontend from `package.json`
- **Route 1**: Sends `/api/*` requests to Python function
- **Route 2**: Sends all other requests to React app

### `package.json`
```json
{
  "name": "nirf-rankings-portal",
  "version": "1.0.0",
  "scripts": {
    "build": "cd react-frontend && npm install && npm run build"
  }
}
```

**Build process:**
1. Changes to `react-frontend/` directory
2. Installs dependencies
3. Runs Vite build
4. Outputs to `react-frontend/dist/`

### `.vercelignore`
```
node_modules
.git
__pycache__
*.pyc
.env
.env.local
.vscode
.idea
.DS_Store
*.log
npm-debug.log*
```

Excludes development files from deployment.

---

## 🔍 How It Works

### Frontend (React + Vite + Tailwind)
```
Build: npm run build
Output: react-frontend/dist/
Type: Static files
CDN: Global (fast delivery worldwide)
```

### Backend (FastAPI Python)
```
File: api/index.py
Builder: @vercel/python
Runtime: Python 3.9 (managed by Vercel)
Dependencies: api/requirements.txt
Type: Serverless function
```

### Data Files
```
csv_data/nirf_combined_data.csv    → Bundled with Python function
nirf_predictions_2025.csv          → Bundled with Python function
```

### Routes
```
https://your-app.vercel.app/           → React app (index.html)
https://your-app.vercel.app/about      → React app (client-side routing)
https://your-app.vercel.app/api/health → Python serverless function
https://your-app.vercel.app/api/colleges → Python serverless function
https://your-app.vercel.app/api/predictions → Python serverless function
```

---

## ✅ Pre-Deployment Checklist

- [ ] All changes committed to git
- [ ] `vercel.json` configured
- [ ] `api/index.py` exists
- [ ] `api/requirements.txt` exists
- [ ] CSV data files present
- [ ] `react-frontend/package.json` has build script
- [ ] Local build works

---

## 🧪 Test Locally First

### Test Frontend Build
```bash
cd react-frontend
npm install
npm run build
# Check that react-frontend/dist/ was created
ls -la dist/
```

### Test Backend Locally
```bash
cd api
pip install -r requirements.txt
python -m uvicorn index:app --port 8000 --reload
# Visit http://localhost:8000/api/health
```

### Test Frontend Dev Server
```bash
cd react-frontend
npm run dev
# Visit http://localhost:3000
```

---

## 📊 After Deployment

### Test Your Live Endpoints

**Frontend Homepage:**
```
https://your-app.vercel.app
```

**API Health Check:**
```bash
curl https://your-app.vercel.app/api/health
```

**College Data:**
```bash
curl https://your-app.vercel.app/api/colleges | head -100
```

**Predictions:**
```bash
curl https://your-app.vercel.app/api/predictions
```

### View Deployment Logs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. View logs:
   - **Build Logs** - Frontend build process
   - **Function Logs** - API runtime logs

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Test locally:**
```bash
# Test frontend build
cd react-frontend
rm -rf node_modules dist
npm install
npm run build

# Check output
ls -la dist/
```

### Issue: API Returns Errors

**Check Function Logs:**
1. Vercel Dashboard → Your Project → Deployments
2. Click latest deployment
3. Click "Functions" tab
4. View error messages

**Common fixes:**
- Verify `api/requirements.txt` is correct
- Check CSV files are committed to git
- Ensure file paths are correct in `api/index.py`

### Issue: 404 on Frontend Routes

**Solution:** The `vercel.json` routes configuration handles this:
```json
{
  "src": "/(.*)",
  "dest": "/index.html"
}
```

This ensures React Router works properly.

### Issue: CORS Errors

**Solution:** Already configured in `api/index.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🎯 Expected Deployment Output

```
Vercel Deployment:
  
  Building...
  ✓ Build 1: @vercel/python (api/index.py)
    Installing dependencies from api/requirements.txt
    ✓ fastapi
    ✓ pandas
    ✓ numpy
    ✓ scikit-learn
    Completed in 45s
  
  ✓ Build 2: @vercel/static-build (package.json)
    Running: cd react-frontend && npm install && npm run build
    ✓ Vite build complete
    ✓ react-frontend/dist/ created (1.2 MB)
    Completed in 2m 10s
  
  Deploying...
  ✓ Frontend: Static files to CDN
  ✓ Backend: Serverless function
  
  ✅ Deployed to Production
  
  https://your-project-abc123.vercel.app
  
  Unique URL: https://your-project-git-main-username.vercel.app
```

---

## 💰 Vercel Free Tier

**Includes:**
- ✅ Unlimited projects
- ✅ 100 GB bandwidth/month
- ✅ 100 hours serverless execution/month
- ✅ Automatic SSL certificates
- ✅ Global CDN (300+ edge locations)
- ✅ Automatic HTTPS redirects
- ✅ DDoS protection

**Your project usage:** ~1-2 GB/month - Perfect for free tier!

---

## 🔄 Continuous Deployment

Once connected to GitHub, every push triggers a new deployment:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs builds
# 3. Deploys to production
# 4. Sends you a notification
```

**Preview Deployments:**
- Every branch and PR gets a unique URL
- Test changes before merging
- Automatic cleanup after merge

---

## 🎨 Features After Deployment

### Working Features:
- ✅ Homepage with NIRF logo
- ✅ Search and filter colleges
- ✅ Sort by rank, score, year
- ✅ College cards with quick stats
- ✅ Compare up to 3 colleges
- ✅ Predictions for 2026
- ✅ Detailed college modal with sub-parameters
- ✅ Admin panel (backend status)
- ✅ Beautiful UI with custom color palette
- ✅ Responsive design (mobile-friendly)
- ✅ Fast loading (CDN + optimized)

### API Endpoints:
- ✅ `GET /api/health` - Health check
- ✅ `GET /api/colleges` - All college data
- ✅ `GET /api/predictions` - Prediction data
- ✅ `POST /api/admin/upload` - Upload CSV

---

## 📱 Custom Domain (Optional)

### Add Custom Domain:

1. **In Vercel Dashboard:**
   - Your Project → Settings → Domains
   - Add your domain (e.g., `nirf-rankings.com`)

2. **Update DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers

3. **SSL Certificate:**
   - Automatically issued by Vercel
   - Free Let's Encrypt certificate
   - Auto-renewal

---

## 🔧 Environment Variables (Optional)

### Add Environment Variables:

1. **In Vercel Dashboard:**
   - Your Project → Settings → Environment Variables

2. **Add Variables:**
   ```
   API_KEY=your_secret_key
   DATABASE_URL=your_db_url
   ```

3. **Access in Code:**
   ```python
   import os
   api_key = os.getenv("API_KEY")
   ```

---

## 📈 Monitoring & Analytics

### Vercel Dashboard Provides:
- 📊 **Analytics** - Page views, unique visitors
- ⚡ **Performance** - Load times, Core Web Vitals
- 🔍 **Function Logs** - API request logs
- 🚀 **Deployment History** - All past deployments
- 🔄 **Rollback** - Instant rollback to previous version

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Homepage loads with NIRF logo
- [ ] College cards display
- [ ] Search and filters work
- [ ] Compare tab functions
- [ ] Predictions tab shows data
- [ ] College modal opens with details
- [ ] Sub-parameters display correctly
- [ ] Admin tab shows "Backend Connected"
- [ ] All API endpoints respond
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate active (https://)

---

## 🎉 You're Live!

Your NIRF Rankings Portal is now deployed with:
- ✅ Production-ready infrastructure
- ✅ Global CDN for fast delivery
- ✅ Serverless backend (auto-scaling)
- ✅ Automatic SSL/HTTPS
- ✅ Free hosting (Vercel free tier)
- ✅ Continuous deployment from GitHub
- ✅ Zero server maintenance

---

## 📞 Need Help?

### Check Logs:
- **Build errors:** Build Logs tab
- **API errors:** Function Logs tab
- **Frontend errors:** Browser Console

### Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Guide](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/vercel/)

### Common Commands:
```bash
# View deployment status
vercel ls

# View logs
vercel logs

# Rollback to previous deployment
vercel rollback

# Remove a deployment
vercel rm deployment-url
```

---

**🚀 Deploy now and share your NIRF Rankings Portal with the world!**
