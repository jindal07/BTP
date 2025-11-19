# 🚀 Vercel Deployment Guide

## Quick Deploy (2 Minutes)

### Method 1: GitHub + Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Done! ✅

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📁 Project Structure

```
json/
├── vercel.json              # Vercel configuration
├── .vercelignore           # Files to exclude
├── package.json            # Build script
├── api/
│   ├── index.py           # FastAPI serverless function
│   └── requirements.txt   # Python dependencies
├── csv_data/
│   └── nirf_combined_data.csv
├── nirf_predictions_2025.csv
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
  "buildCommand": "cd react-frontend && npm install && npm run build",
  "outputDirectory": "react-frontend/dist"
}
```

**What this does:**
- Builds React frontend with Vite
- Outputs to `react-frontend/dist`
- Vercel auto-detects `api/index.py` as Python function
- Vercel auto-installs from `api/requirements.txt`
- All files in `api/` directory are included (CSV data)

### `.vercelignore`
Excludes development files from deployment:
- `node_modules/`
- `.git/`
- Python cache files
- Environment files
- Editor configs

---

## 🔍 How It Works

### Frontend (React + Vite + Tailwind)
```
Build: npm install && npm run build
Output: react-frontend/dist/
Deployed as: Static files (fast CDN)
```

### Backend (FastAPI Python)
```
Detection: Auto-detected from api/index.py
Runtime: Python 3.9 (Vercel default)
Dependencies: Auto-installed from api/requirements.txt
Data Files: All files in api/ directory included
Deployed as: Serverless function
```

### Routes
```
https://your-app.vercel.app/           → React app (index.html)
https://your-app.vercel.app/api/health → Python API
https://your-app.vercel.app/api/colleges → Python API
https://your-app.vercel.app/api/predictions → Python API
```

---

## ✅ Pre-Deployment Checklist

- [ ] All changes committed to git
- [ ] `api/index.py` exists
- [ ] `api/requirements.txt` exists
- [ ] CSV data files present
- [ ] `react-frontend/package.json` has build script
- [ ] Local build works: `cd react-frontend && npm run build`

---

## 🧪 Test Locally First

### Frontend
```bash
cd react-frontend
npm install
npm run dev
# Visit http://localhost:3000
```

### Backend
```bash
cd api
pip install -r requirements.txt
python -m uvicorn index:app --port 8000 --reload
# Visit http://localhost:8000/api/health
```

---

## 📊 After Deployment

### Test Your Endpoints

**Frontend:**
```
https://your-app.vercel.app
```

**API Health Check:**
```
https://your-app.vercel.app/api/health
```

**College Data:**
```
https://your-app.vercel.app/api/colleges
```

**Predictions:**
```
https://your-app.vercel.app/api/predictions
```

### View Logs

1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. View "Build Logs" or "Function Logs"

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Test build locally
cd react-frontend
rm -rf node_modules dist
npm install
npm run build
```

### API Not Working
- Check Function Logs in Vercel Dashboard
- Verify `api/requirements.txt` exists
- Ensure CSV files are committed to git

### 404 Errors
- Frontend routes: Check `react-frontend/dist/` was created
- API routes: Check `api/index.py` exists

---

## 🎯 Expected Build Output

```
✓ Building Frontend...
  cd react-frontend && npm install && npm run build
  ✓ react-frontend/dist/ created
  ✓ 1.2 MB total (optimized)

✓ Detecting API...
  Found: api/index.py
  Runtime: Python 3.9
  Dependencies: api/requirements.txt
  ✓ Installed: fastapi, pandas, scikit-learn

✓ Deploying...
  Frontend: Static (CDN)
  Backend: Serverless Function
  
✅ Deployed to: https://your-project.vercel.app
```

---

## 💰 Vercel Free Tier

**Includes:**
- Unlimited projects
- 100 GB bandwidth/month
- 100 hours serverless execution/month
- Automatic SSL certificates
- Global CDN

**Your project uses ~1-2 GB/month - Perfect for free tier!**

---

## 🔄 Continuous Deployment

Once connected to GitHub:
```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys! 🎉
```

---

## ✅ You're Ready!

Your configuration is clean and correct. Deploy now:

1. Commit changes
2. Push to GitHub
3. Deploy on Vercel
4. Done! 🚀

**Questions?** Check the [Vercel Documentation](https://vercel.com/docs)

