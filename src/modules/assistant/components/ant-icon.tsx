type AntIconProps = {
  walking?: boolean
  className?: string
}

export function AntIcon({ walking = false, className }: AntIconProps) {
  return (
    <svg
      viewBox="0 0 64 40"
      className={className}
      role="img"
      aria-label="Hormi, la hormiga guía"
    >
      <g className={walking ? 'ant-legs-a' : ''}>
        <path d="M40 22 L46 30 L44 36" className="stroke-agrobot-800" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M28 24 L30 32 L28 38" className="stroke-agrobot-800" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M18 22 L14 29 L16 36" className="stroke-agrobot-800" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      <g className={walking ? 'ant-legs-b' : ''}>
        <path d="M38 24 L36 32 L38 38" className="stroke-agrobot-800" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M26 22 L22 30 L24 36" className="stroke-agrobot-800" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M16 24 L20 31 L18 37" className="stroke-agrobot-800" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      <g className={walking ? 'ant-antennae' : ''}>
        <path d="M50 14 L56 6" className="stroke-agrobot-800" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M50 16 L57 11" className="stroke-agrobot-800" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="56" cy="6" r="1.4" className="fill-agrobot-800" />
        <circle cx="57" cy="11" r="1.4" className="fill-agrobot-800" />
      </g>

      <ellipse cx="20" cy="22" rx="11" ry="8.5" className="fill-agrobot-600" />
      <ellipse cx="34" cy="21" rx="7" ry="6" className="fill-agrobot-700" />
      <circle cx="46" cy="19" r="6.5" className="fill-agrobot-700" />
      <circle cx="48.5" cy="17.5" r="1.3" className="fill-white" />
    </svg>
  )
}
