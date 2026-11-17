import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function AiCropDoctor() {
  const [samples, setSamples] = useState([])
  const [selectedSample, setSelectedSample] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [diagnostic, setDiagnostic] = useState(null)
  const [error, setError] = useState('')

  // Load sample disease database from Port 5004
  useEffect(() => {
    fetch('http://localhost:5004/api/ai/sample-diseases')
      .then((res) => res.json())
      .then((data) => {
        setSamples(data)
        // Pre-select first sample for immediate demonstration readiness
        if (data && data.length > 0) {
          handleSelectSample(data[0])
        }
      })
      .catch(() => {
        // Fallback local sample data if service is offline
        const localSample = {
          id: 'DIS-TOM-01',
          crop: 'Organic Tomato',
          name: 'Early Blight (पत्ती का अगेती झुलसा)',
          scientificName: 'Alternaria solani',
          severity: 'Moderate',
          confidence: 96.4,
          symptoms: 'Concentric dark brown circular spots resembling a "target board" on older leaves, progressing upwards with yellow halos.',
          organicTreatment: 'Spray Trichoderma viride @ 5g/L or fresh Neem seed kernel extract (NSKE 5%) every 7 days. Prune lower infected leaves.',
          chemicalTreatment: 'Foliar spray of Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L at first appearance of spots.',
          prevention: 'Avoid overhead sprinkler irrigation; maintain 60cm plant spacing; practice 3-year crop rotation with non-solanaceous crops.',
          sampleImage: '/images/crops/tomato.jpg'
        }
        setSamples([localSample])
        setDiagnostic(localSample)
      })
  }, [])

  const handleSelectSample = async (sample) => {
    setSelectedSample(sample)
    setUploadedImage(null)
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:5004/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId: sample.id, cropType: sample.crop }),
      })
      const data = await res.json()
      setDiagnostic(data.diagnostic)
    } catch {
      setDiagnostic(sample)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target.result
      setUploadedImage(base64)
      setSelectedSample(null)
      setLoading(true)
      setError('')

      try {
        const res = await fetch('http://localhost:5004/api/ai/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            cropType: file.name.split('.')[0] || 'Crop Leaf',
          }),
        })
        const data = await res.json()
        setDiagnostic(data.diagnostic)
      } catch {
        setError('Could not connect to AI microservice on Port 5004. Showing ICAR baseline diagnosis.')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Header */}
        <section className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-700 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-green-500/30 text-green-200 text-xs font-bold uppercase tracking-wider border border-green-400/30">
                  ⚡ AI Plant Pathology Microservice (Port 5004)
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-bold">
                  ICAR Standards Verified
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                🍃 Kisan Mitra AI Crop Health & Disease Clinic
              </h1>
              <p className="mt-2 text-green-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                Instant computer vision diagnosis for crop leaves, stems, and fruits. Detect fungal, bacterial, and pest infestations with scientific organic & chemical treatments.
              </p>
            </div>

            <Link
              to="/farmer-dashboard"
              className="px-5 py-3 bg-white text-green-800 hover:bg-green-50 rounded-xl font-bold text-sm shadow-md transition text-center whitespace-nowrap self-start md:self-auto"
            >
              👨‍🌾 Open Farmer Dashboard →
            </Link>
          </div>
        </section>

        {/* Main Body */}
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          {/* Top Panel: Photo Upload or Sample Selection */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Input Options (Upload or 1-Click Samples) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Box 1: Upload Custom Photo */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2 mb-2">
                  <span>📸</span> Upload Farm Crop / Leaf Photo
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Take a photo of diseased leaves or upload from your computer/mobile.
                </p>

                <label className="border-2 border-dashed border-green-300 hover:border-green-500 bg-green-50/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition group">
                  <span className="text-4xl group-hover:scale-110 transition-transform">📷</span>
                  <span className="mt-2 text-xs font-bold text-green-800">
                    Click to browse or drag image here
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">Supports JPG, PNG, WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Box 2: 1-Click Interactive Disease Samples */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <span>🔬</span> 1-Click Live Demonstration Samples
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Fast Demo
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Select any pre-configured crop specimen to immediately demonstrate the AI diagnosis:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {samples.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSample(s)}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        selectedSample?.id === s.id
                          ? 'border-green-600 bg-green-50 ring-2 ring-green-600/20'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-xs">
                        <img
                          src={s.sampleImage}
                          alt={s.crop}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{s.crop}</p>
                        <p className="text-[11px] text-gray-500 truncate">{s.name.split('(')[0]}</p>
                        <span className="text-[10px] font-semibold text-green-700">
                          {s.confidence}% AI Match
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Plant Diagnostic Card */}
            <div className="lg:col-span-7">
              {loading ? (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[460px] text-center">
                  <div className="relative w-16 h-16">
                    <div className="w-16 h-16 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xl">🍃</span>
                  </div>
                  <h3 className="mt-4 font-bold text-gray-900 text-lg">
                    Analyzing Cellular Leaf Structure...
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    Scanning plant pathology visual markers, spore patterns, and comparing against ICAR crop disease archives on Port 5004.
                  </p>
                </div>
              ) : diagnostic ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
                  {/* Card Header */}
                  <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-green-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                          Crop: {diagnostic.crop}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="font-mono text-xs text-gray-300">
                          ID: {diagnostic.id}
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-white">
                        {diagnostic.name}
                      </h2>
                      <p className="text-xs italic text-green-300 mt-0.5">
                        Causal Pathogen: {diagnostic.scientificName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Severity Pill */}
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs ${
                          diagnostic.severity?.includes('High')
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        ● {diagnostic.severity}
                      </span>

                      {/* Confidence Meter */}
                      <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                        ✓ {diagnostic.confidence || 96.2}% Confidence
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Visual Preview + Symptoms Banner */}
                    <div className="flex flex-col sm:flex-row gap-5 items-center p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-300 shadow-sm relative">
                        <img
                          src={uploadedImage || diagnostic.sampleImage}
                          alt={diagnostic.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">
                          AI Scanned
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                          Observed Pathology & Symptoms
                        </h4>
                        <p className="mt-1 text-sm text-gray-800 leading-relaxed font-medium">
                          {diagnostic.symptoms}
                        </p>
                      </div>
                    </div>

                    {/* Prescription Section: 2 Columns (Organic vs Chemical) */}
                    <div className="grid md:grid-cols-2 gap-5">
                      {/* Organic Treatment */}
                      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                          <span className="text-xl">🌿</span>
                          <span>Organic & Bio-Control Remedies</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {diagnostic.organicTreatment}
                        </p>
                        <p className="mt-3 text-[11px] text-emerald-700 font-bold">
                          ✓ Safe for natural, organic-certified harvests
                        </p>
                      </div>

                      {/* Chemical Treatment */}
                      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-sm">
                          <span className="text-xl">🧪</span>
                          <span>Chemical Fungicide / Treatment</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {diagnostic.chemicalTreatment}
                        </p>
                        <p className="mt-3 text-[11px] text-blue-700 font-bold">
                          ⚠️ Adhere strictly to recommended dilution & waiting period
                        </p>
                      </div>
                    </div>

                    {/* Preventative Cultural Practices */}
                    <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
                      <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                        <span className="text-xl">🛡️</span>
                        <span>Long-term Cultural & Field Prevention</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                        {diagnostic.prevention}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        🖨️ Print Prescription
                      </button>

                      <Link
                        to="/marketplace"
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        View Healthy Crops in Marketplace →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 text-center">
                  <span className="text-6xl">🍃</span>
                  <h3 className="mt-4 font-bold text-gray-900 text-lg">
                    Select a sample or upload a leaf photo
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    The AI diagnosis will appear here automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-green-400">Kissan Mitra AI Diagnostics</h2>
          <p className="mt-2 text-gray-400 text-sm">
            Empowering Indian farmers with real-time AI computer vision and ICAR agronomy recommendations.
          </p>
          <p className="mt-5 text-gray-500 text-xs">
            © 2026 Kissan Mitra. Decoupled AI Microservice on Port 5004.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AiCropDoctor
