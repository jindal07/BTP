import { useState, useMemo } from 'react'
import { Radar, Line } from 'react-chartjs-2'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

export default function CompareTab({ colleges, loading, error }) {
  const [selectedColleges, setSelectedColleges] = useState([])
  const [selectedYear, setSelectedYear] = useState('2025')
  const [searchQuery, setSearchQuery] = useState('')

  const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017']
  const parameters = ['TLR (100)', 'RPC (100)', 'GO (100)', 'OI (100)', 'PERCEPTION (100)']

  const availableColleges = useMemo(() => {
    if (!colleges) return []
    return colleges
      .filter((c) => c[`Rank_${selectedYear}`])
      .filter((c) => c.Name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const rankA = parseFloat(a[`Rank_${selectedYear}`]) || 999999
        const rankB = parseFloat(b[`Rank_${selectedYear}`]) || 999999
        return rankA - rankB
      })
  }, [colleges, selectedYear, searchQuery])

  const toggleCollege = (college) => {
    if (selectedColleges.find((c) => c['Institute ID'] === college['Institute ID'])) {
      setSelectedColleges(selectedColleges.filter((c) => c['Institute ID'] !== college['Institute ID']))
    } else if (selectedColleges.length < 5) {
      setSelectedColleges([...selectedColleges, college])
    }
  }

  const colors = [
    { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.2)' },
    { border: 'rgb(16, 185, 129)', bg: 'rgba(16, 185, 129, 0.2)' },
    { border: 'rgb(245, 158, 11)', bg: 'rgba(245, 158, 11, 0.2)' },
    { border: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.2)' },
    { border: 'rgb(139, 92, 246)', bg: 'rgba(139, 92, 246, 0.2)' },
  ]

  const radarData = selectedColleges.length > 0 ? {
    labels: parameters.map(p => p.replace(' (100)', '')),
    datasets: selectedColleges.map((college, index) => ({
      label: college.Name.substring(0, 30) + '...',
      data: parameters.map((param) => {
        const value = college[`${param}_${selectedYear}`]
        return value ? parseFloat(value) : 0
      }),
      backgroundColor: colors[index].bg,
      borderColor: colors[index].border,
      pointBackgroundColor: colors[index].border,
    })),
  } : null

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-6 fade-in">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-silver-200">
        <h2 className="text-2xl font-bold text-graphite-800 mb-4">Compare Colleges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-graphite-700 mb-2">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="select-field"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-700 mb-2">
              Search College
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search to add..."
              className="input-field"
            />
          </div>
        </div>

        {/* Selected Colleges */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-graphite-700">
              Selected ({selectedColleges.length}/5)
            </span>
            {selectedColleges.length > 0 && (
              <button
                onClick={() => setSelectedColleges([])}
                className="text-sm text-toffee-brown-600 hover:text-toffee-brown-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedColleges.map((college, index) => (
              <div
                key={college['Institute ID']}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: colors[index].bg,
                  color: colors[index].border,
                }}
              >
                {college.Name.substring(0, 30)}...
                <button
                  onClick={() => toggleCollege(college)}
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Colleges */}
        <div>
          <label className="block text-sm font-medium text-graphite-700 mb-2">
            Available Colleges (click to add)
          </label>
          <div className="max-h-48 overflow-y-auto border border-silver-200 rounded-lg">
            {availableColleges.slice(0, 20).map((college) => {
              const isSelected = selectedColleges.find((c) => c['Institute ID'] === college['Institute ID'])
              return (
                <button
                  key={college['Institute ID']}
                  onClick={() => toggleCollege(college)}
                  disabled={!isSelected && selectedColleges.length >= 5}
                  className={`w-full text-left px-4 py-2 hover:bg-silver-50 transition-colors border-b border-silver-100 ${
                    isSelected ? 'bg-camel-50 border-l-4 border-l-camel-600' : ''
                  } ${!isSelected && selectedColleges.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-graphite-800">{college.Name}</span>
                    <span className="text-xs text-camel-600 font-semibold">
                      Rank: {college[`Rank_${selectedYear}`]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {selectedColleges.length > 0 && (
        <>
          {/* Radar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-silver-200">
            <h3 className="text-xl font-bold text-graphite-800 mb-4">Performance Comparison</h3>
            <div className="h-96">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-silver-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-graphite-800 mb-4">Detailed Comparison ({selectedYear})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-silver-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-graphite-600 uppercase">
                      Parameter
                    </th>
                    {selectedColleges.map((college, index) => (
                      <th
                        key={college['Institute ID']}
                        className="px-6 py-3 text-left text-xs font-medium uppercase"
                        style={{ color: colors[index].border }}
                      >
                        {college.Name.substring(0, 20)}...
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-silver-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-graphite-900">Rank</td>
                    {selectedColleges.map((college) => (
                      <td key={college['Institute ID']} className="px-6 py-4 text-sm text-camel-700 font-semibold">
                        {college[`Rank_${selectedYear}`]}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-silver-50">
                    <td className="px-6 py-4 text-sm font-medium text-graphite-900">Score</td>
                    {selectedColleges.map((college) => (
                      <td key={college['Institute ID']} className="px-6 py-4 text-sm text-toffee-brown-700 font-semibold">
                        {college[`Score_${selectedYear}`] ? parseFloat(college[`Score_${selectedYear}`]).toFixed(2) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  {parameters.map((param, idx) => (
                    <tr key={param} className={idx % 2 === 0 ? 'bg-white' : 'bg-silver-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-graphite-900">
                        {param.replace(' (100)', '')}
                      </td>
                      {selectedColleges.map((college) => (
                        <td key={college['Institute ID']} className="px-6 py-4 text-sm text-graphite-700">
                          {college[`${param}_${selectedYear}`] ? parseFloat(college[`${param}_${selectedYear}`]).toFixed(2) : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedColleges.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-silver-200">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-graphite-700 mb-2">No colleges selected</h3>
          <p className="text-silver-600">Select up to 5 colleges to compare their performance</p>
        </div>
      )}
    </div>
  )
}

