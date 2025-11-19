import { useState, useMemo } from 'react'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

export default function PredictionsTab({ predictions, loading, error }) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and sort predictions
  const filteredAndSortedPredictions = useMemo(() => {
    if (!predictions || predictions.length === 0) return []
    
    // Sort by predicted rank first
    const sorted = [...predictions].sort((a, b) => 
      (a.predicted_rank || 9999) - (b.predicted_rank || 9999)
    )
    
    // Then filter by search query
    if (!searchQuery) return sorted
    
    return sorted.filter((pred) =>
      pred.college && pred.college.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [predictions, searchQuery])

  // Get rank badge styling
  const getRankBadgeClass = (rank) => {
    if (rank <= 10) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/50'
    if (rank <= 50) return 'bg-gradient-to-br from-camel-500 to-toffee-brown-700 shadow-camel-500/50'
    return 'bg-gradient-to-br from-silver-400 to-graphite-600 shadow-silver-500/50'
  }

  // Get change indicator
  const getChangeIndicator = (change) => {
    if (!change || change === 0) {
      return { 
        icon: '→', 
        class: 'text-gray-500', 
        text: 'No Change',
        bgClass: 'bg-gray-50'
      }
    } else if (change > 0) {
      return { 
        icon: '↑', 
        class: 'text-green-600', 
        text: `${Math.abs(change)}`,
        bgClass: 'bg-green-50'
      }
    } else {
      return { 
        icon: '↓', 
        class: 'text-red-600', 
        text: `${Math.abs(change)}`,
        bgClass: 'bg-red-50'
      }
    }
  }

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-6 fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-silver-200">
        <h2 className="text-2xl font-bold text-graphite-800 mb-2">
          🔮 Predicted Rankings for 2026
        </h2>
        <p className="text-graphite-600 mb-6">
          Machine learning predictions based on historical trends and performance metrics
        </p>

        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-graphite-700 mb-2">
            Search College
            </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by college name..."
            className="input-field"
          />
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-graphite-600">
            Showing <span className="font-semibold text-camel-700">{filteredAndSortedPredictions.length}</span> of <span className="font-semibold">{predictions?.length || 0}</span> predictions
          </div>
          {filteredAndSortedPredictions.length === 0 && predictions?.length > 0 && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-sm text-camel-600 hover:text-camel-700 font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Predictions Table */}
      {filteredAndSortedPredictions.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-silver-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-silver-200">
              <thead className="bg-gradient-to-r from-toffee-brown-700 to-camel-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Predicted Rank (2026)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    College Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Predicted Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Current Rank (2025)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Expected Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-silver-200">
                {filteredAndSortedPredictions.map((pred, index) => {
                  const changeInfo = getChangeIndicator(pred.change)
                  
                  return (
                    <tr
                      key={pred.college || index}
                      className="hover:bg-silver-50 transition-colors"
                    >
                      {/* Predicted Rank */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center 
                            font-bold text-white text-lg shadow-lg
                            ${getRankBadgeClass(pred.predicted_rank || 999)}
                          `}>
                            {pred.predicted_rank || 'N/A'}
                          </div>
                        </div>
                      </td>

                      {/* College Name */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-graphite-900 max-w-md">
                          {pred.college || 'N/A'}
                        </div>
                      </td>

                      {/* Predicted Score */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-camel-700">
                          {pred.predicted_score ? pred.predicted_score.toFixed(2) : 'N/A'}
                        </div>
                      </td>

                      {/* Current Rank 2025 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-toffee-brown-700">
                          {pred.current_rank_2025 || 'N/A'}
                        </div>
                      </td>

                      {/* Change Indicator */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${changeInfo.bgClass}`}>
                          <span className={`text-2xl leading-none ${changeInfo.class}`}>
                            {changeInfo.icon}
                          </span>
                          <span className={`font-semibold text-sm ${changeInfo.class}`}>
                            {changeInfo.text}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : predictions && predictions.length === 0 ? (
        // No predictions available at all
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-silver-200">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-graphite-700 mb-2">
            No Predictions Available
          </h3>
          <p className="text-silver-600 mb-4">
            Upload CSV data to generate ML predictions for 2026 rankings
          </p>
          <div className="inline-flex items-center space-x-2 text-sm text-graphite-600 bg-silver-50 px-4 py-2 rounded-lg">
            <span>💡</span>
            <span>Predictions are generated automatically when new data is uploaded via the Admin tab</span>
          </div>
        </div>
      ) : (
        // Search returned no results
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-silver-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-graphite-700 mb-2">
            No Predictions Found
          </h3>
          <p className="text-silver-600 mb-4">
            No colleges match your search query: <span className="font-semibold text-graphite-800">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn-primary"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Legend */}
      {filteredAndSortedPredictions.length > 0 && (
        <div className="bg-gradient-to-br from-camel-50 to-toffee-brown-50 rounded-xl shadow-lg p-6 border border-camel-200">
          <h3 className="text-lg font-bold text-graphite-800 mb-4">📋 Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-graphite-700 mb-2">Rank Badges:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    1-10
                  </div>
                  <span className="text-sm text-graphite-600">Top 10 Ranks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-camel-500 to-toffee-brown-700 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    11-50
                  </div>
                  <span className="text-sm text-graphite-600">Top 50 Ranks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-silver-400 to-graphite-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    50+
                  </div>
                  <span className="text-sm text-graphite-600">Other Ranks</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-graphite-700 mb-2">Change Indicators:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-50">
                    <span className="text-xl text-green-600">↑</span>
                    <span className="text-sm font-semibold text-green-600">+N</span>
                  </div>
                  <span className="text-sm text-graphite-600">Rank Improved</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-50">
                    <span className="text-xl text-red-600">↓</span>
                    <span className="text-sm font-semibold text-red-600">N</span>
                  </div>
                  <span className="text-sm text-graphite-600">Rank Dropped</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-silver-100">
                    <span className="text-xl text-graphite-500">→</span>
                    <span className="text-sm font-semibold text-graphite-500">No Change</span>
                  </div>
                  <span className="text-sm text-graphite-600">Rank Maintained</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
