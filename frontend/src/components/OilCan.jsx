import React from 'react'

export default function OilCan({ accent = '#D4A017', label, viscosity, size = 300 }) {
  const h = Math.round(size * 1.18)
  return (
    <svg width={size} height={h} viewBox="0 0 280 330" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="70" width="160" height="230" rx="18" fill="url(#pCanGrad)" />
      <rect x="95" y="45" width="90" height="35" rx="10" fill="url(#pNeckGrad)" />
      <rect x="118" y="15" width="44" height="38" rx="8" fill="url(#pNozzleGrad)" />
      <rect x="122" y="10" width="36" height="12" rx="5" fill={accent} />
      <rect x="72" y="80" width="22" height="190" rx="6" fill="url(#pShineGrad)" opacity="0.3" />
      <rect x="60" y="120" width="160" height="4" fill="url(#pBandGrad)" />
      <rect x="60" y="260" width="160" height="4" fill="url(#pBandGrad)" />
      <rect x="75" y="138" width="130" height="110" rx="10" fill="rgba(0,0,0,0.3)" />
      
      {/* Logos & Text */}
      <text x="140" y="210" fontFamily="Poppins, sans-serif" fontSize="72" fontWeight="900" fill="url(#pGoldText)" letterSpacing="-4" textAnchor="middle">F</text>
      <text x="140" y="186" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill={accent} letterSpacing="3" textAnchor="middle">FELINE</text>
      <text x="140" y="202" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="400" fill="#9A9A9A" letterSpacing="2" textAnchor="middle">GENUINE LUBRICANTS</text>
      
      {/* Technical Labels */}
      <text x="140" y="230" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" fill="#FFFFFF" letterSpacing="1" textAnchor="middle">{viscosity}</text>
      <text x="140" y="244" fontFamily="Inter, sans-serif" fontSize="7" fill={accent} letterSpacing="1.5" textAnchor="middle">{label}</text>
      
      <defs>
        <linearGradient id="pCanGrad" x1="60" y1="70" x2="220" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1E1E" />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>
        <linearGradient id="pGoldText" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8B84B" />
          <stop offset="100%" stopColor="#A87C10" />
        </linearGradient>
        <linearGradient id="pShineGrad" x1="72" y1="80" x2="94" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pBandGrad" x1="60" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A87C10" />
          <stop offset="50%" stopColor={accent} />
          <stop offset="100%" stopColor="#A87C10" />
        </linearGradient>
      </defs>
    </svg>
  )
}
