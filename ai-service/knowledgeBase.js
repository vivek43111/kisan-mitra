/**
 * Kisan Mitra - AI Agronomy & Crop Protection Knowledge Base
 * Based on Indian Council of Agricultural Research (ICAR) & State Agricultural University protocols.
 */

const SAMPLE_DISEASES = [
  {
    id: 'DIS-TOM-01',
    crop: 'Organic Tomato',
    cropKey: 'tomato',
    name: 'Early Blight (पत्ती का अगेती झुलसा)',
    scientificName: 'Alternaria solani',
    severity: 'Moderate',
    confidence: 96.4,
    symptoms: 'Concentric dark brown circular spots resembling a "target board" on older leaves, progressing upwards with yellow halos.',
    organicTreatment: 'Spray Trichoderma viride @ 5g/L or fresh Neem seed kernel extract (NSKE 5%) every 7 days. Prune lower infected leaves.',
    chemicalTreatment: 'Foliar spray of Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L at first appearance of spots.',
    prevention: 'Avoid overhead sprinkler irrigation; maintain 60cm plant spacing; practice 3-year crop rotation with non-solanaceous crops.',
    sampleImage: '/images/crops/tomato.jpg'
  },
  {
    id: 'DIS-POT-01',
    crop: 'Farm Fresh Potato',
    cropKey: 'potato',
    name: 'Late Blight (आलू का पछेती झुलसा)',
    scientificName: 'Phytophthora infestans',
    severity: 'High (Immediate Action Required)',
    confidence: 97.8,
    symptoms: 'Water-soaked irregular pale green/brown lesions on leaf margins turning black rapidly with white fuzzy fungal growth on leaf undersides in humid cool weather.',
    organicTreatment: 'Spray Bordeaux mixture (1%) or Copper Hydroxide (2.5 g/L). Destroy heavily blighted tuber vines immediately.',
    chemicalTreatment: 'Immediate application of Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 2.5 g/L, or Dimethomorph 50% WP @ 1 g/L.',
    prevention: 'Plant certified disease-free seed tubers (e.g., Kufri Jyoti, Kufri Girdhari); hill up soil properly around tubers; stop irrigation before harvest.',
    sampleImage: '/images/crops/potato.jpg'
  },
  {
    id: 'DIS-RIC-01',
    crop: 'Rice (Basmati 1121)',
    cropKey: 'rice',
    name: 'Brown Spot & Blast (भूरा धब्बा व झोंका रोग)',
    scientificName: 'Bipolaris oryzae / Magnaporthe oryzae',
    severity: 'High',
    confidence: 95.2,
    symptoms: 'Oval to circular reddish-brown spots with grey centers on leaf blades. Spindle-shaped lesions causing leaf drying and reduced grain filling.',
    organicTreatment: 'Seed treatment with Pseudomonas fluorescens @ 10g/kg seed. Apply cow urine (10%) and fermented butter-milk foliar spray.',
    chemicalTreatment: 'Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L at boot-leaf or tillering stage.',
    prevention: 'Apply balanced potassium fertilization; avoid excessive nitrogen application (>120 kg N/ha); maintain alternate wetting and drying.',
    sampleImage: '/images/crops/rice.jpg'
  },
  {
    id: 'DIS-WHT-01',
    crop: 'Sharbati Wheat',
    cropKey: 'wheat',
    name: 'Yellow / Stripe Rust (पीला रतुआ)',
    scientificName: 'Puccinia striiformis',
    severity: 'High (Wind-borne Rapid Spread)',
    confidence: 98.1,
    symptoms: 'Bright yellow-orange powdery pustules arranged in linear parallel stripes on leaf blades, leaving yellow dust on fingertips.',
    organicTreatment: 'Dust with micronized wettable sulfur (80% WP) @ 2.5 g/L. Spray garlic extract (2%) as a natural antifungal suppressant.',
    chemicalTreatment: 'Spray Propiconazole 25% EC (Tilt) @ 1 ml/L or Tebuconazole 25.9% EC @ 1.25 ml/L immediately on first cluster detection.',
    prevention: 'Sow rust-resistant varieties (HD-2967, DBW-187, PBW-725); avoid delayed sowing after November 25; inspect northern fields regularly.',
    sampleImage: '/images/crops/wheat.jpg'
  },
  {
    id: 'DIS-ONI-01',
    crop: 'Red Onion',
    cropKey: 'onion',
    name: 'Purple Blotch (बैंगनी धब्बा रोग)',
    scientificName: 'Alternaria porri',
    severity: 'Moderate',
    confidence: 93.7,
    symptoms: 'Small, sunken whitish flecks on leaves expanding into elliptical purplish-brown lesions with concentric rings; leaf tops dry prematurely.',
    organicTreatment: 'Spray Trichoderma harzianum @ 5g/L + sticker (sandovit 0.5ml/L). Drench soil with bio-formulations.',
    chemicalTreatment: 'Foliar spray of Chlorothalonil 75% WP @ 2 g/L or Difenoconazole 25% EC @ 1 ml/L mixed with non-ionic sticker.',
    prevention: 'Plant on raised beds to promote good field drainage; maintain 10-15 cm spacing; avoid water logging around bulbs.',
    sampleImage: '/images/crops/onion.jpg'
  },
  {
    id: 'DIS-MAI-01',
    crop: 'Yellow Sweet Maize',
    cropKey: 'maize',
    name: 'Fall Armyworm (सैनिक कीट प्रकोप)',
    scientificName: 'Spodoptera frugiperda',
    severity: 'High',
    confidence: 96.0,
    symptoms: 'Pinholes and ragged elongated shot-holes on whorl leaves with abundant sawdust-like moist frass (droppings) inside central leaf whorls.',
    organicTreatment: 'Whorl application of sand + neem cake (9:1) or Bacillus thuringiensis (Bt @ 2g/L). Install 5 pheromone traps per acre.',
    chemicalTreatment: 'Whorl spray of Chlorantraniliprole 18.5% SC (Coragen) @ 0.4 ml/L or Emamectin benzoate 5% SG @ 0.4 g/L.',
    prevention: 'Intercrop with pulses (cowpea or pigeon pea); avoid staggered maize sowing; clean field border weeds.',
    sampleImage: '/images/crops/maize.jpg'
  },
  {
    id: 'DIS-MNG-01',
    crop: 'Desi Mango',
    cropKey: 'mango',
    name: 'Anthracnose & Blossom Blight (काला धब्बा व बौर झुलसा)',
    scientificName: 'Colletotrichum gloeosporioides',
    severity: 'Moderate',
    confidence: 94.5,
    symptoms: 'Dark brown sunken circular necrotic spots on ripening fruit, twigs, and leaf margins; panicles turn black and drop prematurely.',
    organicTreatment: 'Pre-harvest tree spray of 5% Panchagavya; post-harvest hot water treatment of mangoes at 52°C for 5 minutes.',
    chemicalTreatment: 'Spray Carbendazim 50% WP @ 1 g/L or Copper Oxychloride 50% WP @ 3 g/L during flower bud opening and fruit set.',
    prevention: 'Prune dead and crisscrossed branches after harvest; burn leaf litter beneath trees; ensure adequate canopy sunlight.',
    sampleImage: '/images/crops/mango.jpg'
  },
  {
    id: 'DIS-CAB-01',
    crop: 'Green Cabbage',
    cropKey: 'cabbage',
    name: 'Diamondback Moth & Black Rot (हीरक कीट व काली सड़न)',
    scientificName: 'Plutella xylostella / Xanthomonas campestris',
    severity: 'High',
    confidence: 95.8,
    symptoms: 'V-shaped yellow lesions along leaf margins with blackened veins. Silken webbing and window-pane leaf punctures from green caterpillars.',
    organicTreatment: 'Grow mustard as a trap crop (2 rows every 25 rows of cabbage). Spray Bacillus thuringiensis (Bt) @ 1.5 g/L or Neem oil (10,000 ppm).',
    chemicalTreatment: 'Spray Spinosad 45% SC @ 0.3 ml/L or Streptocycline 100 ppm (1g in 10L water) for bacterial black rot suppression.',
    prevention: 'Use raised nursery beds; dip seedling roots in bio-agent solution before transplanting; destroy crop stubble post-harvest.',
    sampleImage: '/images/crops/cabbage.jpg'
  }
];

const MSP_DATABASE = {
  'rice': { msp: 24.50, unit: '₹/kg', name: 'Paddy / Basmati Rice', benchmarkMandiMin: 38, benchmarkMandiMax: 48, demandRating: 'VERY HIGH', season: 'Kharif / Post-Monsoon' },
  'wheat': { msp: 22.75, unit: '₹/kg', name: 'Sharbati Wheat', benchmarkMandiMin: 28, benchmarkMandiMax: 35, demandRating: 'HIGH', season: 'Rabi / Spring' },
  'potato': { msp: 14.00, unit: '₹/kg', name: 'Farm Potato', benchmarkMandiMin: 22, benchmarkMandiMax: 30, demandRating: 'CONSISTENT', season: 'Winter / Year-round' },
  'tomato': { msp: 16.50, unit: '₹/kg', name: 'Vine Tomato', benchmarkMandiMin: 28, benchmarkMandiMax: 42, demandRating: 'VERY HIGH', season: 'Rabi & Kharif' },
  'onion': { msp: 18.00, unit: '₹/kg', name: 'Red Onion', benchmarkMandiMin: 26, benchmarkMandiMax: 36, demandRating: 'EXTREMELY HIGH', season: 'Rabi / Late Kharif' },
  'maize': { msp: 19.50, unit: '₹/kg', name: 'Sweet Yellow Maize', benchmarkMandiMin: 22, benchmarkMandiMax: 28, demandRating: 'STEADY', season: 'Kharif' },
  'mango': { msp: 35.00, unit: '₹/kg', name: 'Desi Mango', benchmarkMandiMin: 50, benchmarkMandiMax: 75, demandRating: 'HIGH (Seasonal)', season: 'Summer' },
  'cabbage': { msp: 12.00, unit: '₹/kg', name: 'Green Cabbage', benchmarkMandiMin: 18, benchmarkMandiMax: 26, demandRating: 'MODERATE', season: 'Winter' },
};

const FAQ_DATABASE = [
  {
    keywords: ['fertilizer', 'khad', 'urea', 'npk', 'dap', 'खाद'],
    answer: '🌱 **Fertilizer Advisory (संतुलित खाद सलाह):**\n- For cereal grains (Wheat & Rice), use an N:P:K ratio of 4:2:1 (e.g. 120kg N, 60kg P2O5, 40kg K2O per hectare).\n- Apply 1/3 Nitrogen + full Phosphorus & Potassium as basal dose at sowing.\n- Top-dress remaining Nitrogen in 2 equal splits at tillering and flowering stages.\n- Enrich soil with 5 tonnes/acre well-rotted FYM (गोबर की खाद) or vermicompost to boost soil microbiome.'
  },
  {
    keywords: ['pest', 'keeda', 'insect', 'keet', 'कीट', 'spray', 'neem'],
    answer: '🛡️ **Integrated Pest Management (कीट नियंत्रण सलाह):**\n- First line of defense: Neem Seed Kernel Extract (NSKE 5%) or 10,000 ppm Neem Oil (3ml/L) to repel sucking pests (aphids, thrips, jassids).\n- Install yellow sticky traps (10-15 per acre) for whiteflies and aphids.\n- Use pheromone traps (5/acre) for bollworms, armyworms, and fruit borers.\n- For stubborn infestations, alternate chemical classes (e.g., Emamectin Benzoate or Spinosad) to prevent insect resistance.'
  },
  {
    keywords: ['water', 'irrigation', 'sinchai', 'drip', 'सिंचाई', 'paani'],
    answer: '💧 **Smart Irrigation Guidance (जल प्रबंधन सलाह):**\n- Avoid flood irrigation; switch to Drip or Sprinkler systems to save 40-50% water and reduce weed emergence.\n- Critical stages requiring irrigation:\n  • Wheat: Crown Root Initiation (CRI - 21 days), Tillering, and Grain Milking.\n  • Tomato & Vegetables: Flowering and fruit enlargement.\n  • Rice: Maintain 2-3 cm shallow water during panicle initiation; drain 10 days before harvest.'
  },
  {
    keywords: ['storage', 'store', 'preserve', 'rot', 'kharab', 'भंडारण', 'godown'],
    answer: '📦 **Produce Storage & Shelf-Life Extension (भंडारण तकनीक):**\n- **Grains (Wheat & Rice):** Dry produce to <12% moisture content before bagging to prevent fungal aflatoxins and weevils. Place neem leaves inside gunny bags.\n- **Onion & Potato:** Store in dark, well-ventilated, dry mesh racks at 15-25°C. Never store onions and potatoes together (onions release ethylene gas that triggers potato sprouting!).\n- **Tomatoes:** Store vine-side down at 12-15°C; avoid direct cold refrigerator storage which destroys flavor enzymes.'
  },
  {
    keywords: ['sell', 'listing', 'list', 'farmer', 'market', 'bechna', 'बेचना'],
    answer: '🌾 **Direct Selling on Kisan Mitra (किसान मित्र पर बिक्री):**\n1. Go to the **Farmer Portal** in the navigation bar.\n2. Click **"+ List New Farm Produce"**.\n3. Enter crop name, category, available stock (kg), and your expected mandi price.\n4. Click **"✨ AI Price Advisor"** to get the best competitive price recommendation.\n5. Click **"Publish Crop"** — your produce appears instantly for verified buyers across Jharkhand and nationwide with zero middleman commissions!'
  },
  {
    keywords: ['delivery', 'transport', 'pickup', 'carrier', 'डिलीवरी', 'vehicle'],
    answer: '🚚 **Cold-Chain & Delivery Logistics (डिलीवरी सेवा):**\n- Once a buyer confirms an order, our **Delivery Hub (Port 5003)** automatically assigns a nearby verified logistics partner.\n- The partner contacts the farmer for direct farmgate pickup within 12-24 hours.\n- The produce is transported in temperature-monitored vehicles directly to the buyer\'s doorstep, eliminating spoilage and multi-mandi transit delays.'
  },
  {
    keywords: ['msp', 'price', 'rate', 'bhav', 'भाव', 'mandi'],
    answer: '📈 **Government MSP & Kisan Mitra Pricing (एमएसपी एवं मंडी भाव):**\n- Kisan Mitra benchmark prices strictly align with CACP / Ministry of Agriculture MSP benchmarks:\n  • Basmati Rice: ₹24.50 MSP | Kisan Mitra Direct: ₹40-₹48/kg\n  • Sharbati Wheat: ₹22.75 MSP | Kisan Mitra Direct: ₹30-₹35/kg\n  • Potato: ₹14.00 MSP | Kisan Mitra Direct: ₹25-₹28/kg\n  • Organic Tomato: ₹16.50 MSP | Kisan Mitra Direct: ₹30-₹38/kg\n- Farmers on Kisan Mitra retain **35% to 50% higher profits** compared to traditional APMC middlemen agents!'
  }
];

const BUYER_FAQ = [
  {
    keywords: ['recipe', 'cook', 'banaun', 'dish', 'curry', 'khana', 'खाना', 'पकाएं'],
    answer: '👨‍🍳 **Farm-Fresh Culinary Inspiration (रसोई सुझाव):**\n- **Fresh Tomato & Potato:** Perfect for rich North Indian *Dum Aloo* or fresh roasted *Tomato Basil Soup*. With farm-fresh tomatoes, no canned paste or preservatives are needed!\n- **Sharbati Wheat:** High-gluten grain yields soft, golden rotis and parathas that stay fluffy for hours.\n- **Basmati Rice (1121):** Premium extra-long grain with exceptional natural elongation. Ideal for fragrant vegetable biryani and festive pulao.\n- **Red Onion:** Thinly slice for crunchy raw salads or slow-caramelize into a golden base for curries and dals.'
  },
  {
    keywords: ['fresh', 'shelf life', 'spoil', 'keep', 'fridge', 'taja', 'ताजा', 'रखें'],
    answer: '🥬 **Home Freshness & Pantry Storage Guide (ताजगी बनाए रखने के नियम):**\n- **Tomatoes:** Keep stem-side down at room temperature (15–20°C). Do NOT refrigerate unless fully ripe—cold air dulls natural tomato flavor enzymes.\n- **Potatoes:** Store in a cool, dark, dry basket. Keep away from onions (onions emit ethylene gas which makes potatoes sprout prematurely!).\n- **Grains (Wheat & Rice):** Store in airtight containers. Add 4-5 dried bay leaves or neem leaves to naturally deter grain weevils without chemicals.\n- **Green Cabbage:** Wrap loosely in paper towel inside the vegetable crisper drawer—stays crisp for 2–3 weeks!'
  },
  {
    keywords: ['save', 'saving', 'supermarket', 'rate', 'retail', 'sasta', 'बचत', 'सस्ता'],
    answer: '💰 **Direct Farmgate Value vs Supermarket Retail (सीधी बचत विश्लेषण):**\n- When buying on Kisan Mitra, you bypass 3 layers of wholesale middlemen, APMC commission agents, and distributor markups.\n- **Average Consumer Savings:** 25% to 35% cheaper than packaged supermarket brands!\n- **Fair to Farmers:** While you pay less, the local farmer earns **35% to 50% more** than what local wholesale brokers offer them. It\'s a win-win for your wallet and our rural farmers!'
  },
  {
    keywords: ['organic', 'chemical', 'natural', 'pure', 'health', 'शुद्ध', 'ऑर्गेनिक'],
    answer: '🌿 **Purity & Organic Verification (शुद्धता एवं प्राकृतिक खेती):**\n- Kisan Mitra prioritizes farmgate produce grown with bio-fertilizers (Jeevamrut, Panchagavya, vermicompost) and natural botanical pest sprays (Neem oil, Trichoderma).\n- Look for the **"Live Farm Harvest"** badge on produce cards—these items are harvested fresh on the morning of dispatch, never cold-storage gas-ripened.'
  },
  {
    keywords: ['payment', 'cod', 'cash', 'pay', 'भुगतान', 'delivery'],
    answer: '💳 **Secure Checkout & Delivery Assurance:**\n- We offer **Cash on Delivery (COD)** and secure prepaid online payment.\n- Direct cold-chain delivery brings the produce from the farmgate to your doorstep within 24–48 hours, fully tracked in real-time under your **Orders** tab.'
  }
];

const DELIVERY_FAQ = [
  {
    keywords: ['temperature', 'cold chain', 'temp', 'spoilage', 'गर्मी', 'तापमान'],
    answer: '❄️ **Cold-Chain Temperature Management Protocol:**\n- **Fresh Leafy Vegetables & Cabbage:** Maintain van cooling at **4°C to 8°C** with 90% relative humidity.\n- **Vine Tomatoes & Fruits (Mangoes):** Maintain **12°C to 15°C** (never below 10°C to prevent chilling injury and skin pitting).\n- **Potatoes & Onions:** Ventilated dry ambient transit (15°C–22°C); ensure rain protection tarps are secured.\n- **Grain Sacks (Wheat/Rice):** Moisture <12%; keep bags elevated on wooden pallets to prevent road moisture condensation.'
  },
  {
    keywords: ['route', 'pickup', 'map', 'dispatch', 'fuel', 'रास्ता', 'पिकअप'],
    answer: '🗺️ **Farmgate Pickup & Route Optimization Guide:**\n- Cluster farm pickups by agricultural block (e.g. Ranchi rural cluster vs Hazaribagh highway farms) to cut vehicle idling by 35%.\n- Always call the farmer 30 minutes before arrival so crates are pre-stacked and weighed at the farm gate.\n- Update order status immediately from **"Pickup from Farm"** ➔ **"In Transit"** in your Delivery Hub to inform the waiting buyer!'
  },
  {
    keywords: ['damage', 'fragile', 'box', 'sack', 'loss', 'टूट-फूट'],
    answer: '📦 **Cargo Protection & Load Balancing Rules:**\n- Place heavy 50kg grain gunny bags at the bottom of the truck cargo bed against the forward bulkhead.\n- Stack ventilated plastic crates (Tomatoes, Cabbages, Mangoes) in interlocking columns no higher than 5 tiers.\n- Secure with cargo tie-down ratchet straps to avoid lateral shifting on rural unpaved farm access roads.'
  }
];

const ADMIN_FAQ = [
  {
    keywords: ['microservice', 'architecture', 'health', 'system', 'port', 'सर्वर'],
    answer: '👑 **Kisan Mitra Decoupled Microservice Topology:**\n- **Orders Service (Port 5000):** State machine (Pending ➔ Confirmed ➔ Cancelled) with Idempotency-Key cache & ETag conditional reads.\n- **Users Service (Port 5001):** Role-Based Access Control (RBAC) handling Farmer, Buyer, Delivery, and Admin profiles.\n- **Catalogue Service (Port 5002):** Produce inventory datastore, stock availability toggles, and CACP MSP comparisons.\n- **Delivery Service (Port 5003):** Logistics assignment pipeline tracking transit milestones.\n- **AI & Vision Service (Port 5004):** Dual-engine AI processing crop disease vision, multilingual advisory, and pricing intelligence.'
  },
  {
    keywords: ['fraud', 'dispute', 'refund', 'anomaly', 'fake', 'जांच'],
    answer: '🛡️ **Platform Integrity & Anomaly Safeguards:**\n- **Duplicate Payment Prevention:** Enforced HTTP `Idempotency-Key` header prevents double-billing on network retries.\n- **Mandi Price Guardrails:** AI automatically flags produce listings that deviate >60% above or below regional MSP benchmark rates.\n- **KYC Pipeline:** Farmers submit Aadhaar and land record numbers (Khata/Khesra) for verified seller badge approval.'
  }
];

module.exports = {
  SAMPLE_DISEASES,
  MSP_DATABASE,
  FAQ_DATABASE,
  BUYER_FAQ,
  DELIVERY_FAQ,
  ADMIN_FAQ,
};
