import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCropImage } from '../utils/cropImages'

function DeliveryDashboard() {
  const navigate = useNavigate()
  const [deliveryUser, setDeliveryUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('kisan_user')
    if (!storedUser) {
      alert('🔒 Please log in as Delivery Partner to access logistics.')
      navigate('/login?redirect=/delivery-partner')
      return
    }

    try {
      const parsed = JSON.parse(storedUser)
      setDeliveryUser(parsed)

      // Load orders
      const savedOrders = JSON.parse(localStorage.getItem('kisan_orders') || '[]')
      if (savedOrders.length > 0) {
        setOrders(savedOrders)
      } else {
        // Sample orders for logistics testing
        const sampleDeliveries = [
          {
            id: 'KM1001',
            product: 'Rice (50 kg), Sharbati Wheat (20 kg)',
            quantity: '70 kg',
            price: '₹2,890',
            farmer: 'Ramesh Kumar (Farm #12, GT Road, Punjab)',
            location: 'Punjab Mandi',
            deliveryAddress: {
              fullName: 'Pooja Sharma',
              phone: '9123456789',
              address: 'B-402, Green Avenue, Alkapuri',
              city: 'Vadodara',
              pincode: '390007',
            },
            status: 'In Transit',
            date: 'Today',
            emoji: '🌾',
          },
          {
            id: 'KM1002',
            product: 'Organic Tomato (25 kg)',
            quantity: '25 kg',
            price: '₹875',
            farmer: 'Amit Kumar (Ranchi Farms)',
            location: 'Ranchi Mandi',
            deliveryAddress: {
              fullName: 'Rajesh Kirana Store',
              phone: '9822334455',
              address: 'Station Road, Market Square',
              city: 'Surat',
              pincode: '395003',
            },
            status: 'Order Placed',
            date: 'Today',
            emoji: '🍅',
          },
        ]
        localStorage.setItem('kisan_orders', JSON.stringify(sampleDeliveries))
        setOrders(sampleDeliveries)
      }
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const updateOrderStatus = (orderId, nextStatus) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStatus,
        }
      }
      return o
    })

    setOrders(updated)
    localStorage.setItem('kisan_orders', JSON.stringify(updated))

    setSuccessMsg(`✅ Order #${orderId} updated to "${nextStatus}" in real-time!`)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  if (!deliveryUser) return null

  const activeCount = orders.filter((o) => o.status !== 'Delivered').length
  const completedCount = orders.filter((o) => o.status === 'Delivered').length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-3xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
                  🚚 Delivery Partner Hub (लॉजिस्टिक्स पोर्टल)
                </span>
                <span className="text-xs text-blue-200">
                  Farm-to-Doorstep Fulfillment
                </span>
              </div>
              <h1 className="text-3xl font-extrabold mt-3">
                {deliveryUser.name} — Logistics Control
              </h1>
              <p className="text-blue-100 text-sm mt-1 max-w-2xl">
                Pick up fresh produce directly from farmers' fields and deliver safely to buyers with real-time status syncing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-2 rounded-xl bg-blue-700/60 border border-blue-400/30 text-xs font-bold text-blue-100">
                Logistics ID: #{deliveryUser.id || 'DLV8801'}
              </span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold shadow-sm">
            {successMsg}
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Pending Pickups & Transit
              </span>
              <span className="text-2xl">📦</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-blue-700">
              {activeCount} Active
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Requiring farm collection or delivery
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Delivered Produce
              </span>
              <span className="text-2xl">✅</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-emerald-700">
              {completedCount} Completed
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Verified doorstep handovers
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Avg Delivery Time
              </span>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">
              24-36 Hours
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Direct farm-to-table transit
            </p>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
            <span>📋 Farm Pickup & Buyer Delivery Route Pipeline</span>
            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 rounded-full text-gray-600">
              Total Shipments: {orders.length}
            </span>
          </h2>

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition bg-white"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                      <img
                        src={order.image || getCropImage({ name: order.product || '' })}
                        alt={order.product || 'Crop'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <span className="text-2xl" style={{ display: 'none' }}>{order.emoji || '🌾'}</span>
                    </div>
                    <div>
                      <span className="font-mono text-sm font-extrabold text-blue-700">
                        #{order.id}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base">
                        {order.product} ({order.quantity})
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Picked Up from Farm'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      ● {order.status}
                    </span>
                    <span className="text-xs text-gray-500 font-bold">
                      Payout: {order.price}
                    </span>
                  </div>
                </div>

                {/* Pickup & Destination Routing Box */}
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  {/* Farm Pickup */}
                  <div className="p-4 rounded-xl bg-green-50/70 border border-green-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-800 flex items-center gap-1.5 mb-1">
                      <span>🚜</span> Farm Pickup Location
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      👨‍🌾 {order.farmer}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      📍 {order.location || 'Local Registered Farm'}
                    </p>
                  </div>

                  {/* Buyer Drop-off */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5 mb-1">
                      <span>📍</span> Buyer Delivery Destination
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      👤 {order.deliveryAddress?.fullName || 'Registered Buyer'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      🏡 {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                    </p>
                    <p className="text-xs text-blue-700 font-semibold mt-1">
                      📞 {order.deliveryAddress?.phone || 'Contact provided on order'}
                    </p>
                  </div>
                </div>

                {/* Live Action Status Controls for Delivery Partner */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-gray-500">
                    Update Order Transit Status:
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'Picked Up from Farm')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'Picked Up from Farm'
                          ? 'bg-amber-600 text-white'
                          : 'border border-amber-300 text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      🚜 Mark Picked Up
                    </button>

                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'In Transit')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'In Transit'
                          ? 'bg-blue-600 text-white'
                          : 'border border-blue-300 text-blue-800 hover:bg-blue-50'
                      }`}
                    >
                      🚚 Mark In Transit
                    </button>

                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-600 text-white'
                          : 'border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      ✅ Mark Delivered
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-green-400">Kissan Mitra</h2>
          <p className="mt-2 text-gray-400">
            Logistics & cold chain delivery connecting rural farms to urban consumers.
          </p>
          <p className="mt-5 text-gray-500 text-sm">
            © 2026 Kissan Mitra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default DeliveryDashboard
