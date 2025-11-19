export default function Header() {
  return (
    <header 
      className="rounded-2xl m-3 bg-gradient-to-r from-toffee-brown-700 via-camel-700 to-graphite-800 text-white shadow-xl" 
      style={{ fontFamily: "'Exo 2', sans-serif" }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center space-x-4">
            {/* NIRF Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/nirf-logo.png" 
                alt="NIRF Logo" 
                className="h-16 w-auto md:h-20 object-contain bg-white rounded-lg p-2 shadow-lg"
                style={{ 
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                }}
              />
            </div>
            
            {/* Title and Subtitle */}
            <div>
              <h1 
                className="text-3xl md:text-4xl font-bold mb-1 tracking-tight"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                NIRF Engineering Rankings Portal
              </h1>
              <p 
                className="text-camel-100 text-sm md:text-lg font-light"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                Explore and analyze India's top engineering institutions (2017-2025)
              </p>
            </div>
          </div>

          {/* Right Section: Stats */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                1000+
              </div>
              <div className="text-camel-200 text-sm">Institutions</div>
            </div>
            <div className="h-12 w-px bg-camel-400"></div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                9
              </div>
              <div className="text-camel-200 text-sm">Years</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
