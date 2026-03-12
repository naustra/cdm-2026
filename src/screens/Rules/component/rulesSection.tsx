import type { ReactNode } from 'react'

interface RulesSectionProps {
  children?: ReactNode
}

const RulesSection = ({ children }: RulesSectionProps) => (
  <div className="mb-8">{children}</div>
)

export default RulesSection
