import type { ReactNode } from 'react'

interface RuleTableProps {
  header?: ReactNode[]
  rows?: ReactNode[][]
}

const RuleTable = ({ header = [], rows = [[]] }: RuleTableProps) => (
  <div className="rules-table-wrapper">
    <table className="rules-table">
      <thead>
        <tr>
          {header.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((col, j) => (
              <td key={j}>{col}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default RuleTable
