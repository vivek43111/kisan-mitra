import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ROLE_CONFIGS = {
  FARMER: {
    roleKey: 'FARMER',
    badgeIcon: '🌾',
    badgeTitle: 'Kisan Sahayak AI',
    badgeSubtitle: 'किसान सहायक (Agro AI)',
    headerTitle: 'Kisan Sahayak AI (किसान सहायक)',
    headerSubtitle: 'ICAR Plant Pathology & Crop Disease Advisor',
    headerGradient: 'from-green-800 via-green-700 to-emerald-700',
    headerBadge: 'Port 5004 • Agro AI',
    welcomeText:
      '🙏 **नमस्ते! I am Kisan Sahayak (किसान सहायक), your AI Agronomy Advisor.**\n\nI can help you with crop disease identification, balanced NPK fertilizer dosages, seasonal MSP mandi rates, and crop storage. You can also use our **AI Crop Doctor** to scan diseased leaves!',
    showDoctorLink: true,
    suggestions: [
      '🌾 What is the recommended fertilizer dosage for Wheat?',
      '🍅 How to cure Tomato early blight & leaf curl?',
      '🥔 How to store potatoes without rotting or sprouting?',
      '📈 What are the latest MSP rates for Basmati Rice & Wheat?',
      '🍃 Open AI Crop Doctor to scan diseased leaf',
    ],
    placeholder: 'Ask about crop diseases, fertilizers, MSP... (उदा: गेहूँ में खाद कब डालें?)',
  },
  BUYER: {
    roleKey: 'BUYER',
    badgeIcon: '🛒',
    badgeTitle: 'Mitra Shopper AI',
    badgeSubtitle: 'मित्रा शॉपर (Freshness & Recipes)',
    headerTitle: 'Mitra Shopper AI (मित्रा शॉपर)',
    headerSubtitle: 'Smart Kitchen Recipes & Freshness Advisor',
    headerGradient: 'from-emerald-800 via-teal-700 to-emerald-900',
    headerBadge: 'Port 5004 • Buyer AI',
    welcomeText:
      '👋 **Hello! I am Mitra Shopper (मित्रा शॉपर), your Farm-to-Table Kitchen & Freshness Advisor.**\n\nI help buyers with fresh farm culinary recipes, pantry storage tips, direct farmgate price savings, and produce shelf-life extension!',
    showDoctorLink: false,
    suggestions: [
      '🥗 What can I cook with farm fresh Tomatoes & Potatoes?',
      '💡 How long will onions and potatoes stay fresh in my pantry?',
      '💰 How much do I save buying direct from farmers?',
      '🌾 What makes Sharbati Wheat and Basmati 1121 special?',
      '📦 How does direct cold-chain delivery work?',
    ],
    placeholder: 'Ask about recipes, produce freshness, shelf-life... (उदा: टमाटर की ताज़ा चटनी रेसिपी?)',
  },
  DELIVERY: {
    roleKey: 'DELIVERY',
    badgeIcon: '🚚',
    badgeTitle: 'Logistics AI',
    badgeSubtitle: 'Cold-Chain & Route Advisor',
    headerTitle: 'Kisan Logistics & Cold-Chain AI',
    headerSubtitle: 'Farmgate Transit & Perishable Climate Advisor',
    headerGradient: 'from-blue-900 via-sky-800 to-blue-950',
    headerBadge: 'Port 5004 • Logistics AI',
    welcomeText:
      '🚚 **Hello Delivery Partner! I am your Cold-Chain & Route Optimization Assistant.**\n\nI assist logistics partners with safe transit temperatures (4-8°C for greens, 12-15°C for tomatoes), farmgate pickup route planning, and cargo stacking rules to eliminate transport damage.',
    showDoctorLink: false,
    suggestions: [
      '❄️ Safe transit temperature for Tomatoes & Fruits?',
      '🗺️ How to optimize farm pickup clusters in Jharkhand?',
      '📦 Preventing crate damage on rural farm roads?',
      '⏱️ Standard pickup-to-doorstep delivery SLA?',
    ],
    placeholder: 'Ask about safe transit temperatures, route planning...',
  },
  ADMIN: {
    roleKey: 'ADMIN',
    badgeIcon: '👑',
    badgeTitle: 'Admin Ops AI',
    badgeSubtitle: 'Platform Health & Integrity',
    headerTitle: 'Admin Ops & Anomaly AI',
    headerSubtitle: '5-Microservice Monitor & Integrity Guard',
    headerGradient: 'from-slate-900 via-purple-950 to-slate-900',
    headerBadge: 'Port 5004 • Ops AI',
    welcomeText:
      '👑 **Welcome Administrator! I am your Platform Integrity & Architecture Monitor.**\n\nI monitor the 5 decoupled microservices (Ports 5000-5004), transaction idempotency, pricing anomalies against CACP mandi MSP, and farmer KYC verification queues.',
    showDoctorLink: false,
    suggestions: [
      '⚡ Check status of all 5 Microservices (Ports 5000-5004)',
      '🛡️ How does Idempotency-Key guard duplicate billing?',
      '🔍 Detect suspicious mandi price deviations',
      '📋 Farmer land record & Aadhaar verification process',
    ],
    placeholder: 'Ask about microservice health, security, idempotency...',
  },
  GUEST: {
    roleKey: 'GUEST',
    badgeIcon: '🌱',
    badgeTitle: 'Kisan Mitra AI',
    badgeSubtitle: 'Platform Guide & Onboarding',
    headerTitle: 'Kisan Mitra AI Guide',
    headerSubtitle: 'Direct Farmgate Marketplace Advisor',
    headerGradient: 'from-green-800 via-emerald-700 to-green-900',
    headerBadge: 'Port 5004 • Guide AI',
    welcomeText:
      '👋 **Welcome to Kisan Mitra! I am your AI Platform Guide.**\n\nI help new visitors learn how direct farm buying works, how local farmers list their harvest with zero commission, and how our cold-chain delivery brings farm freshness to your door!',
    showDoctorLink: false,
    suggestions: [
      '🛒 How do I buy directly from local farmers?',
      '👨‍🌾 How can a local farmer register and sell?',
      '💳 Is Cash on Delivery (COD) supported?',
      '🌾 Which farm crops are available right now?',
    ],
    placeholder: 'Ask how Kisan Mitra works, how to buy or sell...',
  },
}

function KisanSahayakChat() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('Auto')
  const messagesEndRef = useRef(null)

  // Detect active role and select config
  const activeRole = currentUser?.role || 'GUEST'
  const config = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.GUEST

  // Reset initial message whenever role changes
  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: config.welcomeText,
        time: 'Just now',
      },
    ])
  }, [activeRole])

  // Listen to user authentication & role changes
  useEffect(() => {
    const checkUser = () => {
      try {
        const stored = localStorage.getItem('kisan_user')
        if (stored) {
          setCurrentUser(JSON.parse(stored))
        } else {
          setCurrentUser(null)
        }
      } catch {
        setCurrentUser(null)
      }
    }

    checkUser()
    window.addEventListener('storage', checkUser)
    const interval = setInterval(checkUser, 1000)
    return () => {
      window.removeEventListener('storage', checkUser)
      clearInterval(interval)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend) => {
    const question = textToSend || input
    if (!question.trim() || loading) return

    const userMessage = {
      sender: 'user',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5004/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          language,
          role: activeRole,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: data.reply,
            source: data.source,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      } else {
        throw new Error('AI service error')
      }
    } catch {
      // Graceful client fallback
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `🌱 **${config.headerTitle} Advisory:**\nDirect farmgate integration ensures maximum freshness and fair profits. You can also explore our verified produce in the **Marketplace**!`,
          source: 'Offline Intelligence Engine',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r ${config.headerGradient} text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20 cursor-pointer`}
          title={`Open ${config.headerTitle}`}
        >
          <div className="relative">
            <span className="text-2xl">{config.badgeIcon}</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
            </span>
          </div>

          <div className="text-left">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-green-200">
              {config.badgeTitle}
            </p>
            <p className="text-xs font-bold leading-tight">{config.badgeSubtitle}</p>
          </div>
        </button>
      )}

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[430px] h-[590px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${config.headerGradient} p-4 text-white flex items-center justify-between shadow-sm flex-shrink-0`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/20 shadow-xs">
                {config.badgeIcon}
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-2">
                  {config.headerTitle}
                </h3>
                <p className="text-[11px] text-green-200">{config.headerSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {config.showDoctorLink && (
                <Link
                  to="/ai-doctor"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg font-bold transition flex items-center gap-1 border border-white/20"
                  title="Open Crop Disease Scanner"
                >
                  <span>🍃</span> Doctor
                </Link>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Notice Bar */}
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs text-gray-700 flex-shrink-0">
            <span className="flex items-center gap-1.5 font-medium text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Role Mode: <strong className="text-gray-900">{activeRole}</strong>
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-[11px] bg-white border border-gray-300 rounded px-1.5 py-0.5 outline-none font-semibold text-gray-800"
            >
              <option value="Auto">🌐 Auto</option>
              <option value="Hindi">हिन्दी</option>
              <option value="English">English</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-green-700 text-white rounded-br-xs'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400 px-1">
                  <span>{m.time}</span>
                  {m.source && <span className="font-medium text-green-700">• {m.source}</span>}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-gray-200 w-fit text-xs text-gray-500 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-green-700 font-semibold">AI is analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            <span className="text-[10px] font-bold uppercase text-gray-400 px-1 flex-shrink-0">
              Suggestions:
            </span>
            {config.suggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-700 transition font-medium flex-shrink-0 border border-gray-200 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={config.placeholder}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl transition cursor-pointer shadow-xs"
              title="Send question"
            >
              <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default KisanSahayakChat
