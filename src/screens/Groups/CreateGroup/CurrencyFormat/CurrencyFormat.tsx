import { type ChangeEvent, forwardRef, type InputHTMLAttributes } from 'react'

interface CurrencyFormatProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (event: { target: { value: string } }) => void
}

const CurrencyFormat = forwardRef<HTMLInputElement, CurrencyFormatProps>(
  ({ onChange, ...other }, ref) => (
    <input
      {...other}
      ref={ref}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onChange({ target: { value: e.target.value } })
      }}
    />
  ),
)

CurrencyFormat.displayName = 'CurrencyFormat'

export default CurrencyFormat
