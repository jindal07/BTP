# 🎓 NIRF Rankings Portal

A modern full-stack web application for viewing, comparing, and predicting NIRF Engineering College Rankings.

## 🚀 Quick Deploy to Vercel

This project is optimized for **Vercel deployment** with both frontend and backend on the same platform!

### **Deploy in 5 Minutes:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. **Done!** Your site will be live at `https://your-project.vercel.app`


---

## 📁 Project Structure

```
json/
├── api/                          # 🔧 Backend (FastAPI Serverless)
│   ├── index.py                 # API endpoints
│   └── requirements.txt         # Python dependencies
│
├── react-frontend/              # ⚛️ Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── config/              # API configuration
│   │   └── index.css            # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── csv_data/                    # 📊 Data
│   └── nirf_combined_data.csv   # Historical rankings (2017-2025)
│
├── nirf_predictions_2025.csv    # 🔮 ML Predictions
├── vercel.json                  # ⚙️ Vercel Config
└── package.json                 # 📦 Build Config
```

---

## ✨ Features

- **🏠 Browse** - View all colleges with filters and search
- **⚖️ Compare** - Compare up to 3 colleges side-by-side
- **🔮 Predictions** - ML-powered 2026 ranking predictions
- **📊 Visualizations** - Interactive charts and graphs
- **🎨 Modern UI** - Beautiful design with custom color palette
- **📱 Responsive** - Works on all devices

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **Pandas** - Data processing
- **Scikit-learn** - ML predictions
- **Vercel Serverless** - Hosting

---

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+

### Setup

1. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd json
   ```

2. **Install frontend dependencies**
   ```bash
   cd react-frontend
   npm install
   ```

3. **Start development servers**

   **Terminal 1: Backend**
   ```bash
   cd api
   pip install -r requirements.txt
   uvicorn index:app --reload --port 8000
   ```

   **Terminal 2: Frontend**
   ```bash
   cd react-frontend
   npm run dev
   ```

4. **Open browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## 🌐 Deployment

### **Vercel (Recommended)**

**Automatic Deployment:**
1. Connect your GitHub repository to Vercel
2. Every push to `main` automatically deploys
3. Preview deployments for all branches


---

## 🎨 Custom Features

### Color Palette
- **Camel** (#b5804a) - Primary actions
- **Toffee Brown** (#a17c5e) - Secondary accents
- **Silver** (#8e7d71) - Backgrounds
- **Graphite** (#857a7c) - Text

### Font
- **Exo 2** - Modern, professional typography from Google Fonts

### Components
- Glassmorphism effects
- Smooth animations
- Accessible UI
- Dark mode ready

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/api/health` | GET | Health check |
| `/api/colleges` | GET | Get all colleges |
| `/api/predictions` | GET | Get predictions |
| `/api/admin/upload` | POST | Upload CSV |

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Feel free to use for your projects!

---

## 🙏 Acknowledgments

- **NIRF** - Official rankings data
- **React Team** - Amazing framework
- **Vercel** - Deployment platform
- **Tailwind CSS** - Styling framework

---


---

**Made with ❤️**


# BTP
