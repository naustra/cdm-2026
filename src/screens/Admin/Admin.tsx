import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useIsUserAdmin } from '../../hooks/user'
import { useMatches, type NormalizedMatch } from '../../hooks/matches'
import Flag from 'components/Flag'

type MatchScoreEdit = {
  scoreA: string
  scoreB: string
}

function AdminMatchRow({
  match,
  onSave,
  onClear,
}: {
  match: NormalizedMatch
  onSave: (matchId: string, scoreA: number, scoreB: number) => Promise<void>
  onClear: (matchId: string) => Promise<void>
}) {
  const [scores, setScores] = useState<MatchScoreEdit>({
    scoreA: match.scores.A?.toString() ?? '',
    scoreB: match.scores.B?.toString() ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [clearing, setClearing] = useState(false)

  const hasScore = match.scores.A !== null && match.scores.B !== null

  const hasChanges =
    scores.scoreA !== (match.scores.A?.toString() ?? '') ||
    scores.scoreB !== (match.scores.B?.toString() ?? '')

  const isValid = scores.scoreA !== '' && scores.scoreB !== ''

  const handleSave = useCallback(async () => {
    if (!isValid || !hasChanges) return
    setSaving(true)
    await onSave(match.id, parseInt(scores.scoreA), parseInt(scores.scoreB))
    setSaving(false)
  }, [match.id, scores, isValid, hasChanges, onSave])

  const handleClear = useCallback(async () => {
    setClearing(true)
    await onClear(match.id)
    setClearing(false)
  }, [match.id, onClear])

  return (
    <div className={`admin-match-row ${match.finished ? 'admin-match-row--finished' : ''}`}>
      <div className="admin-match-teams">
        <div className="admin-match-team">
          <Flag country={match.teamACode ?? ''} style={{ width: 24, height: 24 }} />
          <span>{match.teamAName ?? match.teamA}</span>
        </div>
        <span className="admin-match-vs">vs</span>
        <div className="admin-match-team">
          <Flag country={match.teamBCode ?? ''} style={{ width: 24, height: 24 }} />
          <span>{match.teamBName ?? match.teamB}</span>
        </div>
      </div>

      <div className="admin-match-meta">
        <span className="admin-match-phase">
          {formatPhase(match.phase)} — {match.groupName ?? ''}
        </span>
        {match.finished && <span className="admin-match-badge">Terminé</span>}
      </div>

      <div className="admin-match-scores">
        <input
          type="number"
          min="0"
          className="admin-score-input"
          value={scores.scoreA}
          onChange={(e) => setScores({ ...scores, scoreA: e.target.value })}
          placeholder="—"
        />
        <span className="admin-score-separator">–</span>
        <input
          type="number"
          min="0"
          className="admin-score-input"
          value={scores.scoreB}
          onChange={(e) => setScores({ ...scores, scoreB: e.target.value })}
          placeholder="—"
        />

        <button
          className={`admin-save-btn ${hasChanges && isValid ? 'admin-save-btn--active' : ''}`}
          disabled={!hasChanges || !isValid || saving}
          onClick={handleSave}
        >
          {saving ? '...' : 'Sauver'}
        </button>

        {hasScore && (
          <button
            className="admin-clear-btn"
            disabled={clearing}
            onClick={handleClear}
          >
            {clearing ? '...' : 'Vider'}
          </button>
        )}
      </div>
    </div>
  )
}

function formatPhase(phase: string | null): string {
  switch (phase) {
    case '0':
      return 'Groupes'
    case '4':
      return '32èmes'
    case '2':
      return '16èmes'
    case '3':
      return 'Quarts'
    case '1':
      return 'Demies'
    default:
      return 'Finale'
  }
}

const Admin = () => {
  const isAdmin = useIsUserAdmin()
  const navigate = useNavigate()
  const matches = useMatches()
  const [filter, setFilter] = useState<'all' | 'pending' | 'finished'>('pending')

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
    }
  }, [isAdmin, navigate])

  const handleSaveScore = useCallback(
    async (matchId: string, scoreA: number, scoreB: number) => {
      const { error } = await supabase
        .from('matches')
        .update({ score_a: scoreA, score_b: scoreB, finished: true })
        .eq('id', matchId)

      if (error) {
        toast.error(`Erreur: ${error.message}`)
        return
      }
      toast.success('Score mis à jour — points recalculés')
      window.location.reload()
    },
    [],
  )

  const handleClearScore = useCallback(
    async (matchId: string) => {
      const { error } = await supabase
        .from('matches')
        .update({ score_a: null, score_b: null, finished: false })
        .eq('id', matchId)

      if (error) {
        toast.error(`Erreur: ${error.message}`)
        return
      }
      toast.success('Score vidé')
      window.location.reload()
    },
    [],
  )

  if (!isAdmin) return null
  if (!matches) return <div className="page-loader">Chargement...</div>

  const filteredMatches = matches.filter((m) => {
    if (filter === 'pending') return !m.finished
    if (filter === 'finished') return m.finished
    return true
  })

  const groupedByPhase = filteredMatches.reduce<Record<string, NormalizedMatch[]>>(
    (acc, match) => {
      const key = formatPhase(match.phase)
      if (!acc[key]) acc[key] = []
      acc[key].push(match)
      return acc
    },
    {},
  )

  return (
    <div className="admin-page">
      <h1 className="admin-title">Administration</h1>
      <p className="admin-subtitle">
        Mettre à jour les scores déclenche le recalcul automatique des points.
      </p>

      <div className="admin-filters">
        <button
          className={`matches-tab ${filter === 'pending' ? 'matches-tab--active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          À jouer ({matches.filter((m) => !m.finished).length})
        </button>
        <button
          className={`matches-tab ${filter === 'finished' ? 'matches-tab--active' : ''}`}
          onClick={() => setFilter('finished')}
        >
          Terminés ({matches.filter((m) => m.finished).length})
        </button>
        <button
          className={`matches-tab ${filter === 'all' ? 'matches-tab--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tous ({matches.length})
        </button>
      </div>

      {Object.entries(groupedByPhase).map(([phase, phaseMatches]) => (
        <div key={phase} className="admin-phase-group">
          <h2 className="admin-phase-title">{phase}</h2>
          {phaseMatches.map((match) => (
            <AdminMatchRow key={match.id} match={match} onSave={handleSaveScore} onClear={handleClearScore} />
          ))}
        </div>
      ))}

      {filteredMatches.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>
          Aucun match dans cette catégorie.
        </p>
      )}
    </div>
  )
}

export default Admin
