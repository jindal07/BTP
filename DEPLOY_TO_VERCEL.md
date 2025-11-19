# 🚀 Deploy to Vercel - Quick Guide

## ✅ Configuration Complete!

Your `vercel.json` is now properly configured for deployment.

---

## 📋 What's Configured

### **Frontend (React + Vite + Tailwind)**
```
Build Command: cd react-frontend && npm install && npm run build
Output Directory: react-frontend/dist
Size: ~360 KB (optimized)
```

### **Backend (FastAPI - Python 3.11)**
```
Runtime: Python 3.11
Location: api/index.py
Includes: 
  - csv_data/nirf_combined_data.csv
  - nirf_predictions_2025.csv
```

### **Routes**
```
/api/* → Python serverless function
/* → React static files
```

---

## 🚀 Deploy Now (2 Methods)

### **Method 1: Vercel Dashboard** ⭐ Recommended

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy" (it auto-detects settings!)

3. **Done!** ✅
   - Wait 2-3 minutes
   - Your site will be live at `https://your-project.vercel.app`

---

### **Method 2: Vercel CLI** ⚡ Fast

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## ✅ Pre-Deployment Checklist

- [x] ✅ `vercel.json` configured
- [x] ✅ `api/index.py` exists
- [x] ✅ `api/requirements.txt` exists
- [x] ✅ `csv_data/nirf_combined_data.csv` exists
- [x] ✅ `nirf_predictions_2025.csv` exists
- [x] ✅ `react-frontend/` with source code
- [x] ✅ `.vercelignore` configured
- [x] ✅ Local build works

---

## 🧪 Test Before Deploy

```bash
# Test frontend build
cd react-frontend
npm install
npm run build
ls -la dist/

# Test backend locally
cd ../api
pip install -r requirements.txt
python -m uvicorn index:app --port 8000
```

Both should work without errors!

---

## 🐛 Common Issues & Fixes

### **Issue: Build fails**
**Fix:** Test locally first:
```bash
cd react-frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Issue: API doesn't work**
**Fix:** Check that `api/requirements.txt` exists:
```bash
cat api/requirements.txt
```
Should contain:
```
fastapi
pandas
numpy
scikit-learn
python-multipart
```

### **Issue: Data not found**
**Fix:** Ensure files are committed:
```bash
git add csv_data/ nirf_predictions_2025.csv
git commit -m "Add data files"
git push
```

---

## 📊 After Deployment

### **Test Your Endpoints:**

**Frontend:**
```
https://your-app.vercel.app
```

**API Health:**
```
https://your-app.vercel.app/api/health
```

**Colleges Data:**
```
https://your-app.vercel.app/api/colleges
```

**Predictions:**
```
https://your-app.vercel.app/api/predictions
```

---

## 🎯 Expected Results

### **Successful Deployment:**
```
✓ Building...
✓ Deploying...
✓ Ready! https://your-project.vercel.app
   Deployment completed in 2m 15s
```

### **Working Features:**
- ✅ Homepage loads with NIRF logo
- ✅ College cards display
- ✅ Search and filters work
- ✅ Compare tab functional
- ✅ Predictions tab shows data
- ✅ College modal shows detailed sub-parameters
- ✅ Admin tab shows backend status

---

## 💰 Pricing

**Vercel Hobby (Free):**
- ✅ Unlimited projects
- ✅ 100 GB bandwidth/month
- ✅ 100 hours serverless/month
- ✅ SSL certificates included

**Your project uses ~1-2 GB/month - You're covered!** ✅

---

## 🔧 Vercel Dashboard Features

After deployment, you can:
- 📊 View deployment logs
- 🔄 Redeploy with one click
- 🌐 Add custom domain
- 📈 View analytics
- ⚙️ Manage environment variables
- 🔍 Monitor function performance

---

## 📱 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL automatically configured!

---

## 🎉 Success!

Your NIRF Rankings Portal is now live with:
- ✅ Modern React frontend
- ✅ FastAPI Python backend
- ✅ ML predictions
- ✅ Beautiful UI with NIRF logo
- ✅ Detailed sub-parameters
- ✅ Global CDN
- ✅ Automatic SSL
- ✅ Zero server management

---

## 📞 Need Help?

**Check Deployment Logs:**
1. Vercel Dashboard → Your Project
2. Click latest deployment
3. View "Build Logs" or "Function Logs"

**Common Log Locations:**
- Build errors → Build Logs
- API errors → Function Logs
- Frontend errors → Browser Console

---

## 🔄 Continuous Deployment

**Automatic deployment on every push:**
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys! 🚀
```

**Manual deployment:**
```bash
vercel --prod
```

---

**🎊 Your project is ready to deploy! Go to [vercel.com](https://vercel.com) and deploy now!** 🚀

