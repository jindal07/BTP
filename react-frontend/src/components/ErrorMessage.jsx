export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h3>
      <p className="text-red-600">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="btn-primary mt-4"
      >
        Retry
      </button>
    </div>
  )
}

