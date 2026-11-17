import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCropImage } from '../utils/cropImages'

const DEFAULT_CROPS = [
  {
    id: 1,
    name: 'Rice (Basmati)',
    image: '/images/crops/rice.jpg',
    emoji: '🌾',
    price: '₹45 / kg',
    numericPrice: 45,
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
    numericPrice: 32,
    quantity: '800 kg',
    stockKg: 800,
    inStock: true,
    farmer: 'Suresh Kumar',
    location: 'Hazaribagh, Jharkhand',
    category: 'Grains',
  },
  {
    id: 3,
    name: 'Farm Fresh Potato',
    image: '/images/crops/potato.jpg',
    emoji: '🥔',
    price: '₹28 / kg',
    numericPrice: 28,
    quantity: '1000 kg',
    stockKg: 1000,
    inStock: true,
    farmer: 'Mohan Singh',
    location: 'Jamshedpur, Jharkhand',
    category: 'Vegetables',
  },
  {
    id: 4,
    name: 'Organic Tomato',
    image: '/images/crops/tomato.jpg',
    emoji: '🍅',
    price: '₹35 / kg',
    numericPrice: 35,
    quantity: '400 kg',
    stockKg: 400,
    inStock: true,
    farmer: 'Amit Kumar',
    location: 'Ranchi, Jharkhand',
    category: 'Vegetables',
  },
  {
    id: 5,
    name: 'Red Onion',
    image: '/images/crops/onion.jpg',
    emoji: '🧅',
    price: '₹30 / kg',
    numericPrice: 30,
    quantity: '700 kg',
    stockKg: 700,
    inStock: true,
    farmer: 'Rajesh Kumar',
    location: 'Bokaro, Jharkhand',
    category: 'Vegetables',
  },
  {
    id: 6,
    name: 'Yellow Sweet Maize',
    image: '/images/crops/maize.jpg',
    emoji: '🌽',
    price: '₹25 / kg',
    numericPrice: 25,
    quantity: '600 kg',
    stockKg: 600,
    inStock: true,
    farmer: 'Vijay Kumar',
    location: 'Dumka, Jharkhand',
    category: 'Grains',
  },
  {
    id: 7,
    name: 'Desi Mango',
    image: '/images/crops/mango.jpg',
    emoji: '🥭',
    price: '₹60 / kg',
    numericPrice: 60,
    quantity: '0 kg',
    stockKg: 0,
    inStock: false, // Out of stock example
    farmer: 'Arun Kumar',
    location: 'Deoghar, Jharkhand',
    category: 'Fruits',
  },
  {
    id: 8,
    name: 'Green Cabbage',
    image: '/images/crops/cabbage.jpg',
    emoji: '🥬',
    price: '₹22 / kg',
    numericPrice: 22,
    quantity: '450 kg',
    stockKg: 450,
    inStock: true,
    farmer: 'Deepak Kumar',
    location: 'Giridih, Jharkhand',
    category: 'Vegetables',
  },
]

function FarmerDashboard() {
  const navigate = useNavigate()
  const [farmerUser, setFarmerUser] = useState(null)
  const [cropsList, setCropsList] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [editingCrop, setEditingCrop] = useState(null)
  const [stockToUpdate, setStockToUpdate] = useState('')
  const [priceToUpdate, setPriceToUpdate] = useState('')
  const [aiPriceLoading, setAiPriceLoading] = useState(false)
  const [aiPriceAdvice, setAiPriceAdvice] = useState(null)
  const [aiDescLoading, setAiDescLoading] = useState(false)

  // New Crop Form State
  const [newCrop, setNewCrop] = useState({
    name: '',
    category: 'Grains',
    price: '',
    stockKg: '',
    emoji: '🌾',
    location: '',
    description: '',
  })

  // Load farmer session and crop list
  useEffect(() => {
    const storedUser = localStorage.getItem('kisan_user')
    if (!storedUser) {
      alert('🔒 Please log in as a Farmer to access the Farmer Crop Listing Portal.')
      navigate('/login?redirect=/farmer-dashboard')
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setFarmerUser(parsedUser)

      // Load crops from storage or initialize with defaults
      const storedCrops = localStorage.getItem('kisan_listed_crops')
      if (storedCrops) {
        const parsed = JSON.parse(storedCrops)
        const enriched = parsed.map((c) => ({
          ...c,
          image: c.image || getCropImage(c),
        }))
        setCropsList(enriched)
        localStorage.setItem('kisan_listed_crops', JSON.stringify(enriched))
      } else {
        localStorage.setItem('kisan_listed_crops', JSON.stringify(DEFAULT_CROPS))
        setCropsList(DEFAULT_CROPS)
      }
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const handleAddCrop = (e) => {
    e.preventDefault()

    if (!newCrop.name.trim() || !newCrop.price || !newCrop.stockKg) {
      alert('Please fill in crop name, price, and stock quantity.')
      return
    }

    const priceNum = Number(newCrop.price)
    const stockNum = Number(newCrop.stockKg)

    const newlyCreated = {
      id: Date.now(),
      name: newCrop.name.trim(),
      image: getCropImage({ name: newCrop.name }),
      emoji: newCrop.emoji || '🌾',
      price: `₹${priceNum} / kg`,
      numericPrice: priceNum,
      quantity: `${stockNum} kg`,
      stockKg: stockNum,
      inStock: stockNum > 0,
      farmer: farmerUser?.name || 'Local Verified Farmer',
      location: newCrop.location.trim() || farmerUser?.city || 'Local Farm Mandi',
      category: newCrop.category,
      description: newCrop.description.trim() || 'Fresh farm harvest direct from fields.',
      listedAt: new Date().toISOString(),
    }

    const updated = [newlyCreated, ...cropsList]
    setCropsList(updated)
    localStorage.setItem('kisan_listed_crops', JSON.stringify(updated))

    setShowAddModal(false)
    setNewCrop({
      name: '',
      category: 'Grains',
      price: '',
      stockKg: '',
      emoji: '🌾',
      location: '',
      description: '',
    })

    setSuccessMsg(`🎉 Crop "${newlyCreated.name}" listed successfully! It is now live in the Marketplace for buyers.`)
    setTimeout(() => setSuccessMsg(''), 5000)
  }

  // Toggle in-stock status
  const toggleStock = (id) => {
    const updated = cropsList.map((c) => {
      if (c.id === id) {
        const nextInStock = !c.inStock
        return {
          ...c,
          inStock: nextInStock,
          stockKg: nextInStock ? (c.stockKg > 0 ? c.stockKg : 200) : 0,
          quantity: nextInStock ? (c.stockKg > 0 ? `${c.stockKg} kg` : '200 kg') : '0 kg',
        }
      }
      return c
    })
    setCropsList(updated)
    localStorage.setItem('kisan_listed_crops', JSON.stringify(updated))
  }

  // Delete Crop Listing
  const deleteCrop = (id) => {
    if (window.confirm('Are you sure you want to remove this crop listing from the Marketplace?')) {
      const updated = cropsList.filter((c) => c.id !== id)
      setCropsList(updated)
      localStorage.setItem('kisan_listed_crops', JSON.stringify(updated))
    }
  }

  // AI Mandi Price & Demand Advisor (Port 5004)
  const handleAiPriceAdvice = async () => {
    if (!newCrop.name.trim()) {
      alert('Please enter a crop name first (e.g., Sharbati Wheat, Basmati Rice, Tomato)')
      return
    }
    setAiPriceLoading(true)
    try {
      const res = await fetch('http://localhost:5004/api/ai/price-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: newCrop.name,
          category: newCrop.category,
          stockKg: newCrop.stockKg || 500,
          location: newCrop.location || farmerUser?.city,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setAiPriceAdvice(data)
        setNewCrop((prev) => ({ ...prev, price: data.recommendedPrice }))
      }
    } catch {
      // Offline fallback
      setAiPriceAdvice({
        mspPrice: '₹22.75 / kg',
        mandiBenchmarkRange: '₹28 - ₹35 / kg',
        recommendedPrice: 32,
        profitGainOverMsp: '+40% over wholesale MSP',
        demandRating: 'HIGH',
        strategy: 'AI recommends listing at ₹32/kg for optimal buyer velocity.',
      })
      setNewCrop((prev) => ({ ...prev, price: 32 }))
    } finally {
      setAiPriceLoading(false)
    }
  }

  // AI Auto-Generate Produce Listing Description
  const handleAiGenerateDesc = async () => {
    if (!newCrop.name.trim()) {
      alert('Please enter a crop name first to auto-generate description!')
      return
    }
    setAiDescLoading(true)
    try {
      const res = await fetch('http://localhost:5004/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: newCrop.name,
          category: newCrop.category,
          location: newCrop.location || farmerUser?.city || 'Local Farm',
          farmerName: farmerUser?.name || 'Verified Farmer',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setNewCrop((prev) => ({ ...prev, description: data.description }))
      }
    } catch {
      setNewCrop((prev) => ({
        ...prev,
        description: `Premium quality ${newCrop.name} harvested freshly by ${farmerUser?.name || 'Local Farmer'}. Grown with sustainable farming practices, rich in natural nutrition and flavor with zero middleman delays.`,
      }))
    } finally {
      setAiDescLoading(false)
    }
  }

  // Open modal to update available stock and price
  const openStockModal = (crop) => {
    setEditingCrop(crop)
    setStockToUpdate(crop.stockKg !== undefined ? crop.stockKg : 200)
    const currentPriceNum = crop.numericPrice || Number(String(crop.price).replace(/[^0-9]/g, '')) || 30
    setPriceToUpdate(currentPriceNum)
  }

  // Handle stock update submission
  const handleSaveStock = (e) => {
    e.preventDefault()
    if (!editingCrop) return

    const newStockNum = Math.max(0, Number(stockToUpdate) || 0)
    const newPriceNum = Math.max(1, Number(priceToUpdate) || editingCrop.numericPrice || 10)
    const isNowInStock = newStockNum > 0

    const updated = cropsList.map((c) => {
      if (c.id === editingCrop.id) {
        return {
          ...c,
          stockKg: newStockNum,
          quantity: `${newStockNum} kg`,
          price: `₹${newPriceNum} / kg`,
          numericPrice: newPriceNum,
          inStock: isNowInStock,
        }
      }
      return c
    })

    setCropsList(updated)
    localStorage.setItem('kisan_listed_crops', JSON.stringify(updated))

    // Broadcast PATCH to Node.js Catalogue Microservice (Port 5002)
    fetch(`http://localhost:5002/api/crops/${editingCrop.id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockKg: newStockNum, inStock: isNowInStock }),
    }).catch(() => {})

    setSuccessMsg(
      `✅ Produce "${editingCrop.name}" updated! Available Stock: ${newStockNum} kg, Price: ₹${newPriceNum}/kg (${isNowInStock ? 'In Stock' : 'Out of Stock'}). Synced to Marketplace!`
    )
    setTimeout(() => setSuccessMsg(''), 5000)
    setEditingCrop(null)
  }

  // Quick increment/decrement (+50kg / -50kg)
  const adjustStock = (id, delta) => {
    let cropName = ''
    let nextStock = 0
    const updated = cropsList.map((c) => {
      if (c.id === id) {
        cropName = c.name
        nextStock = Math.max(0, (c.stockKg !== undefined ? c.stockKg : 200) + delta)
        return {
          ...c,
          stockKg: nextStock,
          quantity: `${nextStock} kg`,
          inStock: nextStock > 0,
        }
      }
      return c
    })

    setCropsList(updated)
    localStorage.setItem('kisan_listed_crops', JSON.stringify(updated))

    fetch(`http://localhost:5002/api/crops/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockKg: nextStock, inStock: nextStock > 0 }),
    }).catch(() => {})

    setSuccessMsg(`📦 Available stock for "${cropName}" updated to ${nextStock} kg (${nextStock > 0 ? 'In Stock' : 'Out of Stock'})!`)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  if (!farmerUser) return null

  const inStockCount = cropsList.filter((c) => c.inStock && c.stockKg > 0).length
  const outOfStockCount = cropsList.length - inStockCount

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
        {/* Banner */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 text-white rounded-3xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-500/30 text-green-200 text-xs font-bold uppercase tracking-wider">
                  🌾 Farmer Dashboard (किसान पोर्टल)
                </span>
                <span className="text-xs text-green-200">
                  Seller & Harvest Management
                </span>
              </div>
              <h1 className="text-3xl font-extrabold mt-3">
                Welcome, {farmerUser.name}!
              </h1>
              <p className="text-green-100 text-sm mt-1 max-w-2xl">
                Manage your live crop listings, update harvest stock in real-time, and monitor produce pickups by delivery partners.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <Link
                to="/ai-doctor"
                className="px-5 py-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-white font-bold rounded-2xl border border-emerald-400/40 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer text-sm whitespace-nowrap"
              >
                <span>🍃</span>
                <span>AI Crop Doctor (रोग जांच)</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setAiPriceAdvice(null)
                  setShowAddModal(true)
                }}
                className="px-6 py-3.5 bg-white text-green-800 hover:bg-green-50 font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <span className="text-xl">➕</span>
                <span>List New Crop (फसल जोड़ें)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-8 p-4 rounded-xl bg-green-50 border border-green-300 text-green-800 text-sm font-bold shadow-sm flex items-center justify-between">
            <span>{successMsg}</span>
            <Link to="/marketplace" className="text-green-700 underline text-xs">
              View on Marketplace →
            </Link>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Total Listed Produce
              </span>
              <span className="text-2xl">🌾</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">
              {cropsList.length} Crops
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Displayed in buyer marketplace
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Active In-Stock
              </span>
              <span className="text-2xl">✅</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-green-700">
              {inStockCount} Available
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Ready for buyer purchase & farm pickup
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Out of Stock (स्टॉक समाप्त)
              </span>
              <span className="text-2xl">❌</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-red-600">
              {outOfStockCount} Crops
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Buyers cannot buy until restocked
            </p>
          </div>
        </div>

        {/* Crops Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My Crop Listings & Stock Status
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                If marked "Out of Stock", buyers on the Marketplace cannot purchase the crop.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="px-4 py-2 border border-green-600 text-green-700 hover:bg-green-50 rounded-xl text-xs font-bold transition text-center"
            >
              👁️ View Live Marketplace
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500 tracking-wider">
                  <th className="py-3.5 px-6">Produce</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Mandi Price</th>
                  <th className="py-3.5 px-6">Current Stock</th>
                  <th className="py-3.5 px-6">Buyer Visibility</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {cropsList.map((crop) => (
                  <tr key={crop.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200 shadow-xs">
                          <img
                            src={crop.image || getCropImage(crop)}
                            alt={crop.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <span className="text-2xl" style={{ display: 'none' }}>{crop.emoji || '🌾'}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{crop.name}</p>
                          <p className="text-xs text-gray-500">👨‍🌾 {crop.farmer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {crop.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-green-700 text-base">
                      {crop.price}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{crop.quantity}</span>
                        <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                          <button
                            type="button"
                            title="Decrease available stock by 50 kg"
                            onClick={() => adjustStock(crop.id, -50)}
                            className="w-6 h-6 rounded bg-white hover:bg-red-50 hover:text-red-600 text-gray-700 font-bold text-xs flex items-center justify-center transition cursor-pointer shadow-xs"
                          >
                            −
                          </button>
                          <button
                            type="button"
                            title="Increase available stock by 50 kg"
                            onClick={() => adjustStock(crop.id, 50)}
                            className="w-6 h-6 rounded bg-white hover:bg-green-50 hover:text-green-700 text-gray-700 font-bold text-xs flex items-center justify-center transition cursor-pointer shadow-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {crop.inStock && crop.stockKg > 0 ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center gap-1 w-fit">
                          <span>✓</span> In Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 w-fit">
                          <span>❌</span> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openStockModal(crop)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 border border-blue-300 hover:bg-blue-50 transition cursor-pointer"
                        title="Edit available quantity (kg) and selling price"
                      >
                        ✏️ Update Stock
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStock(crop.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          crop.inStock && crop.stockKg > 0
                            ? 'text-amber-700 border border-amber-300 hover:bg-amber-50'
                            : 'text-green-700 border border-green-300 hover:bg-green-50'
                        }`}
                      >
                        {crop.inStock && crop.stockKg > 0 ? 'Mark Out of Stock' : 'Restock (+200kg)'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCrop(crop.id)}
                        className="px-3 py-1.5 text-xs text-red-600 border border-red-200 hover:bg-red-50 rounded-lg font-bold transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Adding New Crop */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-8 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    🌾 List New Farm Produce
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your crop will be published instantly to buyer marketplace
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCrop} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCrop.name}
                    onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                    placeholder="e.g. Organic Mustard Seeds, Basmati Rice"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newCrop.category}
                      onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="Grains">Grains (अनाज)</option>
                      <option value="Vegetables">Vegetables (सब्जियां)</option>
                      <option value="Fruits">Fruits (फल)</option>
                      <option value="Pulses">Pulses (दालें)</option>
                      <option value="Spices">Spices (मसाले)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Emoji Icon
                    </label>
                    <select
                      value={newCrop.emoji}
                      onChange={(e) => setNewCrop({ ...newCrop, emoji: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="🌾">🌾 Grains / Wheat</option>
                      <option value="🥔">🥔 Potato</option>
                      <option value="🍅">🍅 Tomato</option>
                      <option value="🧅">🧅 Onion</option>
                      <option value="🌽">🌽 Maize / Corn</option>
                      <option value="🥭">🥭 Mango</option>
                      <option value="🥬">🥬 Cabbage / Greens</option>
                      <option value="🥕">🥕 Carrot</option>
                      <option value="🥜">🥜 Mustard / Groundnut</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-gray-700">
                        Selling Price (₹ / kg) *
                      </label>
                      <button
                        type="button"
                        onClick={handleAiPriceAdvice}
                        disabled={aiPriceLoading}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer transition flex items-center gap-1"
                        title="Get smart MSP comparison & optimal pricing advice"
                      >
                        <span>✨</span> {aiPriceLoading ? 'Analyzing...' : 'AI Price Advisor'}
                      </button>
                    </div>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newCrop.price}
                      onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
                      placeholder="e.g. 48"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Stock Quantity (kg) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newCrop.stockKg}
                      onChange={(e) => setNewCrop({ ...newCrop, stockKg: e.target.value })}
                      placeholder="e.g. 600"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {aiPriceAdvice && (
                    <div className="col-span-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 animate-in fade-in">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <span>📈</span> AI Recommended Price: {aiPriceAdvice.formattedRecommended}
                        </span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                          MSP: {aiPriceAdvice.mspPrice} ({aiPriceAdvice.profitGainOverMsp})
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                        {aiPriceAdvice.strategy}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Farm Location / Mandi
                  </label>
                  <input
                    type="text"
                    value={newCrop.location}
                    onChange={(e) => setNewCrop({ ...newCrop, location: e.target.value })}
                    placeholder="e.g. Ludhiana, Punjab or Mehsana, Gujarat"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Harvest Description
                    </label>
                    <button
                      type="button"
                      onClick={handleAiGenerateDesc}
                      disabled={aiDescLoading}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer transition flex items-center gap-1"
                      title="Auto-generate farm description using AI"
                    >
                      <span>✨</span> {aiDescLoading ? 'Writing...' : 'Auto-Write with AI'}
                    </button>
                  </div>
                  <textarea
                    rows="3"
                    value={newCrop.description}
                    onChange={(e) => setNewCrop({ ...newCrop, description: e.target.value })}
                    placeholder="Quality grade, organic certification, pesticide-free details..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
                  >
                    Publish Crop to Marketplace
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      {/* ================= MODAL FOR UPDATING AVAILABLE CROP STOCK & PRICE ================= */}
        {editingCrop && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-8 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>✏️</span> Update Available Produce Stock
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Changes reflect immediately in the live buyer marketplace
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCrop(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Crop Preview Header */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center shadow-xs">
                  <img
                    src={editingCrop.image || getCropImage(editingCrop)}
                    alt={editingCrop.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <span className="text-3xl" style={{ display: 'none' }}>
                    {editingCrop.emoji || '🌾'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{editingCrop.name}</h4>
                  <p className="text-xs text-gray-500">
                    Category: <span className="font-semibold text-gray-700">{editingCrop.category}</span> | Mandi: <span className="font-semibold text-gray-700">{editingCrop.location}</span>
                  </p>
                  <p className="text-xs font-semibold text-green-700 mt-1">
                    Current Rate: {editingCrop.price}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveStock} className="space-y-5">
                {/* Available Stock Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                      Available Stock (in Kilograms) *
                    </label>
                    <span className="text-xs text-gray-500">
                      Currently: <strong>{editingCrop.quantity}</strong>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={stockToUpdate}
                      onChange={(e) => setStockToUpdate(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-bold outline-none focus:ring-2 focus:ring-green-500 pr-14"
                    />
                    <span className="absolute right-4 top-3.5 text-sm font-bold text-gray-400">
                      kg
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-gray-400 font-semibold mr-1">Quick Add:</span>
                    <button
                      type="button"
                      onClick={() => setStockToUpdate((prev) => Math.max(0, (Number(prev) || 0) + 50))}
                      className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-200 hover:bg-green-100 transition cursor-pointer"
                    >
                      +50 kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockToUpdate((prev) => Math.max(0, (Number(prev) || 0) + 100))}
                      className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-200 hover:bg-green-100 transition cursor-pointer"
                    >
                      +100 kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockToUpdate((prev) => Math.max(0, (Number(prev) || 0) + 500))}
                      className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-200 hover:bg-green-100 transition cursor-pointer"
                    >
                      +500 kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockToUpdate(0)}
                      className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-200 hover:bg-red-100 transition cursor-pointer ml-auto"
                    >
                      Set to 0 kg (Out of Stock)
                    </button>
                  </div>
                </div>

                {/* Selling Price Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                      Mandi Selling Price (₹ per kg) *
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-sm font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      value={priceToUpdate}
                      onChange={(e) => setPriceToUpdate(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full pl-8 pr-16 py-3 border border-gray-300 rounded-xl text-base font-bold outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span className="absolute right-4 top-3 text-sm font-bold text-gray-400">
                      / kg
                    </span>
                  </div>
                </div>

                {/* Real-time Status Notice */}
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    Number(stockToUpdate) > 0
                      ? 'bg-green-50 text-green-800 border-green-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  <span>{Number(stockToUpdate) > 0 ? '✓' : '❌'}</span>
                  <span>
                    {Number(stockToUpdate) > 0
                      ? `Produce will be shown as IN STOCK on Marketplace (${stockToUpdate} kg available for buyers).`
                      : 'Produce will be marked OUT OF STOCK on Marketplace (buyers cannot add to cart).'}
                  </span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-sm"
                  >
                    Save Stock & Update Marketplace
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCrop(null)}
                    className="px-5 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-green-400">Kissan Mitra</h2>
          <p className="mt-2 text-gray-400">
            Empowering farmers with direct digital selling & fair mandi profits.
          </p>
          <p className="mt-5 text-gray-500 text-sm">
            © 2026 Kissan Mitra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default FarmerDashboard
