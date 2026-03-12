import { Info } from 'lucide-react'

const NotificationConfiguration = () => {
  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Choisissez les types de notifications:
      </h3>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <label className="flex items-center gap-2 cursor-not-allowed opacity-60">
          <input type="checkbox" disabled className="rounded" />
          <span>Activer les rappels avant match</span>
        </label>
        <span title="Notifications non disponibles pour le moment">
          <Info size={14} className="text-gray-300" />
        </span>
      </div>
    </div>
  )
}

export default NotificationConfiguration
