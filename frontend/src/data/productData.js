export const products = [
  {
    id: 1,
    name: 'Feline F45 Fully Synthetic',
    category: 'Fully Synthetic',
    viscosity: '5W-40',
    api: 'API SP/SN PLUS',
    price: 185.00,
    rating: 4.9,
    imageLabel: 'FULLY SYNTHETIC',
    color: '#D4A017',
    description: 'Ultimate performance for modern turbocharged engines. Provides maximum protection under extreme temperatures.',
    specs: [
      { label: 'Viscosity Grade', value: '5W-40' },
      { label: 'API Standard', value: 'SP / SN PLUS' },
      { label: 'Base Oil', value: 'Group IV PAO' }
    ]
  },
  {
    id: 2,
    name: 'Feline F30 Semi Synthetic',
    category: 'Semi Synthetic',
    viscosity: '10W-40',
    api: 'API SN/CF',
    price: 125.00,
    rating: 4.7,
    imageLabel: 'SEMI SYNTHETIC',
    color: '#A87C10',
    description: 'Advanced protection for daily commuters and high-mileage engines.',
    specs: [
      { label: 'Viscosity Grade', value: '10W-40' },
      { label: 'API Standard', value: 'SN / CF' },
      { label: 'Base Oil', value: 'Synthetic Blend' }
    ]
  },
  {
    id: 3,
    name: 'Feline F20 Mineral Series',
    category: 'Mineral',
    viscosity: '15W-40',
    api: 'API SL/CF',
    price: 85.00,
    rating: 4.5,
    imageLabel: 'MINERAL OIL',
    color: '#9A9A9A',
    description: 'Reliable lubrication for older engine designs and light-duty commercial vehicles.',
    specs: [
      { label: 'Viscosity Grade', value: '15W-40' },
      { label: 'API Standard', value: 'SL / CF' },
      { label: 'Base Oil', value: 'Premium Mineral' }
    ]
  },
  {
    id: 4,
    name: 'Feline T80 Heavy Duty',
    category: 'Heavy Duty',
    viscosity: '15W-40',
    api: 'API CK-4/SN',
    price: 240.00,
    rating: 4.9,
    imageLabel: 'HEAVY DUTY',
    color: '#C0C0C0',
    description: 'Industrial-strength diesel engine oil for trucks, tractors, and heavy machinery.',
    specs: [
      { label: 'Viscosity Grade', value: '15W-40' },
      { label: 'API Standard', value: 'CK-4 / SN' },
      { label: 'Base Oil', value: 'Fully Synthetic' }
    ]
  },
  {
    id: 5,
    name: 'Feline G90 Gear Oil',
    category: 'Industrial',
    viscosity: '80W-90',
    api: 'API GL-5',
    price: 45.00,
    rating: 4.8,
    imageLabel: 'GEAR OIL',
    color: '#E8B84B',
    description: 'Extreme pressure gear lubricant for differentials and manual transmissions.',
    specs: [
      { label: 'Viscosity Grade', value: '80W-90' },
      { label: 'API Standard', value: 'GL-5' },
      { label: 'Type', value: 'EP Lubricant' }
    ]
  },
  {
    id: 6,
    name: 'Feline M50 Moto Series',
    category: 'Motorcycle',
    viscosity: '10W-40',
    api: 'JASO MA2',
    price: 35.00,
    rating: 4.9,
    imageLabel: '4T MOTO',
    color: '#D4A017',
    description: 'High-revving protection for 4-stroke motorcycle engines and wet-clutch systems.',
    specs: [
      { label: 'Viscosity Grade', value: '10W-40' },
      { label: 'API Standard', value: 'SN / JASO MA2' },
      { label: 'Base Oil', value: 'Fully Synthetic' }
    ]
  }
];

export const productData = products[0]; // For the details page fallback
