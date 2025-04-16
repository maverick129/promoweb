export interface Store {
  id: string
  name: string
  address: string
  city: string
  province: string
  latitude: number
  longitude: number
  phone: string
  email: string
  openingHours: string
}

export const stores: Store[] = [
  // East Java Stores
  {
    id: '1',
    name: 'Jivaphala Surabaya',
    address: 'Jl. Tunjungan No. 45',
    city: 'Surabaya',
    province: 'East Java',
    latitude: -7.2575,
    longitude: 112.7521,
    phone: '+62 31 1234567',
    email: 'surabaya@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '2',
    name: 'Jivaphala Malang',
    address: 'Jl. Merdeka No. 12',
    city: 'Malang',
    province: 'East Java',
    latitude: -7.9778,
    longitude: 112.6308,
    phone: '+62 341 2345678',
    email: 'malang@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '3',
    name: 'Jivaphala Kediri',
    address: 'Jl. Dhoho No. 78',
    city: 'Kediri',
    province: 'East Java',
    latitude: -7.8167,
    longitude: 112.0167,
    phone: '+62 354 3456789',
    email: 'kediri@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '4',
    name: 'Jivaphala Madiun',
    address: 'Jl. Pahlawan No. 23',
    city: 'Madiun',
    province: 'East Java',
    latitude: -7.6298,
    longitude: 111.5239,
    phone: '+62 351 4567890',
    email: 'madiun@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '5',
    name: 'Jivaphala Jember',
    address: 'Jl. Gajah Mada No. 56',
    city: 'Jember',
    province: 'East Java',
    latitude: -8.1724,
    longitude: 113.7009,
    phone: '+62 331 5678901',
    email: 'jember@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '6',
    name: 'Jivaphala Banyuwangi',
    address: 'Jl. Ahmad Yani No. 34',
    city: 'Banyuwangi',
    province: 'East Java',
    latitude: -8.2191,
    longitude: 114.3691,
    phone: '+62 333 6789012',
    email: 'banyuwangi@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '7',
    name: 'Jivaphala Probolinggo',
    address: 'Jl. Suroyo No. 67',
    city: 'Probolinggo',
    province: 'East Java',
    latitude: -7.7764,
    longitude: 113.2167,
    phone: '+62 335 7890123',
    email: 'probolinggo@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '8',
    name: 'Jivaphala Pasuruan',
    address: 'Jl. Veteran No. 89',
    city: 'Pasuruan',
    province: 'East Java',
    latitude: -7.6461,
    longitude: 112.9008,
    phone: '+62 343 8901234',
    email: 'pasuruan@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '9',
    name: 'Jivaphala Mojokerto',
    address: 'Jl. Majapahit No. 12',
    city: 'Mojokerto',
    province: 'East Java',
    latitude: -7.4705,
    longitude: 112.4401,
    phone: '+62 321 9012345',
    email: 'mojokerto@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '10',
    name: 'Jivaphala Blitar',
    address: 'Jl. Merdeka No. 45',
    city: 'Blitar',
    province: 'East Java',
    latitude: -8.0955,
    longitude: 112.1609,
    phone: '+62 342 0123456',
    email: 'blitar@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },

  // South Sulawesi Stores
  {
    id: '11',
    name: 'Jivaphala Makassar',
    address: 'Jl. Perintis Kemerdekaan No. 12',
    city: 'Makassar',
    province: 'South Sulawesi',
    latitude: -5.1477,
    longitude: 119.4327,
    phone: '+62 411 1234567',
    email: 'makassar@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '12',
    name: 'Jivaphala Parepare',
    address: 'Jl. Jenderal Sudirman No. 45',
    city: 'Parepare',
    province: 'South Sulawesi',
    latitude: -4.0135,
    longitude: 119.6255,
    phone: '+62 421 2345678',
    email: 'parepare@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '13',
    name: 'Jivaphala Palopo',
    address: 'Jl. Andi Djemma No. 78',
    city: 'Palopo',
    province: 'South Sulawesi',
    latitude: -2.9925,
    longitude: 120.1969,
    phone: '+62 471 3456789',
    email: 'palopo@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '14',
    name: 'Jivaphala Maros',
    address: 'Jl. Poros Makassar-Maros No. 23',
    city: 'Maros',
    province: 'South Sulawesi',
    latitude: -5.0068,
    longitude: 119.5725,
    phone: '+62 411 4567890',
    email: 'maros@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '15',
    name: 'Jivaphala Gowa',
    address: 'Jl. Syekh Yusuf No. 56',
    city: 'Gowa',
    province: 'South Sulawesi',
    latitude: -5.3167,
    longitude: 119.7333,
    phone: '+62 411 5678901',
    email: 'gowa@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '16',
    name: 'Jivaphala Takalar',
    address: 'Jl. H. M. Yasin Limpo No. 34',
    city: 'Takalar',
    province: 'South Sulawesi',
    latitude: -5.4167,
    longitude: 119.4333,
    phone: '+62 411 6789012',
    email: 'takalar@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '17',
    name: 'Jivaphala Jeneponto',
    address: 'Jl. Sultan Hasanuddin No. 67',
    city: 'Jeneponto',
    province: 'South Sulawesi',
    latitude: -5.6333,
    longitude: 119.7333,
    phone: '+62 411 7890123',
    email: 'jeneponto@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '18',
    name: 'Jivaphala Bantaeng',
    address: 'Jl. Jenderal Sudirman No. 89',
    city: 'Bantaeng',
    province: 'South Sulawesi',
    latitude: -5.5167,
    longitude: 119.9333,
    phone: '+62 413 8901234',
    email: 'bantaeng@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '19',
    name: 'Jivaphala Bulukumba',
    address: 'Jl. Poros Bulukumba No. 12',
    city: 'Bulukumba',
    province: 'South Sulawesi',
    latitude: -5.5500,
    longitude: 120.2000,
    phone: '+62 413 9012345',
    email: 'bulukumba@jivaphala.com',
    openingHours: '08:00 - 20:00'
  },
  {
    id: '20',
    name: 'Jivaphala Sinjai',
    address: 'Jl. Jenderal Sudirman No. 45',
    city: 'Sinjai',
    province: 'South Sulawesi',
    latitude: -5.2167,
    longitude: 120.1500,
    phone: '+62 413 0123456',
    email: 'sinjai@jivaphala.com',
    openingHours: '08:00 - 20:00'
  }
] 