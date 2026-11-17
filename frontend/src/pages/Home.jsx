import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
function Home() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
              🌾 Farmers & Buyers Platform
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Farm Fresh.
              <span className="text-green-600">
                {" "}Direct to You.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Kissan Mitra connects farmers directly with buyers.
              Farmers can sell their crops and buyers can purchase
              fresh agricultural products directly from the source.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">

               <Link
                     to="/marketplace"
                     className="px-7 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                      Explore Marketplace
               </Link>

              <Link to="/register" className="px-7 py-3 bg-white text-green-700 border border-green-600 rounded-lg font-semibold hover:bg-green-50 transition">Sell Your Crops</Link>

            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-3xl shadow-lg p-8">

            <div className="h-80 rounded-2xl bg-green-100 flex items-center justify-center">

              <div className="text-center">

                <div className="text-7xl">
                  🌾
                </div>

                <h2 className="mt-5 text-2xl font-bold text-green-700">
                  From Farm
                </h2>

                <div className="text-3xl my-3">
                  ↓
                </div>

                <h2 className="text-2xl font-bold text-green-700">
                  Directly to Buyer
                </h2>

              </div>

            </div>

          </div>

        </div>
      </section>


      
      {/* ================= PLATFORM HUBS & DECOUPLED ARCHITECTURE ================= */}
      <section className="bg-white py-12 border-y border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Decoupled Microservice Architecture • Group 19
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
                Quick Access Platform Portals
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Explore each dedicated workflow powered by independent Node.js & Express REST microservices.
              </p>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm self-start md:self-auto"
            >
              <span>⚙️</span> View Live 4-Service Status (5000-5003) →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Farmer Portal */}
            <Link
              to="/farmer-dashboard"
              className="group p-6 rounded-2xl border-2 border-green-200 bg-green-50/50 hover:bg-green-100/70 hover:border-green-400 transition transform hover:-translate-y-1 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center text-2xl shadow-sm mb-4">
                    🌾
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-800 transition">
                  Farmer Portal
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  List new crop harvests, set price per kg, and toggle real-time in-stock availability.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-green-200/60 flex items-center justify-between text-xs font-bold text-green-700">
                <span>Open Dashboard</span>
                <span>→</span>
              </div>
            </Link>

            {/* 2. Buyer Marketplace */}
            <Link
              to="/marketplace"
              className="group p-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-400 transition transform hover:-translate-y-1 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm mb-4">
                  🛒
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-800 transition">
                  Buyer Marketplace
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Browse fresh produce, filter by category, view dynamic out-of-stock badges, and direct order.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Browse Crops</span>
                <span>→</span>
              </div>
            </Link>

            {/* 3. Delivery Hub */}
            <Link
              to="/delivery-partner"
              className="group p-6 rounded-2xl border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-400 transition transform hover:-translate-y-1 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-sm mb-4">
                  🚚
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-800 transition">
                  Delivery Partner Hub
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Manage farmgate pickups, view route transit milestones, and advance delivery status in 1 click.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>Open Route Tracker</span>
                <span>→</span>
              </div>
            </Link>

            {/* 4. Admin Control Center */}
            <Link
              to="/admin"
              className="group p-6 rounded-2xl border-2 border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition transform hover:-translate-y-1 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-sm mb-4">
                  👑
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-slate-900 transition">
                  Admin Control Center
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Live health probes for Orders (5000), Users (5001), Catalogue (5002), and Delivery (5003).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Check Services</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>


      {/* ================= WHY KISSAN MITRA ================= */}
      <section className="bg-white py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold text-gray-900">
              Why Kissan Mitra?
            </h2>

            <p className="mt-3 text-gray-600">
              Simple, direct and transparent agricultural marketplace.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            {/* Farmer */}
            <div className="p-6 rounded-2xl bg-green-50 shadow-sm">

              <div className="text-4xl">
                👨‍🌾
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                For Farmers
              </h3>

              <p className="mt-2 text-gray-600">
                Farmers can sell their crops directly to buyers.
              </p>

            </div>


            {/* Price */}
            <div className="p-6 rounded-2xl bg-yellow-50 shadow-sm">

              <div className="text-4xl">
                💰
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Better Prices
              </h3>

              <p className="mt-2 text-gray-600">
                Transparent prices help farmers and buyers make better decisions.
              </p>

            </div>


            {/* Buyer */}
            <div className="p-6 rounded-2xl bg-blue-50 shadow-sm">

              <div className="text-4xl">
                🛒
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                For Buyers
              </h3>

              <p className="mt-2 text-gray-600">
                Buyers can find fresh crops directly from farmers.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= POPULAR CROPS ================= */}
      <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Popular Crops
              </h2>
              <p className="mt-2 text-gray-600">
                Fresh crops available directly from local farmers.
              </p>
            </div>
            <Link to="/marketplace" className="text-green-700 font-semibold hover:text-green-800">
              View All →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Rice */}
            <Link to="/product/1" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group block border border-gray-100">
              <div className="h-44 bg-gray-100 overflow-hidden relative">
                <img
                  src="/images/crops/rice.jpg"
                  alt="Rice (Basmati)"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full items-center justify-center bg-yellow-100 text-6xl" style={{ display: 'none' }}>
                  🌾
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition">
                  Rice (Basmati)
                </h3>
                <p className="mt-1 text-gray-500">Fresh farm rice</p>
                <p className="mt-4 text-green-700 font-bold">₹45 / kg</p>
              </div>
            </Link>

            {/* Wheat */}
            <Link to="/product/2" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group block border border-gray-100">
              <div className="h-44 bg-gray-100 overflow-hidden relative">
                <img
                  src="/images/crops/wheat.jpg"
                  alt="Sharbati Wheat"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full items-center justify-center bg-orange-100 text-6xl" style={{ display: 'none' }}>
                  🌾
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition">
                  Sharbati Wheat
                </h3>
                <p className="mt-1 text-gray-500">Quality wheat</p>
                <p className="mt-4 text-green-700 font-bold">₹32 / kg</p>
              </div>
            </Link>

            {/* Potato */}
            <Link to="/product/3" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group block border border-gray-100">
              <div className="h-44 bg-gray-100 overflow-hidden relative">
                <img
                  src="/images/crops/potato.jpg"
                  alt="Farm Fresh Potato"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full items-center justify-center bg-yellow-50 text-6xl" style={{ display: 'none' }}>
                  🥔
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition">
                  Farm Fresh Potato
                </h3>
                <p className="mt-1 text-gray-500">Fresh potatoes</p>
                <p className="mt-4 text-green-700 font-bold">₹28 / kg</p>
              </div>
            </Link>

            {/* Tomato */}
            <Link to="/product/4" className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group block border border-gray-100">
              <div className="h-44 bg-gray-100 overflow-hidden relative">
                <img
                  src="/images/crops/tomato.jpg"
                  alt="Organic Tomato"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full items-center justify-center bg-red-50 text-6xl" style={{ display: 'none' }}>
                  🍅
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition">
                  Organic Tomato
                </h3>
                <p className="mt-1 text-gray-500">Farm fresh tomatoes</p>
                <p className="mt-4 text-green-700 font-bold">₹35 / kg</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MANDI PRICE ================= */}
      <section className="bg-white py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-10">

            <h2 className="text-3xl font-bold text-gray-900">
              Today's Mandi Prices
            </h2>

            <p className="mt-3 text-gray-600">
              Check the latest crop prices before buying or selling.
            </p>

          </div>


          <div className="bg-yellow-50 rounded-2xl p-6 overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-yellow-200">

                  <th className="py-4 px-4">
                    Crop
                  </th>

                  <th className="py-4 px-4">
                    Market
                  </th>

                  <th className="py-4 px-4">
                    Price
                  </th>

                  <th className="py-4 px-4">
                    Change
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr className="border-b border-yellow-100">

                  <td className="py-4 px-4 font-semibold">
                    Rice
                  </td>

                  <td className="py-4 px-4">
                    Ranchi
                  </td>

                  <td className="py-4 px-4 font-semibold">
                    ₹4,500 / Quintal
                  </td>

                  <td className="py-4 px-4 text-green-600">
                    ↑ 2.4%
                  </td>

                </tr>


                <tr className="border-b border-yellow-100">

                  <td className="py-4 px-4 font-semibold">
                    Wheat
                  </td>

                  <td className="py-4 px-4">
                    Ranchi
                  </td>

                  <td className="py-4 px-4 font-semibold">
                    ₹3,200 / Quintal
                  </td>

                  <td className="py-4 px-4 text-green-600">
                    ↑ 1.8%
                  </td>

                </tr>


                <tr>

                  <td className="py-4 px-4 font-semibold">
                    Potato
                  </td>

                  <td className="py-4 px-4">
                    Jamshedpur
                  </td>

                  <td className="py-4 px-4 font-semibold">
                    ₹2,800 / Quintal
                  </td>

                  <td className="py-4 px-4 text-red-500">
                    ↓ 0.7%
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-green-50 py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold text-gray-900">
              How Kissan Mitra Works
            </h2>

            <p className="mt-3 text-gray-600">
              Three simple steps to connect farmers and buyers.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <div className="text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                1
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Farmers List Crops
              </h3>

              <p className="mt-2 text-gray-600">
                Farmers add their crops, quantity and price.
              </p>

            </div>


            {/* Step 2 */}
            <div className="text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                2
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Buyers Explore
              </h3>

              <p className="mt-2 text-gray-600">
                Buyers search and compare available crops.
              </p>

            </div>


            {/* Step 3 */}
            <div className="text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                3
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Direct Connection
              </h3>

              <p className="mt-2 text-gray-600">
                Farmers and buyers connect directly.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-green-700 py-16">

        <div className="max-w-4xl mx-auto px-6 text-center text-white">

          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Connect Directly?
          </h2>

          <p className="mt-4 text-green-100 text-lg">
            Join Kissan Mitra and make agricultural trading simpler.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">

            <Link to="/marketplace" className="px-7 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition">Start Buying</Link>

            <Link to="/register" className="px-7 py-3 border border-white text-white rounded-lg font-semibold hover:bg-green-600 transition">Start Selling</Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white py-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-8">

            <div>

              <h2 className="text-2xl font-bold text-green-400">
                Kissan Mitra
              </h2>

              <p className="mt-3 text-gray-400">
                Connecting farmers directly with buyers.
              </p>

            </div>


            <div>

              <h3 className="font-semibold">
                Quick Links
              </h3>

              <div className="mt-3 space-y-2 text-gray-400">

                <p className="hover:text-white cursor-pointer">
                  Home
                </p>

                <p className="hover:text-white cursor-pointer">
                  Marketplace
                </p>

                <p className="hover:text-white cursor-pointer">
                  Mandi Prices
                </p>

              </div>

            </div>


            <div>

              <h3 className="font-semibold">
                Contact
              </h3>

              <p className="mt-3 text-gray-400">
                Support for Farmers & Buyers
              </p>

              <p className="mt-2 text-gray-400">
                Email: support@kissanmitra.com
              </p>

            </div>

          </div>


          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
            © 2026 Kissan Mitra. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  )
}

export default Home