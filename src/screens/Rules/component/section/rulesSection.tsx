import type { ReactNode } from 'react'

interface RulesSectionProps {
  children?: ReactNode
}

const RulesSection = ({ children }: RulesSectionProps) => (
  <div className="rules-section">{children}</div>
)

export default RulesSection
