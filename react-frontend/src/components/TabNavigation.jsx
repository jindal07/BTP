export default function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: '🏠 Browse Colleges', icon: '🏠' },
    { id: 'compare', label: '📊 Compare', icon: '📊' },
    { id: 'predictions', label: '🔮 Predictions', icon: '🔮' },
    { id: 'admin', label: '⚙️ Admin', icon: '⚙️' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-2 border border-silver-200">
      <div className="flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id 
                ? 'text-camel-700 border-camel-600' 
                : 'text-graphite-600 border-transparent hover:text-camel-600 hover:border-camel-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label.replace(/^[^\s]+ /, '')}
          </button>
        ))}
      </div>
    </div>
  )
}

