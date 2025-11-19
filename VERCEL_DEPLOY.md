# 🚀 Deploy Complete Project to Vercel

Deploy both frontend (React) and backend (FastAPI) to Vercel in one go!

---

## 📋 What's Been Set Up

I've configured your project for Vercel's serverless architecture:

```
Your Project/
├── api/
│   ├── index.py           # FastAPI backend as serverless function
│   └── requirements.txt   # Python dependencies for API
├── react-frontend/        # React frontend
│   ├── src/
│   ├── dist/             # Built files (generated)
│   └── package.json
├── csv_data/             # Your data files
│   └── nirf_combined_data.csv
├── nirf_predictions_2025.csv
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
└── .vercelignore         # Files to ignore
```

---

## 🚀 Deploy to Vercel (5 Minutes)

### **Method 1: Using Vercel Dashboard (Easiest)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure (Auto-detected)**
   - Framework Preset: Other
   - Root Directory: `./` (leave as root)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `react-frontend/dist` (auto-detected)

4. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live! 🎉

---

### **Method 2: Using Vercel CLI (Faster)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # From project root (json/)
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - What's your project's name? **nirf-portal** (or your choice)
   - In which directory is your code located? **./** (root)

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

---

## 🌐 After Deployment

Your app will be live at:
```
https://your-project.vercel.app
```

### **Test Your Deployment:**

1. **Frontend**: `https://your-project.vercel.app`
2. **Backend API**: `https://your-project.vercel.app/api/colleges`
3. **API Health**: `https://your-project.vercel.app/api/health`
4. **API Docs**: `https://your-project.vercel.app/api/docs`

---

## 📁 How It Works

### **Architecture on Vercel:**

```
User Request
    ↓
Vercel Edge Network
    ↓
    ├─→ /api/* → Python Serverless Function (FastAPI)
    └─→ /*     → Static React Build (Vite)
```

### **Routes:**
- `/api/colleges` → FastAPI serverless function
- `/api/predictions` → FastAPI serverless function
- `/api/admin/upload` → FastAPI serverless function
- `/` → React frontend (static)
- `/compare` → React frontend (static)
- `/predictions` → React frontend (static)

---

## ⚙️ Configuration Explained

### **vercel.json**
```json
{
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"           // Python runtime for API
    },
    {
      "src": "react-frontend/package.json",
      "use": "@vercel/static-build"    // Static build for React
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "api/index.py" },    // API routes
    { "src": "/(.*)", "dest": "react-frontend/dist/$1" } // Frontend routes
  ]
}
```

### **api/index.py**
- FastAPI app adapted for Vercel serverless
- Handles all `/api/*` endpoints
- Reads CSV files from project root
- Auto-scales based on traffic

---

## 🔧 Local Development

### **Test Locally Before Deploying:**

```bash
# Terminal 1: Start FastAPI backend
cd api
python -m uvicorn index:app --reload --port 8000

# Terminal 2: Start React frontend
cd react-frontend
npm run dev
```

Access at: `http://localhost:3000`

---

## 📊 Environment Variables (Optional)

If you need environment variables:

1. **In Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add variables:
     - `ENVIRONMENT=production`
     - `DATABASE_URL=...` (if using database)

2. **In Code:**
   ```python
   import os
   env = os.getenv("ENVIRONMENT", "development")
   ```

---

## ⚠️ Important Notes

### **File Storage Limitation**
On Vercel, the filesystem is **read-only** except `/tmp`:
- Your CSV files work fine (read-only)
- File uploads save to `/tmp` (temporary)
- For permanent storage, use a database:
  - [Vercel Postgres](https://vercel.com/storage/postgres)
  - [Supabase](https://supabase.com)
  - [MongoDB Atlas](https://www.mongodb.com/atlas)

### **Serverless Function Limits**
- **Max execution**: 10 seconds (Hobby), 60 seconds (Pro)
- **Max size**: 50MB per function
- **Cold starts**: First request may be slower

Your current setup is well within these limits! ✅

---

## 🎯 Troubleshooting

### **Issue: Build fails**

**Check:**
```bash
# Test build locally
cd react-frontend
npm install
npm run build
```

**Solution:** Ensure all dependencies are in `package.json`

---

### **Issue: API returns 404**

**Check:**
- API endpoint exists in `api/index.py`
- Route is configured in `vercel.json`
- URL starts with `/api/`

**Test:**
```bash
curl https://your-app.vercel.app/api/health
```

---

### **Issue: CORS errors**

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

### **Issue: CSV files not found**

**Check paths in `api/index.py`:**
```python
BASE_DIR = Path(__file__).resolve().parent.parent
CSV_DATA_DIR = BASE_DIR / "csv_data"
```

**Ensure files are committed:**
```bash
git add csv_data/nirf_combined_data.csv
git add nirf_predictions_2025.csv
git commit -m "Add data files"
```

---

## 📈 Performance Optimization

### **Frontend:**
- ✅ Vite build optimization (automatic)
- ✅ Static file caching on Vercel CDN
- ✅ Gzip compression (automatic)

### **Backend:**
- ✅ Serverless functions (auto-scale)
- ✅ Edge network (low latency)
- ✅ Pandas caching (keep-alive)

---

## 🔄 Continuous Deployment

Once set up, every Git push triggers:
1. Automatic build
2. Run tests (if configured)
3. Deploy to preview URL
4. Merge to `main` → Deploy to production

### **Preview Deployments:**
- Every branch/PR gets a unique URL
- Test before merging to production
- Example: `https://your-app-git-feature.vercel.app`

---

## 💰 Pricing

### **Vercel Hobby (Free)**
- Unlimited projects
- 100 GB bandwidth/month
- 100 hours serverless execution/month
- SSL included
- Perfect for your project! ✅

### **Vercel Pro ($20/month)**
- 1 TB bandwidth
- 1000 hours serverless execution
- Team collaboration
- Priority support

---

## 📚 Vercel Resources

- **Dashboard**: https://vercel.com/dashboard
- **Docs**: https://vercel.com/docs
- **Python on Vercel**: https://vercel.com/docs/functions/serverless-functions/runtimes/python
- **Support**: https://vercel.com/support

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] `vercel.json` configured
- [ ] `api/index.py` created
- [ ] CSV files committed
- [ ] React build works locally (`npm run build`)
- [ ] Python requirements specified

After deploying:
- [ ] Frontend loads
- [ ] API responds (`/api/health`)
- [ ] Colleges data displays
- [ ] Charts render
- [ ] Search/filters work
- [ ] Mobile responsive

---

## 🎉 Success!

Your complete NIRF Rankings Portal is now live on Vercel!

**Share your link:**
```
🌐 https://your-project.vercel.app
```

---

## 🚀 Next Steps

1. **Custom Domain** (Optional)
   - Go to Vercel Dashboard → Domains
   - Add your custom domain
   - Configure DNS

2. **Analytics**
   - Enable Vercel Analytics (free)
   - Track visitors and performance

3. **Monitoring**
   - Check function logs in dashboard
   - Monitor errors and performance

---

**Need Help?**
- Check [Vercel Documentation](https://vercel.com/docs)
- Review deployment logs in dashboard
- Test API endpoints directly

**Happy Deploying! 🎊**

