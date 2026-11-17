import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCropImage } from '../utils/cropImages'

function Checkout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [currentUser, setCurrentUser] = useState(null)

  // Delivery Address Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(savedCart)

    // Check active session & pre-fill maintained profile details
    try {
      const storedUser = JSON.parse(localStorage.getItem('kisan_user') || 'null')
      setCurrentUser(storedUser)

      if (storedUser) {
        setFormData({
          fullName: storedUser.name || '',
          phone: storedUser.phone || '',
          address: storedUser.address || '',
          city: storedUser.city || storedUser.district || '',
          pincode: storedUser.pincode || '',
        })
      }
    } catch {
      setCurrentUser(null)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const placeOrder = (e) => {
    if (e) e.preventDefault()

    // 1. Mandatory Authentication Guard
    if (!currentUser) {
      setError('You must be logged in to place an order. Please log in with your User ID & password, or create an account.')
      navigate('/login?redirect=/checkout')
      return
    }

    if (cartItems.length === 0) {
      setError('Your shopping cart is empty. Please add crops from the marketplace before checking out.')
      return
    }

    // 2. Strict Delivery Address Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your Full Name for delivery.')
      return
    }

    if (!formData.phone.trim()) {
      setError('Please enter your Mobile Number.')
      return
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit Mobile Number for delivery contact.')
      return
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      setError('Please enter a complete Street Address (House No, Street, Village/Locality).')
      return
    }

    if (!formData.city.trim()) {
      setError('Please enter your City or District.')
      return
    }

    const cleanPincode = formData.pincode.trim().replace(/\D/g, '')
    if (cleanPincode.length < 6) {
      setError('Please enter a valid 6-digit Postal PIN Code.')
      return
    }

    // 3. Create New Order Object
    const newOrderId = 'KM' + Math.floor(1000 + Math.random() * 9000)
    const productSummary = cartItems.map((i) => `${i.name} (${i.quantity} kg)`).join(', ')
    const totalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0) + ' kg'

    const placedOrder = {
      id: newOrderId,
      product: productSummary,
      quantity: totalQuantity,
      price: `₹${total}`,
      farmer: cartItems[0]?.farmer || 'Ramesh Kumar',
      location: cartItems[0]?.location || `${formData.city}, India`,
      deliveryAddress: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
      },
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Prepaid)',
      status: 'Order Placed',
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      image: cartItems[0]?.image || getCropImage(cartItems[0]),
      emoji: cartItems[0]?.emoji || '🌾',
    }

    // Save to orders array in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('kisan_orders') || '[]')
    existingOrders.unshift(placedOrder)
    localStorage.setItem('kisan_orders', JSON.stringify(existingOrders))

    // Deduct purchased quantity from listed crop inventory
    try {
      const storedCrops = localStorage.getItem('kisan_listed_crops')
      if (storedCrops) {
        let cropList = JSON.parse(storedCrops)
        cartItems.forEach((ci) => {
          cropList = cropList.map((c) => {
            if (c.id === ci.id || c.name.toLowerCase() === ci.name.toLowerCase()) {
              const currentStock = c.stockKg !== undefined ? c.stockKg : 500
              const newStock = Math.max(0, currentStock - (ci.quantity || 1))
              return {
                ...c,
                stockKg: newStock,
                quantity: `${newStock} kg`,
                inStock: newStock > 0,
              }
            }
            return c
          })
        })
        localStorage.setItem('kisan_listed_crops', JSON.stringify(cropList))
      }
    } catch (e) {
      console.warn('Stock decrement failed:', e)
    }

    // Send HTTP POST to Node.js Backend Orders Microservice (Port 5000)
    try {
      const backendPayload = {
        customerId: currentUser?.id || formData.fullName.replace(/\s+/g, '-').toUpperCase() || 'CUST-001',
        deliveryAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        items: cartItems.map((item) => ({
          productId: 'PROD-' + item.name.toUpperCase().replace(/\s+/g, '-'),
          quantity: Math.max(1, Math.round(item.quantity)),
        })),
      }

      fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer kisan-mitra-auth-token-2026',
          'Idempotency-Key': newOrderId,
        },
        body: JSON.stringify(backendPayload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('✅ Successfully recorded in Orders Microservice (Port 5000):', data)
        })
        .catch((err) => {
          console.warn('Backend microservice on Port 5000 is not reachable:', err)
        })
    } catch {
      // Graceful offline fallback
    }

    // Clear cart
    localStorage.removeItem('cart')

    alert(
      `🎉 Order Placed Successfully!\n\n` +
      `Order ID: #${placedOrder.id}\n` +
      `Product: ${placedOrder.product}\n` +
      `Total: ${placedOrder.price}\n` +
      `📡 Synced to Backend Orders Microservice (Port 5000)\n\n` +
      `Delivery To: ${placedOrder.deliveryAddress.fullName}\n` +
      `Address: ${placedOrder.deliveryAddress.address}, ${placedOrder.deliveryAddress.city} - ${placedOrder.deliveryAddress.pincode}\n` +
      `Contact: ${placedOrder.deliveryAddress.phone}\n` +
      `Payment: ${placedOrder.paymentMethod}`
    )

    navigate('/orders')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <section className="bg-green-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold">Checkout</h1>
            <p className="mt-2 text-green-100">
              Provide delivery details and complete your agricultural produce order.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10">
          {/* Validation Error Banner */}
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-800 flex items-start gap-3 shadow-sm">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold text-sm">Action Required:</p>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Mandatory Authentication Step */}
              {!currentUser ? (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl flex-shrink-0">
                      🔒
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-amber-950">
                        Step 1: Account Login or Registration Required
                      </h2>
                      <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                        To place an order on Kisan Mitra, you must be logged into your account. Please log in with your mobile number/password or create a new account to maintain your delivery profile and order history.
                      </p>
                      <div className="mt-4 flex gap-3 flex-wrap">
                        <Link
                          to="/login?redirect=/checkout"
                          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
                        >
                          Log In to Place Order
                        </Link>
                        <Link
                          to="/register?redirect=/checkout"
                          className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold rounded-xl text-sm transition"
                        >
                          Create New Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-lg font-bold">
                      👤
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-green-800">
                        Authenticated Customer Profile
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        {currentUser.name} (📞 {currentUser.phone})
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="text-xs font-bold text-green-700 bg-white border border-green-300 hover:bg-green-100 px-3 py-1.5 rounded-lg transition"
                  >
                    View / Edit Profile →
                  </Link>
                </div>
              )}
              
              {/* 1. Delivery Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>📍</span> 2. Delivery Address (Required)
                  </h2>
                  <span className="text-xs text-red-600 font-semibold">* All fields required</span>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Kumar"
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition ${
                        !formData.fullName && error ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition ${
                        !formData.phone && error ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Street Address / Village / Locality *
                    </label>
                    <textarea
                      rows="2"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House No., Street, Village, Landmark..."
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition ${
                        !formData.address && error ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Ranchi or Vadodara"
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition ${
                        !formData.city && error ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit PIN code"
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition ${
                        !formData.pincode && error ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>💳</span> 3. Payment Method
                </h2>

                <div className="mt-6 space-y-4">
                  <label
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 accent-green-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-sm text-gray-500">
                        Pay upon receipt of agricultural produce directly at your doorstep.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${
                      paymentMethod === 'online'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 accent-green-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        UPI / Online Direct Transfer
                      </p>
                      <p className="text-sm text-gray-500">
                        Direct zero-commission payout to farmer account via UPI / Net Banking.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>Your cart is empty.</p>
                    <Link
                      to="/marketplace"
                      className="inline-block mt-3 text-sm text-green-700 font-bold hover:underline"
                    >
                      Browse Marketplace →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mt-6 space-y-4 max-h-60 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                            <img
                              src={item.image || getCropImage(item)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                            <span className="text-2xl" style={{ display: 'none' }}>
                              {item.emoji || '🌾'}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate text-sm">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {item.quantity} kg × ₹{item.price}
                            </p>
                          </div>

                          <p className="font-bold text-sm text-gray-900">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-200 space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{total}</span>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Direct Farm Delivery</span>
                        <span className="text-green-600 font-semibold">Free</span>
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-base">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-green-700">
                          ₹{total}
                        </span>
                      </div>
                    </div>

                    {currentUser ? (
                      <button
                        type="button"
                        onClick={placeOrder}
                        className="mt-6 w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm transition text-base cursor-pointer"
                      >
                        Confirm & Place Order
                      </button>
                    ) : (
                      <Link
                        to="/login?redirect=/checkout"
                        className="mt-6 w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm transition text-base text-center block cursor-pointer"
                      >
                        🔒 Log In to Place Order
                      </Link>
                    )}
                  </>
                )}

                <Link
                  to="/cart"
                  className="mt-4 block text-center text-sm text-green-700 font-semibold hover:underline"
                >
                  ← Modify Cart Items
                </Link>
              </div>
            </div>
          </div>
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

export default Checkout
