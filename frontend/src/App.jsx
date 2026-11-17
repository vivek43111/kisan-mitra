import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderTracking from './pages/OrderTracking'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import FarmerDashboard from './pages/FarmerDashboard'
import DeliveryDashboard from './pages/DeliveryDashboard'
import AiCropDoctor from './pages/AiCropDoctor'
import KisanSahayakChat from './components/KisanSahayakChat'

function MandiPrices() {
  const mandiRates = [
    { crop: 'Basmati Rice (1121)', msp: '₹24.50 / kg', kmPrice: '₹45 / kg', gain: '+83% direct profit', demand: 'Very High', status: 'In Season' },
    { crop: 'Sharbati Wheat', msp: '₹22.75 / kg', kmPrice: '₹32 / kg', gain: '+41% direct profit', demand: 'High', status: 'In Season' },
    { crop: 'Farm Fresh Potato', msp: '₹14.00 / kg', kmPrice: '₹28 / kg', gain: '+100% direct profit', demand: 'Steady', status: 'Available' },
    { crop: 'Organic Tomato', msp: '₹16.50 / kg', kmPrice: '₹35 / kg', gain: '+112% direct profit', demand: 'Very High', status: 'High Velocity' },
    { crop: 'Red Onion', msp: '₹18.00 / kg', kmPrice: '₹30 / kg', gain: '+67% direct profit', demand: 'Peak Demand', status: 'In Season' },
    { crop: 'Yellow Sweet Maize', msp: '₹19.50 / kg', kmPrice: '₹25 / kg', gain: '+28% direct profit', demand: 'Steady', status: 'Available' },
    { crop: 'Desi Mango', msp: '₹35.00 / kg', kmPrice: '₹60 / kg', gain: '+71% direct profit', demand: 'Seasonal Peak', status: 'Limited' },
    { crop: 'Green Cabbage', msp: '₹12.00 / kg', kmPrice: '₹22 / kg', gain: '+83% direct profit', demand: 'Moderate', status: 'Available' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="bg-gradient-to-r from-green-800 to-green-700 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-green-500/30 text-green-200 text-xs font-bold uppercase tracking-wider">
                📈 Agmarknet & CACP Daily Benchmark
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-3">
                Today's Mandi & MSP Price Intelligence
              </h1>
              <p className="mt-2 text-green-100 text-sm max-w-2xl leading-relaxed">
                Compare official Government Minimum Support Prices (MSP) against direct farmer selling rates on Kisan Mitra. Eliminate middlemen cuts and maximize farmgate realization.
              </p>
            </div>
            <Link
              to="/ai-doctor"
              className="px-5 py-3 bg-white text-green-800 hover:bg-green-50 font-bold rounded-xl text-sm shadow-md transition self-start md:self-auto"
            >
              🍃 Check Crop Health with AI →
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Mandi Benchmarks & Direct Farmer Gains</h3>
                <p className="text-xs text-gray-500">Real-time comparison powered by AI Mandi Advisor (Port 5004)</p>
              </div>
              <Link to="/marketplace" className="text-green-700 text-xs font-bold hover:underline">
                Browse Live Marketplace Produce →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500 tracking-wider">
                    <th className="py-3.5 px-6">Produce</th>
                    <th className="py-3.5 px-6">Govt MSP Baseline</th>
                    <th className="py-3.5 px-6">Kisan Mitra Direct Rate</th>
                    <th className="py-3.5 px-6">Farmer Profit Gain</th>
                    <th className="py-3.5 px-6">Buyer Demand Rating</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {mandiRates.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition">
                      <td className="py-4 px-6 font-bold text-gray-900">{item.crop}</td>
                      <td className="py-4 px-6 text-gray-600 font-mono text-xs">{item.msp}</td>
                      <td className="py-4 px-6 font-extrabold text-green-700 text-base">{item.kmPrice}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                          {item.gain}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                          ● {item.demand}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to="/marketplace"
                          className="px-3 py-1.5 border border-green-600 text-green-700 hover:bg-green-50 rounded-lg text-xs font-bold transition"
                        >
                          Buy Direct
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-green-400">Kissan Mitra</h2>
          <p className="mt-2 text-gray-400 text-sm">Empowering farmers with direct digital selling & fair mandi profits.</p>
          <p className="mt-5 text-gray-500 text-xs">© 2026 Kissan Mitra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-green-700">
          About Kissan Mitra
        </h1>

        <p className="mt-3 text-gray-600">
          Connecting farmers and buyers directly.
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/marketplace"
          element={
            <>
              <Navbar />
              <Marketplace />
            </>
          }
        />

        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <ProductDetails />
            </>
          }
        />

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />

        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <Orders />
            </>
          }
        />

        <Route
          path="/order-tracking"
          element={
            <>
              <Navbar />
              <OrderTracking />
            </>
          }
        />

        <Route
          path="/checkout"
          element={
            <>
              <Navbar />
              <Checkout />
            </>
          }
        />

        <Route path="/mandi-prices" element={<MandiPrices />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/delivery-partner" element={<DeliveryDashboard />} />
        <Route path="/ai-doctor" element={<AiCropDoctor />} />
      </Routes>
      <KisanSahayakChat />
    </BrowserRouter>
  )
}

export default App
