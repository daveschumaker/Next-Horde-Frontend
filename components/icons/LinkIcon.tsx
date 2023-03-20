// Modified via: https://tabler-icons.io/

const LinkIcon = ({
  className,
  fill = 'none',
  size = 24,
  stroke = 'currentColor',
  active = false
}: {
  className?: string
  fill?: string
  size?: number
  stroke?: string,
  active?: boolean
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke={stroke}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path>
      <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path>
      {active && (
        <>
          <path d="M17 22v-2"></path>
          <path d="M20 17h2"></path>
          <path d="M2 7h2"></path>
          <path d="M7 2v2"></path>
        </>
      )}
    </svg>
  )
}

export default LinkIcon
