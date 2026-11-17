import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kisan_user')
      if (stored) {
        setCurrentUser(JSON.parse(stored))
      }
    } catch {
      setCurrentUser(null)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('kisan_user')
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-green-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-700">Kissan Mitra</h1>
              <p className="text-xs text-gray-500">Farmers • Buyers • Direct</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 font-medium transition text-sm"
            >
              Home
            </Link>

            <Link
              to="/marketplace"
              className="text-gray-700 hover:text-green-600 font-medium transition text-sm"
            >
              Marketplace
            </Link>

            {/* Role-Specific Portals (Strict Role-Based Access Control) */}
            {currentUser?.role === 'FARMER' && (
              <>
                <Link
                  to="/farmer-dashboard"
                  className="bg-green-600 text-white font-semibold transition flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border border-green-600 shadow-sm"
                  title="Farmer Crop Listing & Stock Hub"
                >
                  <span>🌾</span> Farmer Portal
                </Link>

                <Link
                  to="/ai-doctor"
                  className="font-bold transition flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 shadow-xs"
                  title="AI Crop Disease Scanner & Doctor"
                >
                  <span>🍃</span> AI Doctor
                </Link>
              </>
            )}

            {currentUser?.role === 'DELIVERY' && (
              <Link
                to="/delivery-partner"
                className="bg-blue-600 text-white font-semibold transition flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border border-blue-600 shadow-sm"
                title="Cold-Chain Delivery & Tracking Hub"
              >
                <span>🚚</span> Delivery Hub
              </Link>
            )}

            {currentUser?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="bg-red-600 text-white font-semibold transition flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border border-red-600 shadow-sm"
                title="Admin Microservices Monitor (Ports 5000-5004)"
              >
                <span>👑</span> Admin Panel
              </Link>
            )}

            {/* Quick Guest Portal switcher when not logged in */}
            {!currentUser && (
              <Link
                to="/farmer-dashboard"
                className="bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 font-semibold transition flex items-center gap-1 px-2.5 py-1 rounded-md text-xs"
                title="Farmer Portal Login"
              >
                <span>🌾</span> Farmer Portal
              </Link>
            )}

            <Link
              to="/orders"
              className="text-gray-700 hover:text-green-600 font-medium transition text-sm"
            >
              Orders
            </Link>

            <Link
              to="/mandi-prices"
              className="text-gray-700 hover:text-green-600 font-medium transition text-sm hidden lg:inline"
            >
              Mandi
            </Link>
          </div>

          {/* Right Actions: Auth State */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="hidden sm:flex flex-col items-end hover:opacity-80 transition text-right"
                  title="View and Edit Profile"
                >
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-slate-900 text-white'
                        : currentUser.role === 'FARMER'
                        ? 'bg-green-100 text-green-800'
                        : currentUser.role === 'DELIVERY'
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {currentUser.role === 'ADMIN'
                      ? '👑 Admin'
                      : currentUser.role === 'FARMER'
                      ? '🌾 Farmer'
                      : currentUser.role === 'DELIVERY'
                      ? '🚚 Delivery'
                      : '🛒 Buyer'}
                  </span>
                </Link>

                <Link
                  to="/profile"
                  className="px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition"
                >
                  👤 Profile
                </Link>

                {currentUser.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="md:hidden px-2.5 py-1 text-xs bg-red-600 text-white font-bold rounded"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-sm text-red-600 border border-red-300 hover:bg-red-50 font-semibold rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/admin"
                  className="hidden lg:inline-block px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition"
                  title="Direct Admin Portal Access"
                >
                  Admin
                </Link>

                <Link
                  to="/login"
                  className="px-4 py-2 text-green-700 font-semibold hover:bg-green-50 rounded-lg transition text-sm"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-sm text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
