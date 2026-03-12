import type { ReactNode } from 'react'

interface ItemProps {
  donnee?: ReactNode
}

const Item = ({ donnee = '' }: ItemProps) => <li>{donnee}</li>

export default Item
