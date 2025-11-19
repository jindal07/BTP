import { useState, useEffect } from 'react'
import { getApiUrl } from '../config/api'

export default function AdminTab({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')

  // Check backend status
  useEffect(() => {
    fetch(getApiUrl('/api/colleges'))
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setMessage(null)
    } else {
      setMessage({ type: 'error', text: 'Please select a valid CSV file' })
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' })
      return
    }

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(getApiUrl('/api/admin/upload'), {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'File uploaded successfully!' })
        setFile(null)
        if (onUploadSuccess) onUploadSuccess()
      } else {
        setMessage({ type: 'error', text: data.detail || 'Upload failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Backend Status */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-silver-200">
        <h2 className="text-2xl font-bold text-graphite-800 mb-4">⚙️ Admin Panel</h2>
        
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-graphite-600">Backend Status:</span>
          <span className={`badge ${
            backendStatus === 'online' ? 'badge-success' :
            backendStatus === 'offline' ? 'badge-error' :
            'badge-warning'
          }`}>
            {backendStatus === 'online' ? '🟢 Online' :
             backendStatus === 'offline' ? '🔴 Offline' :
             '🟡 Checking...'}
          </span>
        </div>

        {backendStatus === 'offline' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">
              ⚠️ Backend is not responding. Please ensure the FastAPI server is running on port 8000.
            </p>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-silver-200">
        <h3 className="text-xl font-bold text-graphite-800 mb-4">Upload New Data</h3>
        <p className="text-graphite-600 mb-6">
          Upload a new CSV file to update the college rankings data. The file should follow the NIRF format.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-graphite-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={uploading || backendStatus !== 'online'}
              className="block w-full text-sm text-graphite-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-camel-50 file:text-camel-800
                hover:file:bg-camel-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {file && (
            <div className="bg-camel-50 border border-camel-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-camel-900">
                    📄 {file.name}
                  </p>
                  <p className="text-xs text-camel-700">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-camel-700 hover:text-camel-900 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`rounded-lg p-4 ${
              message.type === 'success' ? 'bg-green-50 border border-green-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.type === 'success' ? '✅' : '❌'} {message.text}
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading || backendStatus !== 'online'}
            className="btn-primary w-full"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <div className="loader w-5 h-5 mr-2"></div>
                Uploading...
              </span>
            ) : (
              '📤 Upload File'
            )}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-camel-50 to-toffee-brown-50 rounded-xl shadow-lg p-6 border border-camel-200">
        <h3 className="text-xl font-bold text-graphite-800 mb-4">📋 Instructions</h3>
        <ul className="space-y-2 text-graphite-700">
          <li className="flex items-start">
            <span className="text-camel-700 font-bold mr-2">1.</span>
            <span>Ensure your CSV file follows the NIRF engineering rankings format</span>
          </li>
          <li className="flex items-start">
            <span className="text-camel-700 font-bold mr-2">2.</span>
            <span>The file should include columns like Institute ID, Name, Rank, Score, etc.</span>
          </li>
          <li className="flex items-start">
            <span className="text-camel-700 font-bold mr-2">3.</span>
            <span>Make sure the backend server is running before uploading</span>
          </li>
          <li className="flex items-start">
            <span className="text-camel-700 font-bold mr-2">4.</span>
            <span>The data will be validated and processed automatically</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

