import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCropImage } from '../utils/cropImages'

const DEFAULT_CROPS = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
    name: 'Potato',
    image: '/images/crops/potato.jpg',
    emoji: '🥔',
    price: '₹28 / kg',
    quantity: '1000 kg',
    stockKg: 1000,
    inStock: true,
    farmer: 'Mohan Singh',
    location: 'Jamshedpur, Jharkhand',
    category: 'Vegetables',
  },
  {
    id: 4,
    name: 'Tomato',
    image: '/images/crops/tomato.jpg',
    emoji: '🍅',
    price: '₹35 / kg',
    quantity: '400 kg',
    stockKg: 400,
    inStock: true,
    farmer: 'Amit Kumar',
    location: 'Ranchi, Jharkhand',
    category: 'Vegetables',
  },
  {
    id: 5,
    name: 'Onion',
    image: '/images/crops/onion.jpg',
    emoji: '🧅',
    price: '₹30 / kg',
    quantity: '700 kg',
    stockKg: 700,
    inStock: true,
    farmer: 'Rajesh Kumar',
    location: 'Bokaro, Jharkhand',
    category: 'Vegetables',
  },
  {
    id: 6,
    name: 'Maize',
    image: '/images/crops/maize.jpg',
    emoji: '🌽',
    price: '₹25 / kg',
    quantity: '600 kg',
    stockKg: 600,
    inStock: true,
    farmer: 'Vijay Kumar',
    location: 'Dumka, Jharkhand',
    category: 'Grains',
  },
  {
    id: 7,
    name: 'Mango (Desi)',
    image: '/images/crops/mango.jpg',
    emoji: '🥭',
    price: '₹60 / kg',
    quantity: '0 kg',
    stockKg: 0,
    inStock: false, // Out of stock example
    farmer: 'Arun Kumar',
    location: 'Deoghar, Jharkhand',
    category: 'Fruits',
  },
  {
    id: 8,
    name: 'Cabbage',
    image: '/images/crops/cabbage.jpg',
    emoji: '🥬',
    price: '₹22 / kg',
    quantity: '450 kg',
    stockKg: 450,
    inStock: true,
    farmer: 'Deepak Kumar',
    location: 'Giridih, Jharkhand',
    category: 'Vegetables',
  },
]

function Marketplace() {
  const navigate = useNavigate()
  const [cropsList, setCropsList] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kisan_listed_crops')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure every crop has its real image
        const withImages = parsed.map((c) => ({
          ...c,
          image: c.image || getCropImage(c),
        }))
        setCropsList(withImages)
      } else {
        localStorage.setItem('kisan_listed_crops', JSON.stringify(DEFAULT_CROPS))
        setCropsList(DEFAULT_CROPS)
      }
    } catch {
      setCropsList(DEFAULT_CROPS)
    }
  }, [])

  const filteredCrops = cropsList.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      crop.location.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || crop.category === category

    return matchesSearch && matchesCategory
  })

  const handleBuyNow = (crop) => {
    // Check if in stock
    const isAvailable = crop.inStock !== false && crop.quantity !== '0 kg' && (crop.stockKg === undefined || crop.stockKg > 0)
    if (!isAvailable) {
      alert(`⚠️ "${crop.name}" is currently Out of Stock with local farmers. Please select an available produce.`)
      return
    }

    const numericPrice = Number(crop.price.replace(/[^0-9]/g, ''))
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = existingCart.find((item) => item.id === crop.id)

    let updatedCart
    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item.id === crop.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: crop.id,
          name: crop.name,
          image: crop.image || getCropImage(crop),
          emoji: crop.emoji,
          price: numericPrice,
          farmer: crop.farmer,
          location: crop.location,
          category: crop.category,
          quantity: 1,
        },
      ]
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart))

    const activeUser = localStorage.getItem('kisan_user')
    if (!activeUser) {
      alert(`🌾 ${crop.name} added to your cart!\n\nPlease log in to your Kisan Mitra account to complete your checkout.`)
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* ================= HEADER ================= */}
        <section className="bg-green-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <h1 className="text-4xl md:text-5xl font-bold">Marketplace</h1>
            <p className="mt-3 text-green-100 text-lg">
              Fresh farm crops listed directly by local farmers with live stock availability.
            </p>
          </div>
        </section>

        {/* ================= SEARCH & FILTER ================= */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Crops & Harvest
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search rice, wheat, potato, mango..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Produce Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Grains">Grains (अनाज)</option>
                  <option value="Vegetables">Vegetables (सब्जियां)</option>
                  <option value="Fruits">Fruits (फल)</option>
                  <option value="Pulses">Pulses (दालें)</option>
                  <option value="Spices">Spices (मसाले)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MARKETPLACE CONTENT ================= */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          {/* Result Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Available Farm Produce
              </h2>
              <p className="mt-1 text-gray-500 text-sm">
                Showing {filteredCrops.length} listed crops from verified farmers
              </p>
            </div>
          </div>

          {/* Crop Cards */}
          {filteredCrops.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCrops.map((crop) => {
                const isAvailable =
                  crop.inStock !== false &&
                  crop.quantity !== '0 kg' &&
                  (crop.stockKg === undefined || crop.stockKg > 0)

                return (
                  <div
                    key={crop.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Crop Real Image & Stock Badge */}
                      <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                        <img
                          src={crop.image || getCropImage(crop)}
                          alt={crop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div
                          className="w-full h-full items-center justify-center bg-green-50"
                          style={{ display: 'none' }}
                        >
                          <span className="text-7xl">{crop.emoji || '🌾'}</span>
                        </div>

                        {isAvailable ? (
                          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold shadow-md">
                            ✓ In Stock
                          </span>
                        ) : (
                          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-red-600 text-white font-bold shadow-md">
                            ❌ Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {crop.name}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
                            {crop.category}
                          </span>
                        </div>

                        {/* Price */}
                        <p className="mt-3 text-2xl font-extrabold text-green-700">
                          {crop.price}
                        </p>

                        {/* Quantity */}
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-gray-500">Available Stock:</span>
                          <span
                            className={`font-bold ${
                              isAvailable ? 'text-gray-800' : 'text-red-600'
                            }`}
                          >
                            {crop.quantity}
                          </span>
                        </div>

                        {/* Farmer */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            👨‍🌾 {crop.farmer}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 truncate">
                            📍 {crop.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="p-5 pt-0 mt-3 flex gap-2">
                      <Link
                        to={`/product/${crop.id}`}
                        className="flex-1 px-3 py-2 border border-green-600 text-green-700 rounded-xl font-bold hover:bg-green-50 transition text-center text-xs"
                      >
                        Details
                      </Link>

                      {isAvailable ? (
                        <button
                          type="button"
                          onClick={() => handleBuyNow(crop)}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition text-xs cursor-pointer shadow-xs"
                        >
                          Buy Now
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-400 rounded-xl font-bold text-xs cursor-not-allowed"
                          title="This crop has not been listed or is out of harvest stock"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* No Results */
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <div className="text-6xl">🔍</div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">
                No crops found
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                Farmers have not listed crops matching your search yet.
              </p>
            </div>
          )}
        </section>
      </div>

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

export default Marketplace
