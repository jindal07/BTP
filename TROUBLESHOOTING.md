# 🔧 Deployment Troubleshooting Guide

## What Error Are You Seeing?

### 1️⃣ "Function Runtimes must have a valid version"
**Solution:** This is now fixed with `@vercel/python` in `vercel.json`

---

### 2️⃣ "No Output Directory named 'dist' found"
**Solution:**
```bash
# Build locally first
cd react-frontend
npm install
npm run build
cd ..

# Commit the dist directory (temporarily)
git add react-frontend/dist -f
git commit -m "Add dist for deployment test"
git push
```

---

### 3️⃣ "Build Command Failed"
**Check Build Logs:**
- Look for npm errors
- Check Node.js version compatibility

**Fix:**
Add to `package.json`:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

---

### 4️⃣ "Python Function Too Large"
**Solution:** Create `api/.vercelignore`:
```
__pycache__/
*.pyc
.pytest_cache/
```

---

### 5️⃣ "Module Not Found" (Python)
**Check:** `api/requirements.txt` exists and has:
```
fastapi
pandas
numpy
scikit-learn
python-multipart
```

---

### 6️⃣ "Cannot Find Module" (Node)
**Solution:**
```bash
cd react-frontend
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock"
git push
```

---

## 🧪 Test Deployment Locally with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Test deployment (development)
vercel

# If works, deploy to production
vercel --prod
```

---

## 📋 Pre-Deployment Checklist

Run these commands before deploying:

```bash
# 1. Check files exist
echo "Checking required files..."
test -f vercel.json && echo "✅ vercel.json" || echo "❌ vercel.json missing"
test -f api/index.py && echo "✅ api/index.py" || echo "❌ api/index.py missing"
test -f api/requirements.txt && echo "✅ api/requirements.txt" || echo "❌ api/requirements.txt missing"
test -f package.json && echo "✅ package.json" || echo "❌ package.json missing"

# 2. Test frontend build
echo ""
echo "Testing frontend build..."
cd react-frontend && npm install && npm run build
if [ -d "dist" ]; then
  echo "✅ Frontend builds successfully"
  ls -lh dist/
else
  echo "❌ Frontend build failed"
fi
cd ..

# 3. Check data files
echo ""
echo "Checking data files..."
test -f csv_data/nirf_combined_data.csv && echo "✅ CSV data" || echo "❌ CSV data missing"
test -f nirf_predictions_2025.csv && echo "✅ Predictions" || echo "❌ Predictions missing"

echo ""
echo "All checks complete!"
```

---

## 🎯 Common Issues & Solutions

### Issue: "ENOENT: no such file or directory"
**Cause:** Missing files or wrong paths
**Fix:** Verify all paths in `vercel.json` and `package.json`

### Issue: "Build exceeded maximum duration"
**Cause:** Build takes too long
**Fix:** 
- Optimize dependencies
- Use `npm ci` instead of `npm install`
- Cache node_modules

### Issue: "Function size exceeds limit"
**Cause:** Too many dependencies or large data files
**Fix:**
- Minimize Python dependencies
- Compress CSV files
- Use external storage for large files

### Issue: "Import Error in Python"
**Cause:** Missing dependency or wrong Python version
**Fix:**
- Check `api/requirements.txt`
- Test locally: `cd api && pip install -r requirements.txt`
- Ensure all imports are in requirements.txt

---

## 🔍 View Deployment Logs

### In Vercel Dashboard:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. View:
   - **Build Logs** - Frontend build process
   - **Function Logs** - Python API logs
   - **Static Files** - Deployed files

### Using CLI:
```bash
# View logs
vercel logs

# View specific deployment
vercel logs [deployment-url]
```

---

## 🚀 Alternative: Deploy via CLI

If dashboard deployment fails, try CLI:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Link project (first time only)
vercel link

# 4. Deploy to production
vercel --prod

# Follow prompts and check output
```

---

## 📞 Get Help

**Copy the error message and share:**
1. Full error text
2. Build logs
3. Function logs (if API error)

**Check Vercel Status:**
- [status.vercel.com](https://status.vercel.com)

**Vercel Support:**
- [vercel.com/support](https://vercel.com/support)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## ✅ Quick Fix Commands

```bash
# Reset everything and redeploy
git add .
git commit -m "Fix deployment configuration"
git push origin main

# Or force new deployment
vercel --prod --force
```

---

## 🎯 What Should Work

With current configuration:
- ✅ `vercel.json` uses `@vercel/python`
- ✅ `package.json` has build script
- ✅ Frontend builds locally
- ✅ API exists at `api/index.py`
- ✅ Dependencies defined in `api/requirements.txt`
- ✅ Data files present

**This should deploy successfully!**

---

## 📨 Share Error Details

Please provide:
1. **Error message** (exact text)
2. **Where** (dashboard or CLI)
3. **When** (which step: build, deploy, runtime)
4. **Logs** (build or function logs)

Then I can help fix the specific issue! 🔧

