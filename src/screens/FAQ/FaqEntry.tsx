import { ChevronDown } from 'lucide-react'
import { memo, type ReactNode } from 'react'

interface FaqEntryProps {
  question: string
  answer: ReactNode
}

const FaqEntry = ({ question, answer }: FaqEntryProps) => (
  <details className="faq-item">
    <summary className="faq-item__summary">
      <span>{question}</span>
      <ChevronDown size={16} className="faq-item__chevron" />
    </summary>
    <div className="faq-item__content">{answer}</div>
  </details>
)

export default memo(FaqEntry)
