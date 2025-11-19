import { useState, useMemo } from 'react'
import CollegeCard from './CollegeCard'
import CollegeModal from './CollegeModal'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

export default function HomeTab({ colleges, loading, error }) {
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedYear, setSelectedYear] = useState('2025')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rank')

  const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017']

  const filteredAndSortedColleges = useMemo(() => {
    if (!colleges) return []

    let filtered = colleges
      .filter((college) => {
        const rank = college[`Rank_${selectedYear}`]
        return rank && rank !== null && rank !== 'null'
      })
      .filter((college) =>
        college.Name.toLowerCase().includes(searchQuery.toLowerCase())
      )

    // Sort
    if (sortBy === 'rank') {
      filtered.sort((a, b) => {
        const rankA = parseFloat(a[`Rank_${selectedYear}`]) || 999999
        const rankB = parseFloat(b[`Rank_${selectedYear}`]) || 999999
        return rankA - rankB
      })
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => {
        const scoreA = parseFloat(a[`Score_${selectedYear}`]) || 0
        const scoreB = parseFloat(b[`Score_${selectedYear}`]) || 0
        return scoreB - scoreA
      })
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.Name.localeCompare(b.Name))
    }

    return filtered
  }, [colleges, selectedYear, searchQuery, sortBy])

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-6 fade-in">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-silver-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              placeholder="Search by name..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
            >
              <option value="rank">Rank</option>
              <option value="score">Score</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-graphite-600">
          Showing <span className="font-semibold text-camel-700">{filteredAndSortedColleges.length}</span> colleges for {selectedYear}
        </div>
      </div>

      {/* College Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedColleges.map((college) => (
          <CollegeCard
            key={college['Institute ID']}
            college={college}
            year={selectedYear}
            onClick={() => setSelectedCollege(college)}
          />
        ))}
      </div>

      {filteredAndSortedColleges.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-graphite-700 mb-2">No colleges found</h3>
          <p className="text-silver-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      {selectedCollege && (
        <CollegeModal
          college={selectedCollege}
          onClose={() => setSelectedCollege(null)}
        />
      )}
    </div>
  )
}

