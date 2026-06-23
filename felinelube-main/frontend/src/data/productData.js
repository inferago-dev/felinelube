export const products = [
  {
    id: 1,
    name: 'Feline F45 Fully Synthetic',
    category: 'Fully Synthetic',
    viscosity: '5W-40',
    price: 185.00,
    rating: 4.9,
    imageLabel: 'FULLY SYNTHETIC',
    color: '#D4A017',
    description: 'Ultimate performance for modern turbocharged engines. Provides maximum protection under extreme temperatures.',
    specs: [
      { label: 'Viscosity Grade', value: '5W-40' },
      { label: 'Base Oil', value: 'Group IV PAO' },
      { label: 'Type', value: 'Fully Synthetic' }
    ],
    variants: [
      { size: '1L', price: 55.00, stock: 50 },
      { size: '4L', price: 185.00, stock: 120 },
      { size: '18L', price: 780.00, stock: 5 },
      { size: '209L', price: 8500.00, stock: 2 }
    ]
  },
  {
    id: 2,
    name: 'Feline F30 Semi Synthetic',
    category: 'Semi Synthetic',
    viscosity: '10W-40',
    price: 125.00,
    rating: 4.7,
    imageLabel: 'SEMI SYNTHETIC',
    color: '#A87C10',
    description: 'Advanced protection for daily commuters and high-mileage engines.',
    specs: [
      { label: 'Viscosity Grade', value: '10W-40' },
      { label: 'Base Oil', value: 'Synthetic Blend' },
      { label: 'Type', value: 'Semi Synthetic' }
    ],
    variants: [
      { size: '1L', price: 38.00, stock: 40 },
      { size: '4L', price: 125.00, stock: 85 },
      { size: '18L', price: 520.00, stock: 10 },
      { size: '209L', price: 5800.00, stock: 0 }
    ]
  },
  {
    id: 3,
    name: 'Feline F20 Mineral Series',
    category: 'Mineral',
    viscosity: '15W-40',
    price: 85.00,
    rating: 4.5,
    imageLabel: 'MINERAL OIL',
    color: '#9A9A9A',
    description: 'Reliable lubrication for older engine designs and light-duty commercial vehicles.',
    specs: [
      { label: 'Viscosity Grade', value: '15W-40' },
      { label: 'Base Oil', value: 'Premium Mineral' },
      { label: 'Type', value: 'Mineral' }
    ],
    variants: [
      { size: '1L', price: 25.00, stock: 100 },
      { size: '4L', price: 85.00, stock: 150 },
      { size: '18L', price: 350.00, stock: 20 },
      { size: '209L', price: 3900.00, stock: 5 }
    ]
  },
  {
    id: 4,
    name: 'Feline T80 Heavy Duty',
    category: 'Heavy Duty',
    viscosity: '15W-40',
    price: 240.00,
    rating: 4.9,
    imageLabel: 'HEAVY DUTY',
    color: '#C0C0C0',
    description: 'Industrial-strength diesel engine oil for trucks, tractors, and heavy machinery.',
    specs: [
      { label: 'Viscosity Grade', value: '15W-40' },
      { label: 'Base Oil', value: 'Fully Synthetic' },
      { label: 'Application', value: 'Diesel Engines' }
    ],
    variants: [
      { size: '1L', price: 65.00, stock: 30 },
      { size: '4L', price: 240.00, stock: 60 },
      { size: '18L', price: 950.00, stock: 15 },
      { size: '209L', price: 10500.00, stock: 3 }
    ]
  },
  {
    id: 5,
    name: 'Feline G90 Gear Oil',
    category: 'Industrial',
    viscosity: '80W-90',
    price: 45.00,
    rating: 4.8,
    imageLabel: 'GEAR OIL',
    color: '#E8B84B',
    description: 'Extreme pressure gear lubricant for differentials and manual transmissions.',
    specs: [
      { label: 'Viscosity Grade', value: '80W-90' },
      { label: 'Type', value: 'EP Lubricant' },
      { label: 'Application', value: 'Gear & Transmission' }
    ],
    variants: [
      { size: '1L', price: 45.00, stock: 80 },
      { size: '4L', price: 160.00, stock: 45 },
      { size: '18L', price: 650.00, stock: 8 },
      { size: '209L', price: 7200.00, stock: 1 }
    ]
  },
  {
    id: 6,
    name: 'Feline M50 Moto Series',
    category: 'Motorcycle',
    viscosity: '10W-40',
    price: 35.00,
    rating: 4.9,
    imageLabel: '4T MOTO',
    color: '#D4A017',
    description: 'High-revving protection for 4-stroke motorcycle engines and wet-clutch systems.',
    specs: [
      { label: 'Viscosity Grade', value: '10W-40' },
      { label: 'Standard', value: 'JASO MA2' },
      { label: 'Base Oil', value: 'Fully Synthetic' }
    ],
    variants: [
      { size: '1L', price: 35.00, stock: 200 },
      { size: '4L', price: 130.00, stock: 120 },
      { size: '18L', price: 500.00, stock: 0 },
      { size: '209L', price: 5500.00, stock: 0 }
    ]
  }
];

export const productData = products[0]; // For the details page fallback
