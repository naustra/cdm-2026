import { Check, X } from 'lucide-react'

const ValidIcon = ({ valid }: { valid: boolean }) => (
  <div
    className="flex items-center justify-center w-5 h-5"
    title={valid ? 'Pari enregistré' : 'Pari invalide'}
  >
    {valid ? (
      <Check size={16} className="text-green-500" />
    ) : (
      <X size={16} className="text-gray-300" />
    )}
  </div>
)

export default ValidIcon
