import { useState, useEffect } from 'react'
import { getApiUrl } from '../config/api'

export function useColleges() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchColleges = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(getApiUrl('/api/colleges'))
      
      if (!response.ok) {
        throw new Error('Failed to fetch colleges data')
      }
      
      const data = await response.json()
      setColleges(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching colleges:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchColleges()
  }, [])

  return {
    colleges,
    loading,
    error,
    refetch: fetchColleges,
  }
}

