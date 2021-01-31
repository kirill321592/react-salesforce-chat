const Arrow = props => {
  const id = Math.random()

  return (
    <svg width="34" height="32" viewBox="0 0 34 32" fill="none" {...props}>
      <g filter={`url(#arrow-${id})`}>
        <path d="M17.5625 9.25L24.3125 16L17.5625 22.75" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23.375 16H9.6875" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <filter id={`arrow-${id}`} x="-2.68" y="-3.68" width="39.36" height="39.36" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="3.84" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}

export default Arrow
