import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTarget = searchParams.get('redirect')

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const destinationAfterLogin = (role) => {
    if (role === 'ADMIN') return '/admin'
    if (role === 'FARMER') return '/farmer-dashboard'
    if (role === 'DELIVERY') return '/delivery-partner'
    return redirectTarget || '/marketplace'
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (!identifier.trim() || !password) {
      setError('Please enter your mobile number/email and password.')
      return
    }

    // Check for Administrator Login
    if (
      (identifier.trim().toLowerCase() === 'admin' ||
        identifier.trim().toLowerCase() === 'admin@kisanmitra.in') &&
      password === 'admin123'
    ) {
      const adminUser = {
        id: 'ADMIN01',
        name: 'System Administrator',
        email: 'admin@kisanmitra.in',
        role: 'ADMIN',
      }
      localStorage.setItem('kisan_user', JSON.stringify(adminUser))
      alert('👑 Logged in as System Administrator!')
      navigate('/admin')
      return
    }

    const registeredUsers = JSON.parse(
      localStorage.getItem('kisan_registered_users') || '[]'
    )

    // Look up user in localStorage
    const found = registeredUsers.find(
      (u) =>
        (u.phone === identifier.trim() ||
          u.email.toLowerCase() === identifier.trim().toLowerCase()) &&
        u.password === password
    )

    if (found) {
      localStorage.setItem('kisan_user', JSON.stringify(found))
      alert(
        `✅ Welcome back, ${found.name}!\nLogged in as ${
          found.role === 'FARMER'
            ? '🌾 Farmer'
            : found.role === 'ADMIN'
            ? '👑 Admin'
            : found.role === 'DELIVERY'
            ? '🚚 Delivery Partner'
            : '🛒 Buyer'
        }`
      )
      navigate(destinationAfterLogin(found.role))
      return
    }

    // Default test credentials check for quick grading / lab demo
    if (identifier === '9876543210' && password === 'farmer123') {
      const demoFarmer = {
        id: 'USR101',
        name: 'Ramesh Kumar',
        phone: '9876543210',
        email: 'ramesh@kisanmitra.in',
        role: 'FARMER',
        state: 'Punjab',
        city: 'Ludhiana',
        address: 'Farm House #12, GT Road',
        pincode: '141001',
        cropOrBusiness: 'Wheat & Basmati Rice',
      }
      localStorage.setItem('kisan_user', JSON.stringify(demoFarmer))
      alert(`✅ Welcome back, Ramesh Kumar!\nLogged in as 🌾 Farmer`)
      navigate(destinationAfterLogin('FARMER'))
      return
    }

    if (identifier === '9123456789' && password === 'buyer123') {
      const demoBuyer = {
        id: 'USR202',
        name: 'Pooja Sharma',
        phone: '9123456789',
        email: 'pooja@example.com',
        role: 'BUYER',
        district: 'Vadodara',
        city: 'Vadodara',
        state: 'Gujarat',
        address: 'B-402, Green Avenue, Alkapuri',
        pincode: '390007',
        cropOrBusiness: 'Household Consumer',
      }
      localStorage.setItem('kisan_user', JSON.stringify(demoBuyer))
      alert(`✅ Welcome back, Pooja Sharma!\nLogged in as 🛒 Buyer`)
      navigate(destinationAfterLogin('BUYER'))
      return
    }

    if (identifier === '9811223344' && password === 'delivery123') {
      const demoDelivery = {
        id: 'DLV8801',
        name: 'Vikram Logistics & Transport',
        phone: '9811223344',
        email: 'delivery@kisanmitra.in',
        role: 'DELIVERY',
        city: 'Vadodara',
        state: 'Gujarat',
        address: 'Hub #4, Transport Nagar, Makarpura',
        pincode: '390010',
        cropOrBusiness: 'Cold Chain Agricultural Transport',
      }
      localStorage.setItem('kisan_user', JSON.stringify(demoDelivery))
      alert(`✅ Welcome back, Vikram Logistics!\nLogged in as 🚚 Delivery Partner`)
      navigate(destinationAfterLogin('DELIVERY'))
      return
    }

    setError(
      'Invalid credentials. Please check your mobile/email and password, or use Quick Demo Login.'
    )
  }

  const quickLoginAs = (roleType) => {
    if (roleType === 'FARMER') {
      const demoFarmer = {
        id: 'USR101',
        name: 'Ramesh Kumar',
        phone: '9876543210',
        email: 'ramesh.farmer@kisanmitra.in',
        role: 'FARMER',
        state: 'Punjab',
        city: 'Ludhiana',
        address: 'Farm House #12, GT Road',
        pincode: '141001',
        cropOrBusiness: 'Wheat, Basmati Rice, Mustard',
      }
      localStorage.setItem('kisan_user', JSON.stringify(demoFarmer))
      alert(`✅ Quick Demo Login successful as Farmer: Ramesh Kumar!`)
      navigate(destinationAfterLogin('FARMER'))
    } else if (roleType === 'BUYER') {
      const demoBuyer = {
        id: 'USR202',
        name: 'Pooja Sharma',
        phone: '9123456789',
        email: 'pooja.buyer@kisanmitra.in',
        role: 'BUYER',
        district: 'Vadodara',
        city: 'Vadodara',
        state: 'Gujarat',
        address: 'B-402, Green Avenue, Alkapuri',
        pincode: '390007',
        cropOrBusiness: 'Household Consumer',
      }
      localStorage.setItem('kisan_user', JSON.stringify(demoBuyer))
      alert(`✅ Quick Demo Login successful as Buyer: Pooja Sharma!`)
      navigate(destinationAfterLogin('BUYER'))
    } else if (roleType === 'DELIVERY') {
      const demoDelivery = {
        id: 'DLV8801',
        name: 'Vikram Logistics & Transport',
        phone: '9811223344',
        email: 'delivery@kisanmitra.in',
        role: 'DELIVERY',
        city: 'Vadodara',
        state: 'Gujarat',
        address: 'Hub #4, Transport Nagar, Makarpura',
        pincode: '390010',
        cropOrBusiness: 'Cold Chain Agricultural Transport',
      }
      localStorage.setItem('kisan_user', JSON.stringify(demoDelivery))
      alert(`✅ Quick Demo Login successful as Delivery Partner: Vikram Logistics!`)
      navigate(destinationAfterLogin('DELIVERY'))
    } else if (roleType === 'ADMIN') {
      const demoAdmin = {
        id: 'ADMIN01',
        name: 'System Administrator',
        email: 'admin@kisanmitra.in',
        role: 'ADMIN',
      }
      localStorage.setItem('kisan_user', JSON.stringify(demoAdmin))
      alert(`👑 Quick Demo Login successful as Administrator!`)
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 max-w-md mx-auto w-full px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              🌾
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Kisan Mitra Login
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in as Farmer, Buyer, Delivery Partner, or Admin
            </p>
          </div>

          {/* Mandatory Login Notification if trying to checkout */}
          {redirectTarget && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
              <span className="text-lg">🔒</span>
              <div>
                <p className="font-bold">Authentication Required</p>
                <p className="text-amber-700 mt-0.5">
                  Please log in to your account to complete this action.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mobile Number or Email *
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value)
                  setError('')
                }}
                placeholder="e.g. 9876543210 or name@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Password *
                </label>
                <span className="text-xs text-green-700 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition text-base cursor-pointer"
            >
              Log In to Continue
            </button>
          </form>

          {/* Quick Demo Section (4 Roles) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center mb-3">
              ⚡ Instant 1-Click Role Logins
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => quickLoginAs('FARMER')}
                className="py-2.5 px-2 bg-green-50 hover:bg-green-100 border border-green-300 rounded-xl text-xs font-bold text-green-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🌾</span>
                <span>Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => quickLoginAs('BUYER')}
                className="py-2.5 px-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl text-xs font-bold text-blue-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🛒</span>
                <span>Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => quickLoginAs('DELIVERY')}
                className="py-2.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-xl text-xs font-bold text-indigo-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🚚</span>
                <span>Delivery Partner</span>
              </button>

              <button
                type="button"
                onClick={() => quickLoginAs('ADMIN')}
                className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>👑</span>
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account yet?{' '}
            <Link
              to={redirectTarget ? `/register?redirect=${redirectTarget}` : '/register'}
              className="text-green-700 font-bold hover:underline"
            >
              Register now
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-green-400">Kissan Mitra</h2>
          <p className="mt-2 text-gray-400">
            Connecting farmers directly with buyers and delivery partners.
          </p>
          <p className="mt-5 text-gray-500 text-sm">
            © 2026 Kissan Mitra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Login
