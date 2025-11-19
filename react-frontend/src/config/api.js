/**
 * API Configuration
 * 
 * In development: Uses Vite proxy (localhost:3000 -> localhost:8000)
 * In production (Vercel): Uses relative URLs (same domain)
 * In production (separate): Uses environment variable VITE_API_URL
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get the full API URL for an endpoint
 * @param {string} endpoint - API endpoint (e.g., '/api/colleges')
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint) {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If VITE_API_URL is set, use it (for separate backend deployment)
  // Otherwise, use relative URL (works for Vercel monorepo and dev proxy)
  if (API_BASE_URL) {
    return `${API_BASE_URL}${cleanEndpoint}`;
  }
  
  return cleanEndpoint;
}

/**
 * Fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed [${endpoint}]:`, error);
    throw error;
  }
}

export default {
  getApiUrl,
  apiRequest,
  BASE_URL: API_BASE_URL,
};

