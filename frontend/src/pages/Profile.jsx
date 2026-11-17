import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cropOrBusiness: '',
  })
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('kisan_user')
    if (!stored) {
      // Must be logged in to view profile
      navigate('/login?redirect=/profile')
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      setFormData({
        name: parsed.name || '',
        phone: parsed.phone || '',
        email: parsed.email || '',
        address: parsed.address || '',
        city: parsed.district || parsed.city || '',
        state: parsed.state || '',
        pincode: parsed.pincode || '',
        cropOrBusiness: parsed.cropOrBusiness || '',
      })
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setSuccessMsg('')
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()

    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      district: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      cropOrBusiness: formData.cropOrBusiness.trim(),
    }

    // Update active session
    localStorage.setItem('kisan_user', JSON.stringify(updatedUser))
    setUser(updatedUser)

    // Update in registered users list
    try {
      const allUsers = JSON.parse(localStorage.getItem('kisan_registered_users') || '[]')
      const updatedList = allUsers.map((u) =>
        u.id === updatedUser.id || u.phone === updatedUser.phone ? updatedUser : u
      )
      localStorage.setItem('kisan_registered_users', JSON.stringify(updatedList))
    } catch {
      // ignore
    }

    setIsEditing(false)
    setSuccessMsg('✅ Personal details and delivery profile updated successfully!')
  }

  const handleLogout = () => {
    localStorage.removeItem('kisan_user')
    alert('You have been logged out of Kisan Mitra.')
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-4xl shadow-sm font-bold">
                {user.role === 'FARMER' ? '🌾' : user.role === 'ADMIN' ? '👑' : '👤'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    {user.name}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.role === 'FARMER'
                        ? 'bg-green-100 text-green-800'
                        : user.role === 'ADMIN'
                        ? 'bg-slate-900 text-white'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role === 'FARMER'
                      ? '🌾 Farmer'
                      : user.role === 'ADMIN'
                      ? '👑 Admin'
                      : '🛒 Buyer'}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Member ID: <span className="font-mono font-bold text-gray-700">#{user.id || 'KM101'}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  📞 {user.phone} {user.email && `| ✉️ ${user.email}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border-2 border-green-600 text-green-700 font-bold rounded-xl hover:bg-green-50 transition text-sm cursor-pointer"
              >
                {isEditing ? 'Cancel Editing' : '✏️ Edit Profile'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 border border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-50 transition text-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Success Message Banner */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-semibold shadow-sm">
            {successMsg}
          </div>
        )}

        {/* Profile Details Form / Display */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Account Overview & Shortcuts */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>⚡</span> Account Shortcuts
              </h2>
              <div className="space-y-3">
                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50/50 transition"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    📦 My Placed Orders
                  </span>
                  <span className="text-green-700 font-bold text-sm">→</span>
                </Link>

                <Link
                  to="/marketplace"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50/50 transition"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    🌾 Browse Marketplace
                  </span>
                  <span className="text-green-700 font-bold text-sm">→</span>
                </Link>

                <Link
                  to="/order-tracking"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50/50 transition"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    🚚 Live Order Tracking
                  </span>
                  <span className="text-green-700 font-bold text-sm">→</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50 text-red-800 transition"
                  >
                    <span className="text-sm font-bold">👑 Admin Control Center</span>
                    <span className="font-bold text-sm">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Personal & Delivery Address Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Edit Personal & Address Details' : 'Personal & Delivery Profile'}
                </h2>
                <span className="text-xs text-gray-500">
                  {isEditing ? 'Editing Mode' : 'View Only'}
                </span>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Street Address / House / Locality *
                    </label>
                    <textarea
                      rows="2"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House No., Street, Village, Landmark..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      {user.role === 'FARMER' ? 'Primary Crops Grown' : 'Buyer Category'}
                    </label>
                    <input
                      type="text"
                      name="cropOrBusiness"
                      value={formData.cropOrBusiness}
                      onChange={handleChange}
                      placeholder={user.role === 'FARMER' ? 'e.g. Wheat, Basmati Rice' : 'e.g. Household Consumer'}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm transition cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg text-sm transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Full Name
                      </p>
                      <p className="mt-1 font-bold text-gray-900 text-base">
                        {formData.name || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Mobile Phone Number
                      </p>
                      <p className="mt-1 font-semibold text-gray-900 text-base">
                        {formData.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Email Address
                      </p>
                      <p className="mt-1 text-gray-700 text-sm">
                        {formData.email || 'None provided'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {user.role === 'FARMER' ? 'Crops Cultivated' : 'Buyer Type'}
                      </p>
                      <p className="mt-1 text-gray-700 text-sm font-semibold">
                        {formData.cropOrBusiness || 'General'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Primary Delivery & Shipping Address
                    </p>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="font-semibold text-gray-900 text-sm">
                        {formData.address || 'No address set yet. Click "Edit Profile" to add.'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.city && `${formData.city}, `}
                        {formData.state && `${formData.state} `}
                        {formData.pincode && `- ${formData.pincode}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-green-400">Kissan Mitra</h2>
          <p className="mt-2 text-gray-400">
            Connecting farmers directly with buyers.
          </p>
          <p className="mt-5 text-gray-500 text-sm">
            © 2026 Kissan Mitra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Profile
