import type { ReactNode, HTMLAttributes } from 'react'

interface ReversibleProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'rtl' | 'ltr'
  children?: ReactNode[]
}

const Reversible = ({ direction, children, ...rest }: ReversibleProps) => {
  const orderedChildren =
    direction === 'rtl' && children && Array.isArray(children)
      ? [...children].reverse()
      : children
  return <div {...rest}>{orderedChildren}</div>
}

export default Reversible
