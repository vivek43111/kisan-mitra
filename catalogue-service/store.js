/**
 * Catalogue Microservice Datastore (Port 5002)
 * Manages agricultural crops, farmer stock levels, and mandi MSP comparisons.
 */

const INITIAL_CROPS = [
  {
    id: 1,
    name: 'Rice (Basmati 1121)',
    image: '/images/crops/rice.jpg',
    emoji: '🌾',
    price: 45,
    formattedPrice: '₹45 / kg',
    stockKg: 500,
    inStock: true,
    farmer: 'Ramesh Kumar',
    farmerId: 'USR101',
    location: 'Ludhiana, Punjab',
    category: 'Grains',
    mspPrice: 24.5,
    description: 'Fresh quality Basmati rice directly supplied by certified farmer.',
  },
  {
    id: 2,
    name: 'Sharbati Wheat',
    image: '/images/crops/wheat.jpg',
    emoji: '🌾',
    price: 32,
    formattedPrice: '₹32 / kg',
    stockKg: 800,
    inStock: true,
    farmer: 'Suresh Kumar',
    farmerId: 'USR102',
    location: 'Hazaribagh, Jharkhand',
    category: 'Grains',
    mspPrice: 22.75,
    description: 'Premium quality farm harvested wheat available for direct purchase.',
  },
  {
    id: 3,
    name: 'Farm Fresh Potato',
    image: '/images/crops/potato.jpg',
    emoji: '🥔',
    price: 28,
    formattedPrice: '₹28 / kg',
    stockKg: 1000,
    inStock: true,
    farmer: 'Mohan Singh',
    farmerId: 'USR103',
    location: 'Jamshedpur, Jharkhand',
    category: 'Vegetables',
    mspPrice: 14.0,
    description: 'Fresh farm potatoes for direct household and bulk procurement.',
  },
  {
    id: 4,
    name: 'Organic Tomato',
    image: '/images/crops/tomato.jpg',
    emoji: '🍅',
    price: 35,
    formattedPrice: '₹35 / kg',
    stockKg: 400,
    inStock: true,
    farmer: 'Amit Kumar',
    farmerId: 'USR104',
    location: 'Ranchi, Jharkhand',
    category: 'Vegetables',
    mspPrice: 16.5,
    description: 'Plump farm fresh tomatoes cultivated without synthetic pesticides.',
  },
  {
    id: 5,
    name: 'Red Onion',
    image: '/images/crops/onion.jpg',
    emoji: '🧅',
    price: 30,
    formattedPrice: '₹30 / kg',
    stockKg: 700,
    inStock: true,
    farmer: 'Rajesh Kumar',
    farmerId: 'USR105',
    location: 'Bokaro, Jharkhand',
    category: 'Vegetables',
    mspPrice: 18.0,
    description: 'Organic red onions with strong aroma and long shelf life.',
  },
  {
    id: 6,
    name: 'Yellow Sweet Maize',
    image: '/images/crops/maize.jpg',
    emoji: '🌽',
    price: 25,
    formattedPrice: '₹25 / kg',
    stockKg: 600,
    inStock: true,
    farmer: 'Vijay Kumar',
    farmerId: 'USR106',
    location: 'Dumka, Jharkhand',
    category: 'Grains',
    mspPrice: 19.5,
    description: 'High-grade yellow maize suitable for direct consumer or feed usage.',
  },
  {
    id: 7,
    name: 'Desi Mango',
    image: '/images/crops/mango.jpg',
    emoji: '🥭',
    price: 60,
    formattedPrice: '₹60 / kg',
    stockKg: 0,
    inStock: false, // Out of stock example
    farmer: 'Arun Kumar',
    farmerId: 'USR107',
    location: 'Deoghar, Jharkhand',
    category: 'Fruits',
    mspPrice: 35.0,
    description: 'Naturally ripened mangoes from local orchards.',
  },
  {
    id: 8,
    name: 'Green Cabbage',
    image: '/images/crops/cabbage.jpg',
    emoji: '🥬',
    price: 22,
    formattedPrice: '₹22 / kg',
    stockKg: 450,
    inStock: true,
    farmer: 'Deepak Kumar',
    farmerId: 'USR108',
    location: 'Giridih, Jharkhand',
    category: 'Vegetables',
    mspPrice: 12.0,
    description: 'Crisp green cabbages harvested daily morning for freshness.',
  },
];

class CatalogueStore {
  constructor() {
    this.crops = [...INITIAL_CROPS];
  }

  list({ search, category } = {}) {
    let result = this.crops;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.farmer.toLowerCase().includes(q)
      );
    }
    if (category && category !== 'All') {
      result = result.filter((c) => c.category === category);
    }
    return result;
  }

  findById(id) {
    return this.crops.find((c) => String(c.id) === String(id));
  }

  create(cropData) {
    const priceNum = Number(cropData.price);
    const stockNum = Number(cropData.stockKg || 0);

    const newCrop = {
      id: Date.now(),
      name: cropData.name,
      emoji: cropData.emoji || '🌾',
      price: priceNum,
      formattedPrice: `₹${priceNum} / kg`,
      stockKg: stockNum,
      inStock: stockNum > 0,
      farmer: cropData.farmer || 'Verified Farmer',
      farmerId: cropData.farmerId || 'USR101',
      location: cropData.location || 'Local Farm Mandi',
      category: cropData.category || 'Grains',
      mspPrice: cropData.mspPrice || Math.round(priceNum * 0.7),
      description: cropData.description || 'Direct farm harvest.',
      createdAt: new Date().toISOString(),
    };

    this.crops.unshift(newCrop);
    return newCrop;
  }

  updateStock(id, { stockKg, inStock }) {
    const crop = this.findById(id);
    if (!crop) return null;

    if (stockKg !== undefined) {
      crop.stockKg = Number(stockKg);
      crop.inStock = crop.stockKg > 0;
    }
    if (inStock !== undefined) {
      crop.inStock = Boolean(inStock);
      if (!crop.inStock) {
        crop.stockKg = 0;
      } else if (crop.stockKg === 0) {
        crop.stockKg = 200;
      }
    }
    return crop;
  }

  delete(id) {
    const idx = this.crops.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) return false;
    this.crops.splice(idx, 1);
    return true;
  }
}

module.exports = new CatalogueStore();
