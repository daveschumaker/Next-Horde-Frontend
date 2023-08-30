import { CSSProperties, ReactNode } from 'react'

export default function FlexCol({
  children,
  className,
  gap = 0,
  mb = 0,
  mt = 0,
  pb = 0,
  style = {}
}: {
  children: ReactNode
  className?: string
  gap?: number
  mb?: number
  mt?: number
  pb?: number
  style?: CSSProperties
}) {
  const defaultStyleObj = {
    display: 'flex',
    rowGap: gap ? `${gap}px` : undefined,
    flexDirection: 'column',
    marginBottom: mb ? `${mb}px` : undefined,
    marginTop: mt ? `${mt}px` : undefined,
    paddingBottom: pb ? `${pb}px` : undefined,
    width: '100%'
  }

  return (
    <div
      className={className}
      style={Object.assign({}, defaultStyleObj, style)}
    >
      {children}
    </div>
  )
}
