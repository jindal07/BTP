import { useState, useEffect } from 'react'
import { getApiUrl } from '../config/api'

/**
 * Transform backend predictions data to frontend format
 */
function transformPredictionsData(rawData) {
  if (!Array.isArray(rawData)) return []
  
  return rawData.map((pred) => ({
    // College name
    college: pred.College || pred.college,
    
    // Predicted data for 2026 (based on 2025 model)
    predicted_rank: pred.Predicted_Rank_2025 || pred.predicted_rank,
    predicted_score: pred.Predicted_Score_2025 || pred.predicted_score,
    
    // Current 2025 data
    current_rank_2025: pred.Actual_Rank_2025 || pred.current_rank_2025,
    current_score_2025: pred.Actual_Score_2025 || pred.current_score_2025,
    
    // Calculate change (positive = improvement, negative = dropped)
    // Note: In rankings, lower number is better, so we reverse the calculation
    change: pred.Actual_Rank_2025 && pred.Predicted_Rank_2025 
      ? pred.Actual_Rank_2025 - pred.Predicted_Rank_2025 
      : 0,
    
    // Confidence level (can be calculated based on prediction accuracy)
    confidence: calculateConfidence(pred)
  }))
}

/**
 * Calculate confidence level based on prediction accuracy
 */
function calculateConfidence(pred) {
  if (!pred.Actual_Score_2025 || !pred.Predicted_Score_2025) {
    return 'Medium'
  }
  
  const accuracy = Math.abs(pred.Actual_Score_2025 - pred.Predicted_Score_2025)
  
  if (accuracy < 1) return 'High'
  if (accuracy < 3) return 'Medium'
  return 'Low'
}

export function usePredictions() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(getApiUrl('/api/predictions'))
        
        if (!response.ok) {
          throw new Error('Failed to fetch predictions data')
        }
        
        const rawData = await response.json()
        const transformedData = transformPredictionsData(rawData)
        
        console.log('Predictions loaded:', transformedData.length, 'predictions')
        setPredictions(transformedData)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching predictions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  return {
    predictions,
    loading,
    error,
  }
}

