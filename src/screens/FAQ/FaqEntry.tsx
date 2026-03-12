import { ChevronDown } from 'lucide-react'
import { memo, type ReactNode } from 'react'

interface FaqEntryProps {
  question: string
  answer: ReactNode
}

const FaqEntry = ({ question, answer }: FaqEntryProps) => (
  <details className="group bg-white rounded-xl mb-2 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
    <summary className="w-full flex items-center justify-between p-4 text-left font-semibold text-navy text-sm cursor-pointer list-none [&::-webkit-details-marker]:hidden">
      <span>{question}</span>
      <ChevronDown
        size={16}
        className="w-4 h-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180"
      />
    </summary>
    <div className="px-4 pb-4 text-sm text-gray-600 [&_a]:text-indigo-500 [&_a]:font-medium">
      {answer}
    </div>
  </details>
)

export default memo(FaqEntry)
