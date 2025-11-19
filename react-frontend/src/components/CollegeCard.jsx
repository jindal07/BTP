export default function CollegeCard({ college, year, onClick }) {
  const rank = college[`Rank_${year}`]
  const score = college[`Score_${year}`]
  const tlr = college[`TLR (100)_${year}`]
  const rpc = college[`RPC (100)_${year}`]

  const getRankBadgeClass = (rank) => {
    const r = parseInt(rank)
    if (r === 1) return 'rank-badge rank-gold'
    if (r === 2) return 'rank-badge rank-silver'
    if (r === 3) return 'rank-badge rank-bronze'
    return 'rank-badge rank-default'
  }

  const getScoreColor = (score) => {
    const s = parseFloat(score)
    if (s >= 70) return 'text-toffee-brown-700'
    if (s >= 50) return 'text-camel-600'
    if (s >= 30) return 'text-silver-600'
    return 'text-graphite-600'
  }

  return (
    <div onClick={onClick} className="college-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={getRankBadgeClass(rank)}>
          {rank}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 font-medium">Score</div>
          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score ? parseFloat(score).toFixed(2) : 'N/A'}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-graphite-800 mb-3 line-clamp-2 group-hover:text-camel-700 transition-colors">
        {college.Name}
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="stat-card">
          <div className="text-xs text-graphite-500 mb-1">TLR</div>
          <div className="text-lg font-bold text-camel-600">
            {tlr ? parseFloat(tlr).toFixed(1) : 'N/A'}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-graphite-500 mb-1">RPC</div>
          <div className="text-lg font-bold text-toffee-brown-600">
            {rpc ? parseFloat(rpc).toFixed(1) : 'N/A'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-camel-100 text-camel-800">
          {year}
        </span>
        <span className="text-camel-700 font-medium group-hover:underline">
          View Details →
        </span>
      </div>
    </div>
  )
}

