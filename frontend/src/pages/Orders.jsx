import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCropImage } from '../utils/cropImages'

function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // 1. Load local orders first
    const savedOrders = JSON.parse(localStorage.getItem('kisan_orders') || '[]')
    if (savedOrders && savedOrders.length > 0) {
      setOrders(savedOrders)
    } else {
      setOrders([
        {
          id: 'KM1001',
          product: 'Rice (1 kg)',
          image: '/images/crops/rice.jpg',
          quantity: '1 kg',
          price: '₹45',
          farmer: 'Ramesh Kumar',
          location: 'Ranchi, Jharkhand',
          status: 'Order Placed',
          emoji: '🌾',
          date: 'Today',
        },
      ])
    }

    // 2. Query live Node.js Orders Microservice on Port 5000
    fetch('http://localhost:5000/orders')
      .then((res) => res.json())
      .then((backendOrders) => {
        if (Array.isArray(backendOrders) && backendOrders.length > 0) {
          const formatted = backendOrders.map((bo) => ({
            id: bo.id,
            product: bo.items?.map((i) => i.productId).join(', ') || 'Agricultural Produce',
            quantity: bo.items?.reduce((s, i) => s + (i.quantity || 1), 0) + ' kg',
            price: `₹${bo.totalAmount || 1200}`,
            farmer: 'Registered Farmer',
            location: bo.deliveryAddress || 'Direct Delivery',
            status: bo.status || 'Order Placed',
            emoji: '🌾',
            paymentMethod: 'Cash on Delivery',
          }))

          setOrders((current) => {
            const merged = [...current]
            formatted.forEach((b) => {
              if (!merged.find((m) => m.id === b.id)) {
                merged.unshift(b)
              }
            })
            return merged
          })
        }
      })
      .catch(() => {
        // Backend offline, graceful local fallback already loaded
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <section className="bg-green-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold">My Orders</h1>
            <p className="mt-2 text-green-100">
              Track and manage your verified Kisan Mitra farm orders.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-7xl">📦</div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                No Orders Placed Yet
              </h2>
              <p className="mt-3 text-gray-500">
                Your placed orders and delivery tracking will appear here.
              </p>
              <Link
                to="/marketplace"
                className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Explore Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-xs">
                      <img
                        src={order.image || getCropImage({ name: order.product || '' })}
                        alt={order.product || 'Crop'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <span className="text-5xl" style={{ display: 'none' }}>{order.emoji || '🌾'}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Order Reference
                          </p>
                          <h2 className="text-xl font-extrabold text-gray-900">
                            #{order.id}
                          </h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold w-fit">
                            ✓ {order.status}
                          </span>
                          {order.paymentMethod && (
                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                              {order.paymentMethod}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Crops
                          </p>
                          <p className="mt-1 font-bold text-gray-900 text-sm">
                            {order.product}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Total Quantity
                          </p>
                          <p className="mt-1 font-semibold text-gray-900 text-sm">
                            {order.quantity}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Total Amount
                          </p>
                          <p className="mt-1 font-bold text-green-700 text-base">
                            {order.price}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Farmer / Source
                          </p>
                          <p className="mt-1 font-semibold text-gray-900 text-sm">
                            👨‍🌾 {order.farmer}
                          </p>
                        </div>
                      </div>

                      {order.deliveryAddress ? (
                        <p className="mt-4 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          📍 <strong>Delivery To:</strong> {order.deliveryAddress.fullName},{' '}
                          {order.deliveryAddress.address}, {order.deliveryAddress.city} -{' '}
                          {order.deliveryAddress.pincode} | 📞 {order.deliveryAddress.phone}
                        </p>
                      ) : (
                        <p className="mt-4 text-xs text-gray-500">
                          📍 {order.location}
                        </p>
                      )}
                    </div>

                    <Link
                      to="/order-tracking"
                      className="px-5 py-3 border-2 border-green-600 text-green-700 rounded-xl font-bold hover:bg-green-50 transition text-center text-sm flex-shrink-0"
                    >
                      Track Order →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

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

export default Orders
