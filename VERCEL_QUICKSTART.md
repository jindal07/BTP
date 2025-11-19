# ⚡ Deploy to Vercel - 5 Minute Guide

Deploy your complete NIRF Rankings Portal (Frontend + Backend) to Vercel RIGHT NOW! 🚀

---

## 🎯 Two Ways to Deploy

### **Option 1: Vercel Dashboard** (Recommended for First Time)
### **Option 2: Vercel CLI** (Faster for Developers)

Choose your method below! ⬇️

---

## 🖱️ **Option 1: Vercel Dashboard** (5 Minutes)

### **Step 1: Push to GitHub** (1 min)

```bash
# Make sure you're in the project root
cd C:/Users/harsh/Downloads/json

# Add all files
git add .

# Commit
git commit -m "Configure for Vercel deployment"

# Push (replace 'main' with your branch name if different)
git push origin main
```

If you don't have Git set up:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### **Step 2: Import to Vercel** (2 min)

1. **Go to** → [vercel.com](https://vercel.com)
2. **Click** → "New Project"
3. **Click** → "Import Git Repository"
4. **Select** → Your repository
5. **Click** → "Import"

---

### **Step 3: Configure Project** (1 min)

Vercel will auto-detect settings. **Just verify:**

```
Framework Preset: Other
Root Directory: ./
Build Command: npm run build
Output Directory: react-frontend/dist
```

**✅ Everything looks good? Click "Deploy"!**

---

### **Step 4: Wait for Build** (1-2 min)

Watch the deployment logs:
- ✅ Installing dependencies...
- ✅ Building frontend...
- ✅ Building API...
- ✅ Deploying...
- 🎉 **Success!**

---

### **Step 5: Visit Your Site!** 

Your site is now live at:
```
https://your-project-name.vercel.app
```

**Test it:**
- ✅ Open the URL
- ✅ Check Home tab
- ✅ Check Compare tab
- ✅ Check Predictions tab
- ✅ Test search and filters

**🎉 YOU'RE LIVE! Congratulations!**

---

## 💻 **Option 2: Vercel CLI** (3 Minutes)

For developers who love the terminal! 🚀

### **Step 1: Install Vercel CLI** (1 min)

```bash
npm install -g vercel
```

### **Step 2: Login** (30 sec)

```bash
vercel login
```

Follow the prompts in your browser.

### **Step 3: Deploy** (1 min)

```bash
# Navigate to project root
cd C:/Users/harsh/Downloads/json

# Deploy!
vercel
```

**Answer the prompts:**
```
? Set up and deploy "~/json"? [Y/n] y
? Which scope? Your account
? Link to existing project? [y/N] n
? What's your project's name? nirf-portal
? In which directory is your code located? ./
```

**Vercel will:**
- 🔄 Upload files
- 🏗️ Build project
- 🚀 Deploy
- 🌐 Give you a URL!

### **Step 4: Deploy to Production**

```bash
vercel --prod
```

**🎉 Done! Your site is live!**

---

## 🌐 Your Live URLs

After deployment, you have:

### **Frontend (Main Site)**
```
https://your-project.vercel.app
```

### **API Endpoints**
```
https://your-project.vercel.app/api/colleges
https://your-project.vercel.app/api/predictions
https://your-project.vercel.app/api/health
```

### **API Documentation**
```
https://your-project.vercel.app/api/docs
```

---

## ✅ Test Your Deployment

### **1. Test Homepage**
```bash
curl https://your-project.vercel.app
```

### **2. Test API**
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "vercel",
  "csv_data_exists": true,
  "predictions_exists": true
}
```

### **3. Test Colleges Data**
```bash
curl https://your-project.vercel.app/api/colleges | head -20
```

---

## 🎨 What Just Happened?

### **Architecture:**

```
User visits https://your-project.vercel.app
            ↓
    Vercel Edge Network
            ↓
      ┌─────┴─────┐
      ↓           ↓
  /api/* →    /* →
  Python       React
Serverless    Static
 Function     Files
      ↓           ↓
  Returns    Returns
   JSON        HTML
```

### **Your Backend:**
- ✅ FastAPI running as serverless function
- ✅ Handles `/api/*` routes
- ✅ Auto-scales with traffic
- ✅ Reads CSV files

### **Your Frontend:**
- ✅ React app built with Vite
- ✅ Served as static files
- ✅ Global CDN distribution
- ✅ Instant loading

---

## 🔄 Continuous Deployment

Now every time you push to GitHub:
1. Vercel automatically builds
2. Creates a preview URL
3. When merged to `main` → deploys to production!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys! 🚀
```

---

## 📱 Share Your Project

Get your project URL:
```bash
vercel ls
```

Share it:
```
🌐 Check out my NIRF Rankings Portal!
https://your-project.vercel.app

Features:
✅ Browse 9+ years of engineering rankings
✅ Compare colleges side-by-side
✅ ML-powered predictions for 2026
✅ Beautiful modern UI
```

---

## 🎯 Custom Domain (Optional)

Want `nirf.yourdomain.com`?

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains
2. **Add Domain** → Enter your domain
3. **Configure DNS** → Follow Vercel's instructions
4. **Wait for SSL** → Usually takes 1-2 minutes
5. **Done!** → Your site is now at your custom domain

---

## 📊 Monitor Your Site

### **Vercel Dashboard**
- View deployment logs
- Check function performance
- Monitor bandwidth usage
- See error rates

### **Analytics** (Optional)
Enable Vercel Analytics for free:
1. Dashboard → Your Project → Analytics
2. Enable Analytics
3. See visitor stats, performance metrics

---

## ⚙️ Environment Variables (If Needed Later)

To add environment variables:

1. **Dashboard** → Your Project → Settings → Environment Variables
2. **Add Variable:**
   - Name: `DATABASE_URL`
   - Value: `your_database_url`
   - Environment: Production
3. **Redeploy** → Changes take effect

---

## 🚨 Troubleshooting

### **Issue: Build Failed**

**Check build logs in Vercel dashboard**

Common fixes:
```bash
# Test build locally first
cd react-frontend
npm install
npm run build
```

---

### **Issue: API Returns 404**

**Check:**
- ✅ File exists: `api/index.py`
- ✅ URL starts with `/api/`
- ✅ `vercel.json` is configured

**Test locally:**
```bash
cd api
python -m uvicorn index:app --reload
```

---

### **Issue: No Data Showing**

**Check CSV files are committed:**
```bash
git add csv_data/nirf_combined_data.csv
git add nirf_predictions_2025.csv
git commit -m "Add data files"
git push
```

---

## 💰 Pricing

### **Free Tier (Hobby)**
- ✅ Unlimited projects
- ✅ 100 GB bandwidth/month
- ✅ 100 hours serverless/month
- ✅ SSL certificates
- ✅ Perfect for your project!

**Your project uses ~1-2 GB/month**
**You have plenty of free quota!** 🎉

---

## 🎉 Congratulations!

You've successfully deployed your full-stack project to Vercel!

### **What You've Achieved:**
- ✅ FastAPI backend (serverless)
- ✅ React frontend (CDN)
- ✅ Automatic SSL
- ✅ Global distribution
- ✅ Continuous deployment
- ✅ Zero server management

### **Next Steps:**
- 📱 Share your link on LinkedIn/Twitter
- 🎨 Add it to your portfolio
- 📊 Monitor performance
- 🚀 Keep building!

---

## 📚 Resources

- **Your Dashboard**: https://vercel.com/dashboard
- **Documentation**: https://vercel.com/docs
- **Support**: https://vercel.com/support
- **Status**: https://vercel-status.com

---

## 🆘 Need Help?

**Check deployment logs:**
1. Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. View Function Logs

**Test API directly:**
```bash
curl https://your-project.vercel.app/api/health
```

**Re-deploy:**
```bash
vercel --prod
```

---

**🎊 You're now a Vercel pro! Happy coding!**

Made with ❤️ by you | Deployed with 🚀 by Vercel

