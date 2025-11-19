import { useEffect } from 'react'
import { Line, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function CollegeModal({ college, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']
  
  // Get rank progression data
  const rankData = years.map((year) => {
    const rank = college[`Rank_${year}`]
    return rank && rank !== null && rank !== 'null' ? parseFloat(rank) : null
  }).filter(r => r !== null)

  const rankYears = years.filter((year) => {
    const rank = college[`Rank_${year}`]
    return rank && rank !== null && rank !== 'null'
  })

  const scoreData = years.map((year) => {
    const score = college[`Score_${year}`]
    return score && score !== null && score !== 'null' ? parseFloat(score) : null
  }).filter(s => s !== null)

  // Latest year with data
  const latestYear = [...years].reverse().find((year) => {
    const rank = college[`Rank_${year}`]
    return rank && rank !== null && rank !== 'null'
  })

  const latestMetrics = latestYear ? {
    tlr: college[`TLR (100)_${latestYear}`],
    rpc: college[`RPC (100)_${latestYear}`],
    go: college[`GO (100)_${latestYear}`],
    oi: college[`OI (100)_${latestYear}`],
    perception: college[`PERCEPTION (100)_${latestYear}`],
  } : null

  const rankChartData = {
    labels: rankYears,
    datasets: [
      {
        label: 'Rank',
        data: rankData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const scoreChartData = {
    labels: rankYears,
    datasets: [
      {
        label: 'Score',
        data: scoreData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const radarData = latestMetrics ? {
    labels: ['TLR', 'RPC', 'GO', 'OI', 'Perception'],
    datasets: [
      {
        label: latestYear,
        data: [
          parseFloat(latestMetrics.tlr) || 0,
          parseFloat(latestMetrics.rpc) || 0,
          parseFloat(latestMetrics.go) || 0,
          parseFloat(latestMetrics.oi) || 0,
          parseFloat(latestMetrics.perception) || 0,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
      },
    ],
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        reverse: true, // For rank (lower is better)
        beginAtZero: false,
      },
    },
  }

  const scoreChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        reverse: false,
        beginAtZero: true,
        max: 100,
      },
    },
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-toffee-brown-700 to-camel-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{college.Name}</h2>
              <p className="text-camel-100 text-sm">Institute ID: {college['Institute ID']}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
          {/* Latest Metrics */}
          {latestMetrics && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-graphite-800 mb-4">Latest Metrics ({latestYear})</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(latestMetrics).map(([key, value]) => (
                  <div key={key} className="stat-card text-center">
                    <div className="text-sm text-graphite-500 uppercase mb-2">{key}</div>
                    <div className="text-2xl font-bold text-camel-700">
                      {value ? parseFloat(value).toFixed(2) : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-silver-200 p-4">
              <h4 className="text-lg font-semibold mb-4 text-graphite-800">Rank Progression</h4>
              <div className="h-64">
                {rankData.length > 0 ? (
                  <Line data={rankChartData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-silver-400">
                    No rank data available
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-silver-200 p-4">
              <h4 className="text-lg font-semibold mb-4 text-graphite-800">Score Progression</h4>
              <div className="h-64">
                {scoreData.length > 0 ? (
                  <Line data={scoreChartData} options={scoreChartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No score data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          {radarData && (
            <div className="bg-white rounded-lg border border-silver-200 p-4 mb-8">
              <h4 className="text-lg font-semibold mb-4 text-graphite-800">Performance Radar ({latestYear})</h4>
              <div className="h-80">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          )}

          {/* Historical Data Table */}
          <div className="bg-white rounded-lg border border-silver-200 overflow-hidden">
            <h4 className="text-lg font-semibold p-4 bg-silver-50 text-graphite-800">Historical Data</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-silver-200">
                <thead className="bg-silver-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-600 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-600 uppercase">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-600 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-600 uppercase">TLR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-600 uppercase">RPC</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-silver-200">
                  {years.reverse().map((year) => {
                    const rank = college[`Rank_${year}`]
                    if (!rank || rank === null || rank === 'null') return null
                    
                    return (
                      <tr key={year} className="hover:bg-silver-50">
                        <td className="px-4 py-3 text-sm font-medium text-graphite-900">{year}</td>
                        <td className="px-4 py-3 text-sm text-camel-700 font-semibold">{rank}</td>
                        <td className="px-4 py-3 text-sm text-graphite-700">
                          {college[`Score_${year}`] ? parseFloat(college[`Score_${year}`]).toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-graphite-700">
                          {college[`TLR (100)_${year}`] ? parseFloat(college[`TLR (100)_${year}`]).toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-graphite-700">
                          {college[`RPC (100)_${year}`] ? parseFloat(college[`RPC (100)_${year}`]).toFixed(2) : 'N/A'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

