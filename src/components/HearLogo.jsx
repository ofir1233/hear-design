const PATH = "M63.6202 25.6905C66.431 26.6546 69 26.1754 69 28.5414C69 30.9074 65.4639 29.2245 61.4139 32.459C57.364 35.6935 56.1551 40.0061 53.4954 45.4868C50.8357 50.9675 46.5138 61.4496 39.1091 59.8324C31.7043 58.2151 34.2129 46.1157 34.0618 41.1741C33.9106 36.2325 33.2457 32.5189 29.2865 32.0696C25.3272 31.6204 23.0302 34.6153 20.7332 38.2391C18.4363 41.863 16.502 49.3802 11.0315 47.7629C5.5611 46.1457 9.3088 36.1726 7.46518 33.2077C5.62155 30.2427 3.17346 30.1886 2.29698 30.1886C1.4205 30.1886 8.16629e-06 29.7394 0 28.5714C-8.16629e-06 27.4033 1.26938 27.0739 2.29698 27.0739C3.32457 27.0739 4.60326 27.2375 7.19317 26.5291C13.6307 24.7681 12.8147 11.2251 20.1288 11.5845C27.0146 11.9229 23.4533 26.0798 30.0118 26.0798C36.5703 26.0798 38.7464 18.5027 41.4665 12.8424C44.1866 7.18205 49.4152 -1.32349 56.1551 0.173941C62.8949 1.67137 60.5677 14.1302 60.1445 18.0535C59.7214 21.9768 60.8095 24.7264 63.6202 25.6905Z"

const CX = 34.5
const CY = 30
const GREY_SHADES = ['#6B7280', '#4B5563', '#9CA3AF', '#374151', '#6B7280', '#4B5563', '#9CA3AF']

function makeDots(r, count, prefix) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    return {
      id: `${prefix}-${i}`,
      x: CX + r * Math.cos(angle),
      y: CY + r * Math.sin(angle),
      r: i % 7 === 0 ? 2.4 : i % 3 === 0 ? 1.9 : 1.4,
      fill: GREY_SHADES[i % GREY_SHADES.length],
      opacity: i % 4 === 0 ? 0.7 : i % 2 === 0 ? 0.45 : 0.28,
    }
  })
}

const DOTS_INNER = makeDots(62, 28, 'logoDot')

export default function HearLogo({ className = '', isActive = false }) {
  return (
    <svg
      data-inspector="HearLogo"
      className={className}
      viewBox="0 0 69 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {isActive && (
        <defs>
          <linearGradient
            id="logoRadiance"
            x1="0" y1="0" x2="69" y2="60"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#1045A0" />
            <stop offset="20%"  stopColor="#1779F7" />
            <stop offset="40%"  stopColor="#4DA3FF" />
            <stop offset="60%"  stopColor="#38BDF8" />
            <stop offset="80%"  stopColor="#1779F7" />
            <stop offset="100%" stopColor="#1045A0" />
          </linearGradient>
        </defs>
      )}

      {/* Inner dot ring — rotates clockwise */}
      {isActive && (
        <g id="logoDotsRing" style={{ opacity: 0, willChange: 'transform' }}>
          {DOTS_INNER.map((d) => (
            <circle key={d.id} id={d.id} cx={d.x} cy={d.y} r={d.r} fill={d.fill} opacity={d.opacity} />
          ))}
        </g>
      )}


      {/* Base layer — always orange */}
      <path d={PATH} fill="#FF7056" />

      {/* Gradient layer — fades in over the base */}
      {isActive && (
        <path
          id="logoGradPath"
          d={PATH}
          fill="url(#logoRadiance)"
          style={{ opacity: 0 }}
        />
      )}
    </svg>
  )
}
