import { useState, useEffect } from 'react'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'
import HomeTab from './components/HomeTab'
import CompareTab from './components/CompareTab'
import PredictionsTab from './components/PredictionsTab'
import AdminTab from './components/AdminTab'
import { useColleges } from './hooks/useColleges'
import { usePredictions } from './hooks/usePredictions'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const { colleges, loading: collegesLoading, error: collegesError, refetch: refetchColleges } = useColleges()
  const { predictions, loading: predictionsLoading, error: predictionsError } = usePredictions()

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Exo 2', sans-serif" }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {activeTab === 'home' && (
            <HomeTab 
              colleges={colleges} 
              loading={collegesLoading} 
              error={collegesError} 
            />
          )}
          
          {activeTab === 'compare' && (
            <CompareTab 
              colleges={colleges} 
              loading={collegesLoading} 
              error={collegesError} 
            />
          )}
          
          {activeTab === 'predictions' && (
            <PredictionsTab 
              predictions={predictions} 
              loading={predictionsLoading} 
              error={predictionsError} 
            />
          )}
          
          {activeTab === 'admin' && (
            <AdminTab onUploadSuccess={refetchColleges} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App

