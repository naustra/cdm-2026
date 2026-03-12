import type { ReactNode } from 'react'
import Item from './item/item'

interface ListProps {
  dataSource?: ReactNode[]
}

const List = ({ dataSource = [] }: ListProps) => (
  <ul className="rule_list">
    {dataSource.map((donnee, id) => (
      <Item donnee={donnee} key={id} />
    ))}
  </ul>
)

export default List
