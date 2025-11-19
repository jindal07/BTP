# 🎓 NIRF Rankings Portal - React Frontend

Modern React frontend for the NIRF Engineering College Rankings Portal, built with Vite and Tailwind CSS.

## 🚀 Features

- **Modern UI**: Built with React 18 and Tailwind CSS
- **Fast Development**: Powered by Vite with HMR
- **Responsive Design**: Works on all devices
- **Custom Color Palette**: Professional earthy tones (Camel, Toffee Brown, Silver, Graphite)
- **Google Fonts**: Uses Exo 2 font family
- **Interactive Components**: College cards, modal, comparison, predictions, admin panel

## 📦 Tech Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization
- **Lucide React**: Icon library

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌍 Environment Variables

Create a `.env` file for development or `.env.production` for production:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Production
# VITE_API_URL=https://your-backend.railway.app
```

## 📁 Project Structure

```
react-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── AdminTab.jsx
│   │   ├── CollegeCard.jsx
│   │   ├── CollegeModal.jsx
│   │   ├── CompareTab.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Header.jsx
│   │   ├── HomeTab.jsx
│   │   ├── Loader.jsx
│   │   ├── PredictionsTab.jsx
│   │   └── TabNavigation.jsx
│   ├── config/          # Configuration
│   │   └── api.js       # API configuration
│   ├── hooks/           # Custom React hooks
│   │   ├── useColleges.js
│   │   └── usePredictions.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── vercel.json          # Vercel deployment config
```

## 🎨 Custom Color Palette

The app uses a professional earthy color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| **Dim Grey** | `#8b8274` | Text, borders |
| **Silver** | `#8e7d71` | Backgrounds, surfaces |
| **Toffee Brown** | `#a17c5e` | Accents, buttons |
| **Camel** | `#b5804a` | Primary actions, highlights |
| **Graphite** | `#857a7c` | Dark text, headers |

## 📱 Components

### HomeTab
- Displays all colleges in card format
- Filter by state, year
- Sort by rank, score, name
- Search functionality
- Click cards to view details

### CollegeModal
- Detailed college information
- Historical data table
- Rank/score progression chart
- Parameter trends chart

### CompareTab
- Compare up to 3 colleges
- Side-by-side comparison table
- Radar chart for parameters
- Trend charts for scores

### PredictionsTab
- View predicted 2026 rankings
- Search and filter
- Change indicators (up/down arrows)
- Rank badges (gold for top 10)
- Confidence levels

### AdminTab
- Backend status indicator
- CSV file upload
- Data validation
- Upload instructions

## 🔌 API Integration

The frontend connects to the FastAPI backend via:

```javascript
import { getApiUrl } from './config/api'

// In development: uses Vite proxy (/api/*)
// In production: uses VITE_API_URL env variable

const response = await fetch(getApiUrl('/api/colleges'))
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository to Vercel
3. Set root directory: `react-frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.com`
5. Deploy!

### Netlify

1. Connect GitHub repository
2. Set base directory: `react-frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL`

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```

## 🧪 Development

### Run with Backend

```bash
# Terminal 1: Start backend
cd ..
python backend.py

# Terminal 2: Start frontend
cd react-frontend
npm run dev
```

Access at: http://localhost:3000

### Proxy Configuration

Vite automatically proxies `/api/*` requests to `http://localhost:8000` in development:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

## 🎯 Features Checklist

- ✅ Modern React architecture
- ✅ Tailwind CSS styling
- ✅ Custom color palette
- ✅ Google Fonts (Exo 2)
- ✅ Responsive design
- ✅ Fast Vite dev server
- ✅ Chart.js visualizations
- ✅ Search and filters
- ✅ Comparison tool
- ✅ Predictions view
- ✅ Admin panel
- ✅ Production-ready build
- ✅ Environment variable support

## 📄 License

MIT

## 👤 Author

NIRF Rankings Portal Team

---

**Made with ❤️ using React + Vite + Tailwind CSS**
