// ==============================================
// NIRF RANKINGS PORTAL - BACKEND INTEGRATION
// ==============================================
/*
 * This application is designed to work with a FastAPI backend that serves
 * college rankings data from CSV files.
 * 
 * BACKEND SETUP REQUIRED:
 * 
 * 1. FastAPI Backend Endpoints:
 *    - GET /api/colleges
 *      Returns: JSON array of colleges with all year-wise data
 *      Source: nirf_combined_data.csv
 *      
 *    - GET /api/predictions
 *      Returns: JSON array of predicted rankings
 *      Source: nirf_predictions_2025.csv (from ML pipeline)
 *      
 *    - POST /api/admin/upload
 *      Accepts: multipart/form-data with CSV file
 *      Process: Saves CSV, runs data ingestion, triggers ML predictions
 *      Returns: Success/error response
 * 
 * 2. Expected Data Format:
 *    Colleges endpoint should return data matching your CSV structure:
 *    [{
 *      "Institute ID": "IR-O-E-U-0492",
 *      "Name": "Indian Institute of Technology Madras",
 *      "Rank_2017": 1, "Rank_2018": 1, ..., "Rank_2025": 1,
 *      "Score_2017": 83.45, ..., "Score_2025": 91.17,
 *      "TLR (100)_2017": 87.89, ...,
 *      "RPC (100)_2017": 82.91, ...,
 *      (... all parameters for all years)
 *    }]
 * 
 * 3. CORS Configuration:
 *    Enable CORS on your FastAPI backend:
 *    ```python
 *    from fastapi.middleware.cors import CORSMiddleware
 *    app.add_middleware(
 *        CORSMiddleware,
 *        allow_origins=["*"],
 *        allow_methods=["*"],
 *        allow_headers=["*"],
 *    )
 *    ```
 * 
 * 4. To Enable Backend:
 *    - Set USE_SAMPLE_DATA to false in CONFIG below
 *    - Update API_BASE_URL to your backend URL
 *    - Ensure backend is running and accessible
 * 
 * 5. Demo Mode:
 *    - When USE_SAMPLE_DATA is true, uses hardcoded sample data
 *    - Shows warning messages about demo mode
 *    - Upload functionality shows demo message
 */

// ==============================================
// BACKEND CONFIGURATION
// ==============================================
const CONFIG = {
  // Backend API base URL - Automatically use current origin for backend
  API_BASE_URL: window.location.origin,
  
  // Always use backend data, not sample data
  USE_SAMPLE_DATA: false
};

// ==============================================
// DATA LOADING FUNCTIONS
// ==============================================

// Load colleges data from backend API
async function loadCollegesData() {
  try {
    showLoadingMessage('Loading colleges data from backend...');
    console.log('Fetching from:', `${CONFIG.API_BASE_URL}/api/colleges`);
    
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/colleges`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    console.log('Raw data received:', rawData.length, 'colleges');
    
    hideLoadingMessage();
    
    // Transform CSV data to app format
    const transformed = transformCSVData(rawData);
    console.log('Transformed data:', transformed.length, 'colleges');
    
    return transformed;
  } catch (error) {
    console.error('Error loading colleges data:', error);
    showErrorMessage('Failed to load data from backend. Please upload CSV file in Admin tab.');
    hideLoadingMessage();
    return [];
  }
}

// Load predictions data from backend API
async function loadPredictionsData() {
  try {
    console.log('Fetching predictions from:', `${CONFIG.API_BASE_URL}/api/predictions`);
    
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/predictions`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    console.log('Predictions loaded:', rawData.length, 'predictions');
    
    return transformPredictionsData(rawData);
  } catch (error) {
    console.error('Error loading predictions data:', error);
    showErrorMessage('Failed to load predictions from backend.');
    return [];
  }
}

// Transform CSV data format to app format
function transformCSVData(csvData) {
  return csvData.map(row => {
    const college = {
      id: row['Institute ID'] || row['id'] || 'N/A',
      name: row['Name'] || row['name'] || 'Unknown College',
      ranks: {},
      scores: {},
      parameters: {
        tlr: {},
        rpc: {},
        go: {},
        oi: {},
        perception: {}
      }

    };
    
    // Extract ALL years (2017-2025) with proper null checking
    for (let year = 2017; year <= 2025; year++) {
      // Ranks
      const rankVal = row[`Rank_${year}`];
      if (rankVal !== null && rankVal !== undefined && rankVal !== '') {
        college.ranks[year] = parseFloat(rankVal);
      }
      
      // Scores
      const scoreVal = row[`Score_${year}`];
      if (scoreVal !== null && scoreVal !== undefined && scoreVal !== '') {
        college.scores[year] = parseFloat(scoreVal);
      }
      
      // Parameters with null checks
      const tlrVal = row[`TLR (100)_${year}`];
      if (tlrVal !== null && tlrVal !== undefined && tlrVal !== '') {
        college.parameters.tlr[year] = parseFloat(tlrVal);
      }
      
      const rpcVal = row[`RPC (100)_${year}`];
      if (rpcVal !== null && rpcVal !== undefined && rpcVal !== '') {
        college.parameters.rpc[year] = parseFloat(rpcVal);
      }
      
      const goVal = row[`GO (100)_${year}`];
      if (goVal !== null && goVal !== undefined && goVal !== '') {
        college.parameters.go[year] = parseFloat(goVal);
      }
      
      const oiVal = row[`OI (100)_${year}`];
      if (oiVal !== null && oiVal !== undefined && oiVal !== '') {
        college.parameters.oi[year] = parseFloat(oiVal);
      }
      
      const percVal = row[`PERCEPTION (100)_${year}`];
      if (percVal !== null && percVal !== undefined && percVal !== '') {
        college.parameters.perception[year] = parseFloat(percVal);
      }
    }
        // Copy all CSV columns to college object for sub-parameters
    Object.keys(row).forEach(key => { if (key.includes('_')) college[key] = row[key]; });
    
    return college;
  });
}

// Transform predictions CSV data
function transformPredictionsData(csvData) {
  return csvData.map(row => {
    const predictedRank = row['Predicted_Rank_2026'] || row['Predicted_Rank_2025'];
    const predictedScore = row['Predicted_Score_2026'] || row['Predicted_Score_2025'];
    const currentRank = row['Actual_Rank_2025'] || row['Current_Rank_2025'];
    
    return {
      college: row['College'] || row['Name'] || 'Unknown',
      predicted_rank: parseFloat(predictedRank) || 0,
      predicted_score: parseFloat(predictedScore) || 0,
      current_rank_2025: parseFloat(currentRank) || 0,
      change: (parseFloat(currentRank) || 0) - (parseFloat(predictedRank) || 0)
    };
  });
}

// Helper functions for UI messages
function showLoadingMessage(message) {
  const statusDiv = document.createElement('div');
  statusDiv.id = 'loading-status';
  statusDiv.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: rgba(102, 126, 234, 0.9); color: white; padding: 1rem 2rem; border-radius: 8px; z-index: 1000; font-weight: 500;';
  statusDiv.textContent = message;
  document.body.appendChild(statusDiv);
}

function hideLoadingMessage() {
  const statusDiv = document.getElementById('loading-status');
  if (statusDiv) statusDiv.remove();
}

function showErrorMessage(message) {
  hideLoadingMessage();
  const statusDiv = document.createElement('div');
  statusDiv.id = 'error-status';
  statusDiv.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: rgba(239, 68, 68, 0.9); color: white; padding: 1rem 2rem; border-radius: 8px; z-index: 1000; font-weight: 500;';
  statusDiv.textContent = message;
  document.body.appendChild(statusDiv);
  setTimeout(() => statusDiv.remove(), 5000);
}

function showSuccessMessage(message) {
  const statusDiv = document.createElement('div');
  statusDiv.id = 'success-status';
  statusDiv.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: rgba(16, 185, 129, 0.9); color: white; padding: 1rem 2rem; border-radius: 8px; z-index: 1000; font-weight: 500;';
  statusDiv.textContent = message;
  document.body.appendChild(statusDiv);
  setTimeout(() => statusDiv.remove(), 3000);
}

// ==============================================
// SAMPLE DATA (Fallback)
// ==============================================
function getSampleCollegesData() {
  return [
  {
    id: 'IR-O-E-U-0492',
    name: 'Indian Institute of Technology Madras',
    ranks: { 2025: 1, 2024: 1, 2023: 1, 2022: 1, 2021: 1, 2020: 1, 2019: 1, 2018: 1, 2017: 1 },
    scores: { 2025: 91.17, 2024: 90.38, 2023: 89.93, 2022: 88.54, 2021: 87.35, 2020: 86.12, 2019: 85.67, 2018: 84.23, 2017: 83.45 },
    parameters: {
      tlr: { 2025: 95.42, 2024: 94.23, 2023: 93.87, 2022: 92.45, 2021: 91.23, 2020: 90.12, 2019: 89.45, 2018: 88.67, 2017: 87.89 },
      rpc: { 2025: 89.34, 2024: 88.91, 2023: 88.12, 2022: 87.34, 2021: 86.78, 2020: 85.67, 2019: 84.91, 2018: 83.78, 2017: 82.91 },
      go: { 2025: 90.78, 2024: 89.45, 2023: 88.92, 2022: 88.01, 2021: 87.12, 2020: 86.23, 2019: 85.34, 2018: 84.12, 2017: 83.45 },
      oi: { 2025: 85.12, 2024: 84.67, 2023: 83.45, 2022: 82.91, 2021: 82.34, 2020: 81.45, 2019: 80.67, 2018: 79.91, 2017: 78.67 },
      perception: { 2025: 100, 2024: 100, 2023: 100, 2022: 98.76, 2021: 97.89, 2020: 96.78, 2019: 95.89, 2018: 94.56, 2017: 93.23 }
    }
  },
  {
    id: 'IR-O-E-U-0146',
    name: 'Indian Institute of Technology Delhi',
    ranks: { 2025: 2, 2024: 2, 2023: 2, 2022: 2, 2021: 3 },
    scores: { 2025: 88.96, 2024: 87.34, 2023: 86.78, 2022: 85.92, 2021: 84.56 },
    parameters: {
      tlr: { 2025: 92.34, 2024: 91.23, 2023: 90.56, 2022: 89.78, 2021: 88.45 },
      rpc: { 2025: 87.65, 2024: 86.89, 2023: 85.91, 2022: 84.76, 2021: 83.92 },
      go: { 2025: 88.91, 2024: 87.56, 2023: 86.34, 2022: 85.67, 2021: 84.23 },
      oi: { 2025: 83.45, 2024: 82.91, 2023: 81.78, 2022: 80.92, 2021: 79.87 },
      perception: { 2025: 97.23, 2024: 96.78, 2023: 95.89, 2022: 94.56, 2021: 93.45 }
    }
  },
  {
    id: 'IR-O-E-U-0235',
    name: 'Indian Institute of Technology Bombay',
    ranks: { 2025: 3, 2024: 3, 2023: 3, 2022: 3, 2021: 2 },
    scores: { 2025: 87.54, 2024: 86.78, 2023: 85.91, 2022: 84.87, 2021: 85.12 },
    parameters: {
      tlr: { 2025: 91.23, 2024: 90.34, 2023: 89.67, 2022: 88.91, 2021: 88.12 },
      rpc: { 2025: 86.78, 2024: 85.92, 2023: 84.87, 2022: 83.91, 2021: 84.23 },
      go: { 2025: 87.65, 2024: 86.45, 2023: 85.23, 2022: 84.56, 2021: 84.91 },
      oi: { 2025: 82.34, 2024: 81.67, 2023: 80.91, 2022: 79.87, 2021: 80.12 },
      perception: { 2025: 96.45, 2024: 95.67, 2023: 94.78, 2022: 93.45, 2021: 93.89 }
    }
  },
  {
    id: 'IR-O-E-U-0789',
    name: 'Indian Institute of Technology Kanpur',
    ranks: { 2025: 4, 2024: 4, 2023: 4, 2022: 4, 2021: 4 },
    scores: { 2025: 85.34, 2024: 84.56, 2023: 83.78, 2022: 82.91, 2021: 81.67 },
    parameters: {
      tlr: { 2025: 89.45, 2024: 88.67, 2023: 87.91, 2022: 87.12, 2021: 86.34 },
      rpc: { 2025: 84.56, 2024: 83.78, 2023: 82.91, 2022: 81.87, 2021: 80.91 },
      go: { 2025: 85.91, 2024: 84.92, 2023: 83.87, 2022: 82.76, 2021: 81.56 },
      oi: { 2025: 80.23, 2024: 79.45, 2023: 78.67, 2022: 77.91, 2021: 76.87 },
      perception: { 2025: 93.78, 2024: 92.91, 2023: 91.87, 2022: 90.56, 2021: 89.45 }
    }
  },
  {
    id: 'IR-O-E-U-0421',
    name: 'Indian Institute of Technology Kharagpur',
    ranks: { 2025: 5, 2024: 5, 2023: 5, 2022: 5, 2021: 5 },
    scores: { 2025: 83.67, 2024: 82.91, 2023: 81.87, 2022: 80.76, 2021: 79.45 },
    parameters: {
      tlr: { 2025: 87.91, 2024: 87.12, 2023: 86.34, 2022: 85.45, 2021: 84.23 },
      rpc: { 2025: 82.78, 2024: 81.91, 2023: 80.87, 2022: 79.76, 2021: 78.56 },
      go: { 2025: 84.23, 2024: 83.34, 2023: 82.45, 2022: 81.23, 2021: 79.91 },
      oi: { 2025: 78.91, 2024: 78.12, 2023: 77.23, 2022: 76.34, 2021: 75.12 },
      perception: { 2025: 91.45, 2024: 90.56, 2023: 89.34, 2022: 88.12, 2021: 86.78 }
    }
  },
  {
    id: 'IR-O-E-U-0653',
    name: 'Indian Institute of Technology Roorkee',
    ranks: { 2025: 6, 2024: 6, 2023: 7 },
    scores: { 2025: 81.89, 2024: 80.76, 2023: 79.45 },
    parameters: {
      tlr: { 2025: 86.23, 2024: 85.34, 2023: 84.12 },
      rpc: { 2025: 80.45, 2024: 79.67, 2023: 78.34 },
      go: { 2025: 82.67, 2024: 81.45, 2023: 80.23 },
      oi: { 2025: 76.34, 2024: 75.67, 2023: 74.56 },
      perception: { 2025: 89.67, 2024: 88.45, 2023: 87.23 }
    }
  },
  {
    id: 'IR-O-E-U-0924',
    name: 'Indian Institute of Technology Guwahati',
    ranks: { 2025: 7, 2024: 7, 2023: 6 },
    scores: { 2025: 80.45, 2024: 79.23, 2023: 79.67 },
    parameters: {
      tlr: { 2025: 84.56, 2024: 83.45, 2023: 83.89 },
      rpc: { 2025: 78.91, 2024: 77.67, 2023: 78.12 },
      go: { 2025: 81.23, 2024: 79.91, 2023: 80.45 },
      oi: { 2025: 74.89, 2024: 73.56, 2023: 74.12 },
      perception: { 2025: 88.12, 2024: 86.89, 2023: 87.56 }
    }
  },
  {
    id: 'IR-O-E-U-0118',
    name: 'Indian Institute of Technology Hyderabad',
    ranks: { 2025: 8, 2024: 9, 2023: 8 },
    scores: { 2025: 78.91, 2024: 77.45, 2023: 77.89 },
    parameters: {
      tlr: { 2025: 82.34, 2024: 81.23, 2023: 81.67 },
      rpc: { 2025: 76.78, 2024: 75.34, 2023: 75.89 },
      go: { 2025: 79.56, 2024: 78.12, 2023: 78.67 },
      oi: { 2025: 72.45, 2024: 71.23, 2023: 71.78 },
      perception: { 2025: 85.67, 2024: 84.12, 2023: 84.89 }
    }
  },
  {
    id: 'IR-O-E-U-0337',
    name: 'National Institute of Technology Tiruchirappalli',
    ranks: { 2025: 9, 2024: 8, 2023: 9 },
    scores: { 2025: 77.23, 2024: 77.67, 2023: 76.45 },
    parameters: {
      tlr: { 2025: 80.45, 2024: 80.89, 2023: 79.67 },
      rpc: { 2025: 74.67, 2024: 75.12, 2023: 73.91 },
      go: { 2025: 77.89, 2024: 78.34, 2023: 76.78 },
      oi: { 2025: 70.34, 2024: 70.89, 2023: 69.45 },
      perception: { 2025: 83.45, 2024: 84.23, 2023: 82.34 }
    }
  },
  {
    id: 'IR-O-E-U-0556',
    name: 'Vellore Institute of Technology',
    ranks: { 2025: 10, 2024: 11, 2023: 10 },
    scores: { 2025: 75.67, 2024: 74.89, 2023: 75.12 },
    parameters: {
      tlr: { 2025: 78.91, 2024: 77.67, 2023: 78.23 },
      rpc: { 2025: 72.34, 2024: 71.23, 2023: 71.89 },
      go: { 2025: 76.12, 2024: 74.89, 2023: 75.45 },
      oi: { 2025: 68.45, 2024: 67.34, 2023: 67.91 },
      perception: { 2025: 81.23, 2024: 79.78, 2023: 80.45 }
    }
  }
];
}

function getSamplePredictionsData() {
  return [
  { college: 'Indian Institute of Technology Madras', predicted_rank: 1, predicted_score: 91.85, current_rank_2025: 1, change: 0 },
  { college: 'Indian Institute of Technology Delhi', predicted_rank: 2, predicted_score: 89.42, current_rank_2025: 2, change: 0 },
  { college: 'Indian Institute of Technology Bombay', predicted_rank: 3, predicted_score: 88.12, current_rank_2025: 3, change: 0 },
  { college: 'Indian Institute of Technology Kanpur', predicted_rank: 4, predicted_score: 85.91, current_rank_2025: 4, change: 0 },
  { college: 'Indian Institute of Technology Kharagpur', predicted_rank: 5, predicted_score: 84.23, current_rank_2025: 5, change: 0 },
  { college: 'Indian Institute of Technology Roorkee', predicted_rank: 6, predicted_score: 82.45, current_rank_2025: 6, change: 0 },
  { college: 'Indian Institute of Technology Guwahati', predicted_rank: 7, predicted_score: 81.12, current_rank_2025: 7, change: 0 },
  { college: 'Indian Institute of Technology Hyderabad', predicted_rank: 8, predicted_score: 79.56, current_rank_2025: 8, change: 0 },
  { college: 'National Institute of Technology Tiruchirappalli', predicted_rank: 9, predicted_score: 77.89, current_rank_2025: 9, change: 0 },
  { college: 'Vellore Institute of Technology', predicted_rank: 10, predicted_score: 76.34, current_rank_2025: 10, change: 0 }
];
}

// ==============================================
// APPLICATION STATE
// ==============================================
let collegesData = [];
let predictionsData = [];

// ==============================================
// TOOLTIPS FOR METRICS
// ==============================================
const tooltips = {
  TLR: 'Teaching, Learning & Resources: Measures quality of teaching staff, student-teacher ratio, and infrastructure facilities',
  RPC: 'Research and Professional Practice: Publications, patents, research funding, and academic impact',
  GO: 'Graduation Outcomes: Placement records, median salary, and progression to higher studies',
  OI: 'Outreach and Inclusivity: Regional diversity, women enrollment, and economically disadvantaged students',
  Perception: 'Peer Reputation: Academic standing and recognition among peer institutions'
};

let currentYear = 2025;
let radarChartInstance = null;

// ==============================================
// INITIALIZATION
// ==============================================
async function init() {
  setupEventListeners();
  updateBackendStatus();
  
  // Load data from backend (or use sample data)
  collegesData = await loadCollegesData();
  predictionsData = await loadPredictionsData();
  
  // Render UI
  renderColleges();
  renderPredictions();
document.querySelector('.subparam-close')?.addEventListener('click',closeSubParamPopup);
document.getElementById('subparam-popup')?.addEventListener('click',e=>{if(e.target.id==='subparam-popup')closeSubParamPopup();});


}

// Update backend connection status in admin panel
async function updateBackendStatus() {
  const indicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  
  if (!indicator || !statusText) return;
  
  // Test backend connection
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/colleges`);
    if (response.ok) {
      indicator.className = 'status-indicator connected';
      statusText.textContent = 'Connected to Backend';
    } else {
      throw new Error('Backend not responding');
    }
  } catch (error) {
    indicator.className = 'status-indicator disconnected';
    statusText.textContent = 'Backend Not Connected';
  }
}
// ==============================================
// EVENT LISTENERS
// ==============================================
function setupEventListeners() {
  // Tab Navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetTab = e.target.dataset.tab;
      switchTab(targetTab);
      
      // Update backend status when switching to admin tab
      if (targetTab === 'admin') {
        updateBackendStatus();
      }
    });
  });

  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    filterColleges(e.target.value);
  });

  // Year Filter
  document.getElementById('year-filter').addEventListener('change', (e) => {
    currentYear = parseInt(e.target.value);
    renderColleges();
  });

  // Modal
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  // Compare - new multi-select interface
  setupCompareTab();

  // Predictions Search
  document.getElementById('predictions-search').addEventListener('input', (e) => {
    filterPredictions(e.target.value);
  });

  // Admin Upload
  document.getElementById('browse-btn').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });

  document.getElementById('file-input').addEventListener('change', handleFileUpload);

  document.getElementById('upload-box').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#667eea';
  });

  document.getElementById('upload-box').addEventListener('dragleave', (e) => {
    e.currentTarget.style.borderColor = '';
  });

  document.getElementById('upload-box').addEventListener('drop', (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });
}

// ==============================================
// TAB NAVIGATION
// ==============================================
function switchTab(tabName) {
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

// ==============================================
// HOME TAB - COLLEGE CARDS RENDERING
// ==============================================
function renderColleges() {
  const grid = document.getElementById('colleges-grid');
  
  if (collegesData.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No college data available. Please upload CSV file in Admin tab.</div>';
    return;
  }
  
  // Filter colleges that have data for current year
  const filteredColleges = collegesData.filter(college => 
    college.ranks[currentYear] || college.scores[currentYear]
  );
  
  console.log(`Displaying ${filteredColleges.length} colleges for year ${currentYear}`);
  
  // Sort by rank
  filteredColleges.sort((a, b) => {
    const rankA = a.ranks[currentYear] || 9999;
    const rankB = b.ranks[currentYear] || 9999;
    return rankA - rankB;
  });
  
  // Render ALL colleges (not just first 10)
  grid.innerHTML = '';
  filteredColleges.forEach(college => {
    const card = createCollegeCard(college);
    grid.appendChild(card);
  });
}

function createCollegeCard(college) {
  const card = document.createElement('div');
  card.className = 'college-card';
  
  const rank = college.ranks[currentYear];
  const score = college.scores[currentYear];
  const params = college.parameters;
  
  card.innerHTML = `
    <div class="rank-badge">${rank}</div>
    <h3 class="college-name">${college.name}</h3>
    <div class="metrics-grid">
      <div class="metric">
        <div class="metric-label">Score</div>
        <div class="metric-value">${score.toFixed(2)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">TLR (100)</div>
        <div class="metric-value">${params.tlr[currentYear] ? params.tlr[currentYear].toFixed(2) : 'N/A'}</div>
      </div>
      <div class="metric">
        <div class="metric-label">RPC (100)</div>
        <div class="metric-value">${params.rpc[currentYear] ? params.rpc[currentYear].toFixed(2) : 'N/A'}</div>
      </div>
      <div class="metric">
        <div class="metric-label">GO (100)</div>
        <div class="metric-value">${params.go[currentYear] ? params.go[currentYear].toFixed(2) : 'N/A'}</div>
      </div>
      <div class="metric">
        <div class="metric-label">OI (100)</div>
        <div class="metric-value">${params.oi[currentYear] ? params.oi[currentYear].toFixed(2) : 'N/A'}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Perception (100)</div>
        <div class="metric-value">${params.perception[currentYear] ? params.perception[currentYear].toFixed(2) : 'N/A'}</div>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => openModal(college));
  
  return card;
}

function filterColleges(searchTerm) {
  const cards = document.querySelectorAll('.college-card');
  cards.forEach(card => {
    const name = card.querySelector('.college-name').textContent.toLowerCase();
    if (name.includes(searchTerm.toLowerCase())) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ==============================================
// MODAL - COLLEGE DETAILS
// Note: College details are shown in modal, not in separate tab
// ==============================================
function openModal(college) {
  const modal = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  
  const rank = college.ranks[currentYear];
  const score = college.scores[currentYear];
  const params = college.parameters;
  
  content.innerHTML = `
    <div class="modal-hero">
      <div class="modal-rank-badge">${rank}</div>
      <h2 class="modal-college-name">${college.name}</h2>
      <div class="modal-score">Institute ID: ${college.id}</div>
      <div class="modal-score">Score: ${score.toFixed(2)}</div>
    </div>
    
    <div class="modal-metrics">
      <div class="modal-metric">
        <div class="modal-metric-label">TLR</div>
        <div class="modal-metric-value">${params.tlr[currentYear] ? params.tlr[currentYear].toFixed(2) : 'N/A'}</div>
        <div class="tooltip">${tooltips.TLR}</div>
      </div>
      <div class="modal-metric">
        <div class="modal-metric-label">RPC</div>
        <div class="modal-metric-value">${params.rpc[currentYear] ? params.rpc[currentYear].toFixed(2) : 'N/A'}</div>
        <div class="tooltip">${tooltips.RPC}</div>
      </div>
      <div class="modal-metric">
        <div class="modal-metric-label">GO</div>
        <div class="modal-metric-value">${params.go[currentYear] ? params.go[currentYear].toFixed(2) : 'N/A'}</div>
        <div class="tooltip">${tooltips.GO}</div>
      </div>
      <div class="modal-metric">
        <div class="modal-metric-label">OI</div>
        <div class="modal-metric-value">${params.oi[currentYear] ? params.oi[currentYear].toFixed(2) : 'N/A'}</div>
        <div class="tooltip">${tooltips.OI}</div>
      </div>
      <div class="modal-metric">
        <div class="modal-metric-label">Perception</div>
        <div class="modal-metric-value">${params.perception[currentYear] ? params.perception[currentYear].toFixed(2) : 'N/A'}</div>
        <div class="tooltip">${tooltips.Perception}</div>
      </div>
    </div>
    
    <div class="modal-charts">
      <div class="chart-container">
        <h3>Rank & Score Progression</h3>
        <canvas id="rank-score-chart"></canvas>
      </div>
      <div class="chart-container">
        <h3>Parameters Over Time</h3>
        <canvas id="parameters-chart"></canvas>
      </div>
    </div>
    
    <div class="historical-table">
      <h3>Historical Data</h3>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Rank</th>
            <th>Score</th>
            <th>TLR</th>
            <th>RPC</th>
            <th>GO</th>
            <th>OI</th>
            <th>Perception</th>
          </tr>
        </thead>
        <tbody>
          ${generateHistoricalRows(college)}
        </tbody>
      </table>
    </div>
  `;
  
  modal.classList.add('active');
  
  setTimeout(() => {
    createRankScoreChart(college);
    createParametersChart(college);
  }, 100);
attachSubParamListeners(college);
}

// ============================================== 
// SUB-PARAMETER POPUP FEATURE
// ==============================================

// Sub-parameter mapping
const subParamMapping={tlr:{title:'TLR Sub-Parameters',description:'Teaching, Learning & Resources',params:['SS','FSR','FQE','FRU']},rpc:{title:'RPC Sub-Parameters',description:'Research & Professional Practice',params:['PU','QP','IPR','FPPP']},go:{title:'GO Sub-Parameters',description:'Graduation Outcomes',params:['GPHE','GUE','MS','GPHD']},oi:{title:'OI Sub-Parameters',description:'Outreach & Inclusivity',params:['RD','WD','ESCS','PCS']},perception:{title:'Perception Sub-Parameters',description:'Peer Reputation',params:['PR']}};
function openSubParamPopup(c,k){
  const cfg=subParamMapping[k];
  if(!cfg)return;
  
  document.getElementById('subparam-title').textContent=cfg.title;
  document.getElementById('subparam-description').textContent=cfg.description;
  document.getElementById('subparam-college-name').textContent=c.name;
  
  const tb=document.getElementById('subparam-tbody');
  tb.innerHTML='';
  
  // Full names for sub-parameters
  const fullNames = {
    'SS': 'Student Strength',
    'FSR': 'Faculty-Student Ratio',
    'FQE': 'Faculty with PhD',
    'FRU': 'Financial Resources per Student',
    'PU': 'Publications',
    'QP': 'Quality of Publications',
    'IPR': 'Intellectual Property Rights',
    'FPPP': 'Footprint of Projects and Professional Practice',
    'GPHE': 'Graduates in Higher Education',
    'GUE': 'University Examinations',
    'MS': 'Median Salary',
    'GPHD': 'Graduates pursuing PhD',
    'RD': 'Regional Diversity',
    'WD': 'Women Diversity',
    'ESCS': 'Economically and Socially Challenged Students',
    'PCS': 'Persons with Disabilities',
    'PR': 'Peer Reputation'
  };
  
  cfg.params.forEach(p=>{
    const r=document.createElement('tr');
    let h=`<td><strong>${p}</strong><br><span style="font-size:12px;color:#949494;font-weight:normal">${fullNames[p]||p}</span></td>`;
    [2017,2018,2019,2020,2021,2022,2023,2024,2025].forEach(y=>{
      const v=c[`${p}_${y}`];
      h+=`<td>${v?parseFloat(v).toFixed(2):'N/A'}</td>`;
    });
    r.innerHTML=h;
    tb.appendChild(r);
  });
  
  document.getElementById('subparam-popup').classList.add('active');
  document.body.style.overflow='hidden';
}

function closeSubParamPopup(){document.getElementById('subparam-popup').classList.remove('active');document.body.style.overflow='';}
function attachSubParamListeners(c){setTimeout(()=>{document.querySelectorAll('.modal-metric').forEach(card=>{card.addEventListener('click',()=>{const l=card.querySelector('.modal-metric-label')?.textContent.toLowerCase();let k='';if(l?.includes('tlr'))k='tlr';else if(l?.includes('rpc'))k='rpc';else if(l?.includes('go'))k='go';else if(l?.includes('oi'))k='oi';else if(l?.includes('perception'))k='perception';if(k)openSubParamPopup(c,k);});});},100);}


function generateHistoricalRows(college) {
  // Get all years from ranks and scores combined
  const rankYears = Object.keys(college.ranks || {});
  const scoreYears = Object.keys(college.scores || {});
  const allYears = [...new Set([...rankYears, ...scoreYears])].sort((a, b) => b - a);
  
  console.log(`Generating historical data for ${college.name}:`, allYears.length, 'years');
  
  return allYears.map(year => `
    <tr>
      <td>${year}</td>
      <td>${college.ranks[year] || 'N/A'}</td>
      <td>${college.scores[year] ? college.scores[year].toFixed(2) : 'N/A'}</td>
      <td>${college.parameters.tlr[year] ? college.parameters.tlr[year].toFixed(2) : 'N/A'}</td>
      <td>${college.parameters.rpc[year] ? college.parameters.rpc[year].toFixed(2) : 'N/A'}</td>
      <td>${college.parameters.go[year] ? college.parameters.go[year].toFixed(2) : 'N/A'}</td>
      <td>${college.parameters.oi[year] ? college.parameters.oi[year].toFixed(2) : 'N/A'}</td>
      <td>${college.parameters.perception[year] ? college.parameters.perception[year].toFixed(2) : 'N/A'}</td>
    </tr>
  `).join('');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function createRankScoreChart(college) {
  const ctx = document.getElementById('rank-score-chart');
  if (!ctx) return;
  
  // Get all available years from both ranks and scores
  const rankYears = Object.keys(college.ranks || {});
  const scoreYears = Object.keys(college.scores || {});
  const allYears = [...new Set([...rankYears, ...scoreYears])].sort();
  
  const ranks = allYears.map(year => college.ranks[year] || null);
  const scores = allYears.map(year => college.scores[year] || null);
  
  console.log(`Chart years for ${college.name}:`, allYears);
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: allYears,
      datasets: [
        {
          label: 'Rank',
          data: ranks,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          yAxisID: 'y',
          tension: 0.4
        },
        {
          label: 'Score',
          data: scores,
          borderColor: '#764ba2',
          backgroundColor: 'rgba(118, 75, 162, 0.1)',
          yAxisID: 'y1',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#f9fafb' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' }
        },
        y: {
          type: 'linear',
          position: 'left',
          reverse: true,
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' },
          title: {
            display: true,
            text: 'Rank',
            color: '#9ca3af'
          }
        },
        y1: {
          type: 'linear',
          position: 'right',
          ticks: { color: '#9ca3af' },
          grid: { display: false },
          title: {
            display: true,
            text: 'Score',
            color: '#9ca3af'
          }
        }
      }
    }
  });
}

function createParametersChart(college) {
  const ctx = document.getElementById('parameters-chart');
  if (!ctx) return;
  
  const params = college.parameters;
  
  // Get all years from all parameters
  const tlrYears = Object.keys(params.tlr || {});
  const rpcYears = Object.keys(params.rpc || {});
  const goYears = Object.keys(params.go || {});
  const oiYears = Object.keys(params.oi || {});
  const percYears = Object.keys(params.perception || {});
  const allYears = [...new Set([...tlrYears, ...rpcYears, ...goYears, ...oiYears, ...percYears])].sort();
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: allYears,
      datasets: [
        { label: 'TLR', data: allYears.map(y => params.tlr[y] || null), borderColor: '#1FB8CD', backgroundColor: 'rgba(31, 184, 205, 0.1)', tension: 0.4 },
        { label: 'RPC', data: allYears.map(y => params.rpc[y] || null), borderColor: '#FFC185', backgroundColor: 'rgba(255, 193, 133, 0.1)', tension: 0.4 },
        { label: 'GO', data: allYears.map(y => params.go[y] || null), borderColor: '#B4413C', backgroundColor: 'rgba(180, 65, 60, 0.1)', tension: 0.4 },
        { label: 'OI', data: allYears.map(y => params.oi[y] || null), borderColor: '#5D878F', backgroundColor: 'rgba(93, 135, 143, 0.1)', tension: 0.4 },
        { label: 'Perception', data: allYears.map(y => params.perception[y] || null), borderColor: '#DB4545', backgroundColor: 'rgba(219, 69, 69, 0.1)', tension: 0.4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#f9fafb' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' }
        },
        y: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' }
        }
      }
    }
  });
}

// ==============================================
// COMPARE TAB - NEW MULTI-SELECT INTERFACE
// ==============================================
let selectedCollegesForCompare = [];
const MAX_COLLEGES = 6;
let compareYear = 2025;
let radarCompareChart = null;
let trendCompareChart = null;

// Get sorted college list
function getSortedColleges() {
  return [...collegesData].sort((a, b) => a.name.localeCompare(b.name));
}

// Render selected college chips
function renderCollegeChips() {
  const container = document.getElementById('selected-colleges-chips');
  if (!container) return;
  
  container.innerHTML = selectedCollegesForCompare.map(c => 
    `<span class="college-chip">${c.name}<span class="remove-chip" data-id="${c.id}">×</span></span>`
  ).join('');
  
  // Add click handlers for remove buttons
  container.querySelectorAll('.remove-chip').forEach(btn => {
    btn.onclick = () => {
      selectedCollegesForCompare = selectedCollegesForCompare.filter(c => c.id !== btn.dataset.id);
      renderCollegeChips();
      updateComparison();
    };
  });
}

// Setup compare tab
function setupCompareTab() {
  const searchInput = document.getElementById('college-search');
  const yearSelect = document.getElementById('compare-year-select');
  const paramCheckboxes = document.querySelectorAll('input[name="param"]');
  
  if (!searchInput || !yearSelect) return;
  
  // College search input handler
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const suggestions = getSortedColleges()
      .filter(c => c.name.toLowerCase().includes(searchTerm) && 
                   !selectedCollegesForCompare.find(s => s.id === c.id))
      .slice(0, 10);
    
    const dropdown = document.getElementById('college-suggestions');
    dropdown.innerHTML = suggestions.map(c => 
      `<div class="suggestion-item" data-id="${c.id}">${c.name}</div>`
    ).join('');
    dropdown.style.display = suggestions.length ? 'block' : 'none';
    
    // Add click handlers
    dropdown.querySelectorAll('.suggestion-item').forEach(item => {
      item.onclick = () => {
        if (selectedCollegesForCompare.length < MAX_COLLEGES) {
          const college = collegesData.find(c => c.id === item.dataset.id);
          if (college) {
            selectedCollegesForCompare.push(college);
            e.target.value = '';
            dropdown.style.display = 'none';
            renderCollegeChips();
            updateComparison();
          }
        } else {
          alert(`Maximum ${MAX_COLLEGES} colleges can be selected`);
        }
      };
    });
  });
  
  // Hide dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('college-suggestions');
    if (dropdown && !searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
  
  // Year selector
  yearSelect.addEventListener('change', (e) => {
    compareYear = parseInt(e.target.value);
    updateComparison();
  });
  
  // Parameter checkboxes change handler
  paramCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateComparison);
  });
  
  renderCollegeChips();
  updateComparison();
}

// Update comparison (table + charts)
function updateComparison() {
  const tableContainer = document.getElementById('comparison-table-container');
  if (!tableContainer) return;
  
  if (selectedCollegesForCompare.length === 0) {
    tableContainer.innerHTML = '<p class="no-selection">Select colleges to start comparison</p>';
    if (radarCompareChart) {
      radarCompareChart.destroy();
      radarCompareChart = null;
    }
    if (trendCompareChart) {
      trendCompareChart.destroy();
      trendCompareChart = null;
    }
    return;
  }
  
  // Get selected parameters
  const params = Array.from(document.querySelectorAll('input[name="param"]:checked'))
    .map(cb => cb.value);
  
  // Build comparison table
  let tableHTML = '<table class="comparison-table"><thead><tr><th>Parameter</th>';
  selectedCollegesForCompare.forEach(c => tableHTML += `<th>${c.name}</th>`);
  tableHTML += '</tr></thead><tbody>';
  
  tableHTML += '<tr><td><strong>Rank</strong></td>' + selectedCollegesForCompare.map(c => 
    `<td><strong>${c.ranks[compareYear] || 'N/A'}</strong></td>`).join('') + '</tr>';
  
  tableHTML += '<tr><td><strong>Overall Score</strong></td>' + selectedCollegesForCompare.map(c => 
    `<td><strong>${c.scores[compareYear] ? c.scores[compareYear].toFixed(2) : 'N/A'}</strong></td>`).join('') + '</tr>';
  
  if (params.includes('tlr')) {
    tableHTML += '<tr><td>TLR (100)</td>' + selectedCollegesForCompare.map(c => 
      `<td>${c.parameters.tlr[compareYear] ? c.parameters.tlr[compareYear].toFixed(2) : 'N/A'}</td>`).join('') + '</tr>';
  }
  if (params.includes('rpc')) {
    tableHTML += '<tr><td>RPC (100)</td>' + selectedCollegesForCompare.map(c => 
      `<td>${c.parameters.rpc[compareYear] ? c.parameters.rpc[compareYear].toFixed(2) : 'N/A'}</td>`).join('') + '</tr>';
  }
  if (params.includes('go')) {
    tableHTML += '<tr><td>GO (100)</td>' + selectedCollegesForCompare.map(c => 
      `<td>${c.parameters.go[compareYear] ? c.parameters.go[compareYear].toFixed(2) : 'N/A'}</td>`).join('') + '</tr>';
  }
  if (params.includes('oi')) {
    tableHTML += '<tr><td>OI (100)</td>' + selectedCollegesForCompare.map(c => 
      `<td>${c.parameters.oi[compareYear] ? c.parameters.oi[compareYear].toFixed(2) : 'N/A'}</td>`).join('') + '</tr>';
  }
  if (params.includes('perception')) {
    tableHTML += '<tr><td>Perception (100)</td>' + selectedCollegesForCompare.map(c => 
      `<td>${c.parameters.perception[compareYear] ? c.parameters.perception[compareYear].toFixed(2) : 'N/A'}</td>`).join('') + '</tr>';
  }
  
  tableHTML += '</tbody></table>';
  tableContainer.innerHTML = tableHTML;
  
  // Update charts
  updateRadarComparisonChart(params);
  updateTrendComparisonChart();
}

// Radar chart for parameters
function updateRadarComparisonChart(params) {
  const ctx = document.getElementById('radar-comparison-chart');
  if (!ctx) return;
  
  if (radarCompareChart) {
    radarCompareChart.destroy();
  }
  
  if (selectedCollegesForCompare.length === 0) return;
  
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];
  
  const datasets = selectedCollegesForCompare.map((college, idx) => ({
    label: college.name,
    data: params.map(p => college.parameters[p][compareYear] || 0),
    backgroundColor: colors[idx] + '33',
    borderColor: colors[idx],
    pointBackgroundColor: colors[idx],
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: colors[idx]
  }));
  
  radarCompareChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: params.map(p => p.toUpperCase()),
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#0f172a' }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0' },
          pointLabels: { color: '#0f172a' }
        }
      }
    }
  });
}

// Score trend chart over years
function updateTrendComparisonChart() {
  const ctx = document.getElementById('score-trends-chart');
  if (!ctx) return;
  
  if (trendCompareChart) {
    trendCompareChart.destroy();
  }
  
  if (selectedCollegesForCompare.length === 0) return;
  
  const years = Array.from({length: 9}, (_, i) => 2017 + i);
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];
  
  const datasets = selectedCollegesForCompare.map((college, idx) => ({
    label: college.name,
    data: years.map(year => college.scores[year] || null),
    borderColor: colors[idx],
    backgroundColor: colors[idx] + '33',
    tension: 0.4,
    fill: false
  }));
  
  trendCompareChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#0f172a' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0' }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0' },
          title: {
            display: true,
            text: 'Overall Score',
            color: '#0f172a'
          }
        }
      }
    }
  });
}

// ==============================================
// PREDICTIONS TAB
// ==============================================
function renderPredictions() {
  const tbody = document.getElementById('predictions-tbody');
  tbody.innerHTML = '';
  
  if (predictionsData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No predictions available. Upload CSV to generate predictions.</td></tr>';
    return;
  }
  
  console.log(`Rendering ${predictionsData.length} predictions`);
  
  // Sort by predicted rank
  const sortedPredictions = [...predictionsData].sort((a, b) => 
    (a.predicted_rank || 9999) - (b.predicted_rank || 9999)
  );
  
  sortedPredictions.forEach(pred => {
    const row = document.createElement('tr');
    
    const rankClass = pred.predicted_rank <= 10 ? 'top10' : pred.predicted_rank <= 50 ? 'top50' : 'other';
    
    let changeIcon = '→';
    let changeClass = 'same';
    if (pred.change > 0) {
      changeIcon = '↑';
      changeClass = 'up';
    } else if (pred.change < 0) {
      changeIcon = '↓';
      changeClass = 'down';
    }
    
    row.innerHTML = `
      <td><div class="pred-rank-badge ${rankClass}">${pred.predicted_rank || 'N/A'}</div></td>
      <td>${pred.college}</td>
      <td>${pred.predicted_score ? pred.predicted_score.toFixed(2) : 'N/A'}</td>
      <td>${pred.current_rank_2025 || 'N/A'}</td>
      <td><span class="change-indicator ${changeClass}">${changeIcon} ${pred.change !== 0 ? '(' + Math.abs(pred.change) + ')' : ''}</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

function filterPredictions(searchTerm) {
  const rows = document.querySelectorAll('#predictions-tbody tr');
  rows.forEach(row => {
    const college = row.cells[1].textContent.toLowerCase();
    if (college.includes(searchTerm.toLowerCase())) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// ==============================================
// ADMIN UPLOAD WITH BACKEND INTEGRATION
// ==============================================
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
}

async function handleFile(file) {
  const statusDiv = document.getElementById('upload-status');
  
  if (!file.name.endsWith('.csv')) {
    statusDiv.className = 'upload-status error';
    statusDiv.textContent = 'Error: Please upload a CSV file';
    return;
  }
  
  // Upload to backend
  try {
    statusDiv.textContent = 'Uploading CSV file...';
    statusDiv.className = 'upload-status';
    
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Uploading to:', `${CONFIG.API_BASE_URL}/api/admin/upload`);
    
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/admin/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Upload result:', result);
    
    statusDiv.className = 'upload-status success';
    statusDiv.textContent = `✓ CSV uploaded successfully! ${result.row_count || 'Data'} loaded. Reloading...`;
    
    // CRITICAL: Reload ALL data from backend after upload
    showLoadingMessage('Reloading data from backend...');
    
    collegesData = await loadCollegesData();
    predictionsData = await loadPredictionsData();
    
    hideLoadingMessage();
    
    // Re-render current view
    renderColleges();
    renderPredictions();
    
    // Update backend status
    await updateBackendStatus();
    
    showSuccessMessage(`✓ Data updated! Showing ${collegesData.length} colleges`);
    
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'upload-status';
    }, 3000);
    
  } catch (error) {
    console.error('Upload error:', error);
    statusDiv.className = 'upload-status error';
    statusDiv.textContent = `✗ Upload failed: ${error.message}`;
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {

  console.log('DOM loaded, initializing...');

  init();

  

  // Setup sub-parameter popup close handlers

  const subParamClose = document.querySelector('.subparam-close');

  if (subParamClose) {

    subParamClose.addEventListener('click', closeSubParamPopup);

  }

  

  const subParamPopup = document.getElementById('subparam-popup');

  if (subParamPopup) {

    subParamPopup.addEventListener('click', (e) => {

      if (e.target.id === 'subparam-popup') {

        closeSubParamPopup();

      }

    });

  }

});



// Handle backdrop click and escape key for modal and sub-param popup

document.addEventListener('keydown', (e) => {

  if (e.key === 'Escape') {

    const subParamPopup = document.getElementById('subparam-popup');

    if (subParamPopup && subParamPopup.classList.contains('active')) {

      closeSubParamPopup();

    } else {

      const modal = document.getElementById('modal-overlay');

      if (modal.classList.contains('active')) {

        closeModal();

      }

    }

  }

});