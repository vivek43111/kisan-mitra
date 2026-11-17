import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTarget = searchParams.get('redirect')

  const [role, setRole] = useState('BUYER') // 'BUYER', 'FARMER', 'DELIVERY'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cropOrBusiness: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      setError('Please fill in all mandatory fields (Name, Phone, Password, Address, City, and PIN code).')
      return
    }

    if (formData.phone.trim().replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (formData.pincode.trim().replace(/\D/g, '').length < 6) {
      setError('Please enter a valid 6-digit postal PIN code.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Get existing users
    const existingUsers = JSON.parse(
      localStorage.getItem('kisan_registered_users') || '[]'
    )

    // Check if phone or email already registered
    const exists = existingUsers.find(
      (u) =>
        u.phone === formData.phone.trim() ||
        (formData.email && u.email.toLowerCase() === formData.email.trim().toLowerCase())
    )
    if (exists) {
      setError('An account with this mobile number or email already exists. Please login.')
      return
    }

    const newUser = {
      id: 'USR' + Date.now().toString().slice(-6),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: role, // 'FARMER', 'BUYER', 'DELIVERY'
      address: formData.address.trim(),
      city: formData.city.trim(),
      district: formData.city.trim(),
      state: formData.state.trim() || 'Gujarat',
      pincode: formData.pincode.trim(),
      cropOrBusiness:
        formData.cropOrBusiness.trim() ||
        (role === 'FARMER'
          ? 'Wheat & Basmati Rice'
          : role === 'DELIVERY'
          ? 'Cold Chain Agricultural Transport'
          : 'Household Consumer'),
      registeredAt: new Date().toISOString(),
    }

    existingUsers.push(newUser)
    localStorage.setItem('kisan_registered_users', JSON.stringify(existingUsers))

    // Set as active session (auto-login after signup)
    localStorage.setItem('kisan_user', JSON.stringify(newUser))

    alert(
      `🎉 Account Created Successfully!\n\n` +
      `Welcome to Kisan Mitra, ${newUser.name}!\n` +
      `User ID: #${newUser.id}\n` +
      `Account Type: ${
        role === 'FARMER'
          ? '🌾 Farmer (किसान)'
          : role === 'DELIVERY'
          ? '🚚 Delivery Partner (डिलीवरी पार्टनर)'
          : '🛒 Buyer / Consumer (खरीदार)'
      }\n` +
      `Location: ${newUser.address}, ${newUser.city} - ${newUser.pincode}`
    )

    if (role === 'FARMER') {
      navigate('/farmer-dashboard')
    } else if (role === 'DELIVERY') {
      navigate('/delivery-partner')
    } else {
      navigate(redirectTarget || '/profile')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl">🌱</span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Create Kisan Mitra Account
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              Register once, log in anytime to buy, sell, or deliver farm produce.
            </p>
          </div>

          {/* Role Selection Tabs (3 Roles) */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Your Account Type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                className={`p-3.5 rounded-xl border-2 text-left transition cursor-pointer ${
                  role === 'BUYER'
                    ? 'border-green-600 bg-green-50 text-green-900 ring-2 ring-green-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">🛒</div>
                <div className="font-bold text-sm">Buyer / Consumer</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Buy produce direct from farms
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('FARMER')}
                className={`p-3.5 rounded-xl border-2 text-left transition cursor-pointer ${
                  role === 'FARMER'
                    ? 'border-green-600 bg-green-50 text-green-900 ring-2 ring-green-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">🌾</div>
                <div className="font-bold text-sm">Farmer (किसान)</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  List crops & manage stock
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('DELIVERY')}
                className={`p-3.5 rounded-xl border-2 text-left transition cursor-pointer ${
                  role === 'DELIVERY'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">🚚</div>
                <div className="font-bold text-sm">Delivery Partner</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Farm pickup & doorstep transit
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={
                  role === 'FARMER'
                    ? 'e.g. Ramesh Kumar (Farmer)'
                    : role === 'DELIVERY'
                    ? 'e.g. Vikram Logistics & Transport'
                    : 'e.g. Priya Sharma'
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mobile Number (Used as User ID) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>

            {/* Address & Personal Details */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <span>📍</span>{' '}
                {role === 'FARMER'
                  ? 'Farm Location / Pickup Point'
                  : role === 'DELIVERY'
                  ? 'Logistics Hub / Operational Area'
                  : 'Maintained Delivery Address'}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Street Address / Village / Locality *
                </label>
                <textarea
                  rows="2"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete address for order delivery or farm pickup"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Vadodara"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Gujarat"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition mt-6 text-base cursor-pointer"
            >
              Register as{' '}
              {role === 'FARMER'
                ? 'Farmer'
                : role === 'DELIVERY'
                ? 'Delivery Partner'
                : 'Buyer'}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
            Already have an account?{' '}
            <Link
              to={redirectTarget ? `/login?redirect=${redirectTarget}` : '/login'}
              className="text-green-700 font-bold hover:underline"
            >
              Log in here
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-green-400">Kissan Mitra</h2>
          <p className="mt-2 text-gray-400">
            Connecting farmers, buyers, and delivery partners directly.
          </p>
          <p className="mt-5 text-gray-500 text-sm">
            © 2026 Kissan Mitra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Register
