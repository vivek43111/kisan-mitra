import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getCropImage } from '../utils/cropImages'

const DEFAULT_PRODUCTS = {
  1: {
    name: 'Rice (Basmati)',
    image: '/images/crops/rice.jpg',
    emoji: '🌾',
    price: '₹45 / kg',
    quantity: '500 kg',
    stockKg: 500,
    inStock: true,
    farmer: 'Ramesh Kumar',
    location: 'Ranchi, Jharkhand',
    category: 'Grains',
    description:
      'Fresh quality rice directly supplied by the farmer. Suitable for household and bulk requirements.',
  },
  2: {
    name: 'Sharbati Wheat',
    image: '/images/crops/wheat.jpg',
    emoji: '🌾',
    price: '₹32 / kg',
    quantity: '800 kg',
    stockKg: 800,
    inStock: true,
    farmer: 'Suresh Kumar',
    location: 'Hazaribagh, Jharkhand',
    category: 'Grains',
    description:
      'Good quality wheat harvested from the farm and available for direct purchase.',
  },
  3: {
    name: 'Farm Fresh Potato',
    image: '/images/crops/potato.jpg',
    emoji: '🥔',
    price: '₹28 / kg',
    quantity: '1000 kg',
    stockKg: 1000,
    inStock: true,
    farmer: 'Mohan Singh',
    location: 'Jamshedpur, Jharkhand',
    category: 'Vegetables',
    description:
      'Fresh farm potatoes available for household and bulk buyers.',
  },
  4: {
    name: 'Organic Tomato',
    image: '/images/crops/tomato.jpg',
    emoji: '🍅',
    price: '₹35 / kg',
    quantity: '400 kg',
    stockKg: 400,
    inStock: true,
    farmer: 'Amit Kumar',
    location: 'Ranchi, Jharkhand',
    category: 'Vegetables',
    description:
      'Fresh tomatoes directly from the farm with good quality and freshness.',
  },
  5: {
    name: 'Red Onion',
    image: '/images/crops/onion.jpg',
    emoji: '🧅',
    price: '₹30 / kg',
    quantity: '700 kg',
    stockKg: 700,
    inStock: true,
    farmer: 'Rajesh Kumar',
    location: 'Bokaro, Jharkhand',
    category: 'Vegetables',
    description:
      'Organic red onions with strong aroma and long shelf life directly sourced from local fields.',
  },
  6: {
    name: 'Yellow Sweet Maize',
    image: '/images/crops/maize.jpg',
    emoji: '🌽',
    price: '₹25 / kg',
    quantity: '600 kg',
    stockKg: 600,
    inStock: true,
    farmer: 'Vijay Kumar',
    location: 'Dumka, Jharkhand',
    category: 'Grains',
    description:
      'High-grade sweet yellow corn/maize suitable for commercial milling or direct consumer use.',
  },
  7: {
    name: 'Desi Mango',
    image: '/images/crops/mango.jpg',
    emoji: '🥭',
    price: '₹60 / kg',
    quantity: '0 kg',
    stockKg: 0,
    inStock: false, // Out of stock
    farmer: 'Arun Kumar',
    location: 'Deoghar, Jharkhand',
    category: 'Fruits',
    description:
      'Naturally ripened, pesticide-free mangoes directly packed from farm orchards.',
  },
  8: {
    name: 'Green Cabbage',
    image: '/images/crops/cabbage.jpg',
    emoji: '🥬',
    price: '₹22 / kg',
    quantity: '450 kg',
    stockKg: 450,
    inStock: true,
    farmer: 'Deepak Kumar',
    location: 'Giridih, Jharkhand',
    category: 'Vegetables',
    description:
      'Farm fresh, crisp green cabbages harvested daily morning for maximum nutrition.',
  },
}

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedQty, setSelectedQty] = useState(1)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kisan_listed_crops')
      if (stored) {
        const list = JSON.parse(stored)
        const found = list.find((item) => String(item.id) === String(id))
        if (found) {
          setProduct(found)
          return
        }
      }
    } catch {
      // fallback
    }

    if (DEFAULT_PRODUCTS[id]) {
      setProduct({ ...DEFAULT_PRODUCTS[id], id: Number(id) })
    } else {
      setProduct(null)
    }
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="text-7xl">🔍</div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="mt-3 text-gray-500">
            This produce has either been removed or is no longer listed by farmers.
          </p>
          <Link
            to="/marketplace"
            className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const isAvailable =
    product.inStock !== false &&
    product.quantity !== '0 kg' &&
    (product.stockKg === undefined || product.stockKg > 0)

  const numericPrice = Number(String(product.price).replace(/[^0-9]/g, ''))

  const handleAddToCart = () => {
    if (!isAvailable) {
      alert('This crop is currently out of stock with local farmers.')
      return
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = existingCart.findIndex((item) => item.id === Number(id))

    let updatedCart
    if (existingIndex > -1) {
      updatedCart = [...existingCart]
      updatedCart[existingIndex].quantity += selectedQty
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: Number(id),
          name: product.name,
          image: product.image || getCropImage(product),
          emoji: product.emoji,
          price: numericPrice,
          farmer: product.farmer,
          location: product.location,
          category: product.category,
          quantity: selectedQty,
        },
      ]
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    navigate('/cart')
  }

  const handleBuyNow = () => {
    if (!isAvailable) {
      alert('This crop is currently out of stock with local farmers.')
      return
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = existingCart.findIndex((item) => item.id === Number(id))

    let updatedCart
    if (existingIndex > -1) {
      updatedCart = [...existingCart]
      updatedCart[existingIndex].quantity += selectedQty
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: Number(id),
          name: product.name,
          image: product.image || getCropImage(product),
          emoji: product.emoji,
          price: numericPrice,
          farmer: product.farmer,
          location: product.location,
          category: product.category,
          quantity: selectedQty,
        },
      ]
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart))

    const activeUser = localStorage.getItem('kisan_user')
    if (!activeUser) {
      alert(`🌾 ${product.name} added to your cart!\n\nPlease log in to your Kisan Mitra account to complete your checkout.`)
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* ================= PRODUCT DETAILS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Back Button */}
        <Link
          to="/marketplace"
          className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition"
        >
          ← Back to Marketplace
        </Link>

        <div className="mt-8 grid md:grid-cols-2 gap-10">
          {/* ================= PRODUCT IMAGE ================= */}
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 flex items-center justify-center border border-gray-200">
            <div className="h-[360px] sm:h-[400px] w-full rounded-2xl bg-gray-100 relative overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={product.image || getCropImage(product)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none'
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="w-full h-full items-center justify-center bg-green-50" style={{ display: 'none' }}>
                <span className="text-[130px]">{product.emoji || '🌾'}</span>
              </div>
              {!isAvailable && (
                <span className="absolute top-4 right-4 bg-red-600 text-white font-bold text-xs uppercase px-3.5 py-1.5 rounded-full shadow-md">
                  ❌ Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* ================= PRODUCT INFORMATION ================= */}
          <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col justify-between border border-gray-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  {product.category}
                </span>
                {isAvailable ? (
                  <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                    ✓ In Stock (Live Farm Harvest)
                  </span>
                ) : (
                  <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                    ❌ Currently Out of Stock
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              <p className="mt-3 text-3xl font-extrabold text-green-700">
                {product.price}
              </p>

              {/* Stock info */}
              <div className="mt-6 p-4 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Listed Stock Available
                  </p>
                  <p
                    className={`mt-0.5 text-lg font-bold ${
                      isAvailable ? 'text-gray-900' : 'text-red-600'
                    }`}
                  >
                    {product.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Delivery Partner Transit
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-green-700">
                    24-48 Hours (Farm to Door)
                  </p>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h2 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                  Direct From Farmer
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xl">👨‍🌾</span>
                  <span className="font-bold text-gray-800 text-base">
                    {product.farmer}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                  <span>📍</span> {product.location}
                </p>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h2 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                  Harvest Quality & Notes
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description ||
                    'Direct farm produce harvested at peak freshness with fair-trade farmer compensation.'}
                </p>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isAvailable ? (
                <>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Purchase Quantity:
                  </label>

                  <div className="flex items-center gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 border border-gray-300 rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                    >
                      −
                    </button>

                    <div className="w-24 h-11 border border-gray-300 rounded-lg flex items-center justify-center font-bold text-lg bg-gray-50">
                      {selectedQty} kg
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedQty((q) => q + 1)}
                      className="w-11 h-11 border border-gray-300 rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                    >
                      +
                    </button>

                    <span className="text-sm text-gray-500">
                      Subtotal:{' '}
                      <strong className="text-green-700">
                        ₹{numericPrice * selectedQty}
                      </strong>
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="py-3 px-6 border-2 border-green-600 text-green-700 rounded-xl font-bold hover:bg-green-50 transition cursor-pointer text-center"
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="py-3 px-6 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition cursor-pointer text-center shadow-sm"
                    >
                      ⚡ Buy Now
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
                  <p className="font-bold text-red-700 text-base">
                    ❌ Harvest Out of Stock
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    The farmer has exhausted current stock for this crop. Please explore other available produce.
                  </p>
                  <Link
                    to="/marketplace"
                    className="mt-3 inline-block px-5 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition"
                  >
                    Browse Available Crops →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
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

export default ProductDetails
