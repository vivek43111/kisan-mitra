/**
 * Real Crop Product Images Mapping & Fallbacks
 * Serves local high-resolution agricultural photographs stored in /images/crops/
 */

export const CROP_IMAGES = {
  1: '/images/crops/rice.jpg',
  2: '/images/crops/wheat.jpg',
  3: '/images/crops/potato.jpg',
  4: '/images/crops/tomato.jpg',
  5: '/images/crops/onion.jpg',
  6: '/images/crops/maize.jpg',
  7: '/images/crops/mango.jpg',
  8: '/images/crops/cabbage.jpg',
}

export function getCropImage(crop) {
  if (!crop) return '/images/crops/wheat.jpg'
  if (crop.image && typeof crop.image === 'string' && crop.image.startsWith('/images/')) {
    return crop.image
  }
  if (crop.id && CROP_IMAGES[crop.id]) {
    return CROP_IMAGES[crop.id]
  }

  const name = (crop.name || crop.cropName || '').toLowerCase()
  if (name.includes('rice') || name.includes('basmati') || name.includes('chawal')) return '/images/crops/rice.jpg'
  if (name.includes('wheat') || name.includes('sharbati') || name.includes('gehun')) return '/images/crops/wheat.jpg'
  if (name.includes('potato') || name.includes('aloo')) return '/images/crops/potato.jpg'
  if (name.includes('tomato') || name.includes('tamatar')) return '/images/crops/tomato.jpg'
  if (name.includes('onion') || name.includes('pyaaz')) return '/images/crops/onion.jpg'
  if (name.includes('maize') || name.includes('corn') || name.includes('makka')) return '/images/crops/maize.jpg'
  if (name.includes('mango') || name.includes('aam')) return '/images/crops/mango.jpg'
  if (name.includes('cabbage') || name.includes('patta')) return '/images/crops/cabbage.jpg'

  return '/images/crops/wheat.jpg'
}
