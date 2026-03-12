import { type ReactNode } from 'react'

interface ReversibleProps {
  direction?: 'rtl' | 'ltr'
  children?: ReactNode[]
  [key: string]: unknown
}

const Reversible = ({ direction, children, ...rest }: ReversibleProps) => {
  const orderedChildren =
    direction === 'rtl' && children && children.slice
      ? children.slice().reverse()
      : children
  return <div {...rest}>{orderedChildren}</div>
}

export default Reversible
