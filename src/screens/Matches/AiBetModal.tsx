import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { saveBatchBets } from '../../hooks/bets'
import {
  generatePredictions,
  type AiProvider,
} from '../../lib/openrouter'
import type { NormalizedMatch } from '../../hooks/matches'

type ModalStep = 'prompt' | 'choose' | 'loading' | 'error'

interface AiBetModalProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
  matches: NormalizedMatch[]
  bettedMatchIds: Set<string>
  isAdmin: boolean
}

const PROMPT_SUGGESTIONS = [
  'Mbappé va tout casser cette année',
  'La France gagne, c\'est écrit',
  'Que des buts et du spectacle !',
  'Je connais rien au foot, surprise-moi',
  'Les outsiders vont créer la surprise',
]

const AI_PROVIDERS: {
  id: AiProvider
  flag: string
  title: string
  subtitle: string
  label: string
}[] = [
  {
    id: 'openai',
    flag: '🇺🇸',
    title: 'IA Américaine',
    subtitle: 'Yes, of course!',
    label: 'OpenAI',
  },
  {
    id: 'deepseek',
    flag: '🇨🇳',
    title: 'IA Chinoise',
    subtitle: "L'IA qui fait trembler la Silicon Valley",
    label: 'DeepSeek',
  },
  {
    id: 'mistral',
    flag: '🇫🇷',
    title: 'Une IA française, monsieur',
    subtitle: 'Cocorico !',
    label: 'Mistral',
  },
]

function computeMatchesToPredict(
  matches: NormalizedMatch[],
  bettedMatchIds: Set<string>,
  overwrite: boolean,
): NormalizedMatch[] {
  const withTeams = matches.filter((m) => m.teamAName && m.teamBName)
  if (overwrite) return withTeams
  return withTeams.filter((m) => !bettedMatchIds.has(m.id))
}

const AiBetModal = ({
  open,
  onClose,
  onComplete,
  matches,
  bettedMatchIds,
  isAdmin,
}: AiBetModalProps) => {
  const { user } = useAuth()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [step, setStep] = useState<ModalStep>('prompt')
  const [prompt, setPrompt] = useState('')
  const [overwriteExisting, setOverwriteExisting] = useState(isAdmin)
  const [error, setError] = useState<string | null>(null)

  const hasSomeBets = useMemo(
    () => matches.some((m) => bettedMatchIds.has(m.id)),
    [matches, bettedMatchIds],
  )

  const matchesToPredict = useMemo(
    () => computeMatchesToPredict(matches, bettedMatchIds, overwriteExisting),
    [matches, bettedMatchIds, overwriteExisting],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
      setStep('prompt')
      setError(null)
    } else {
      dialog.close()
    }
  }, [open])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget && step !== 'loading') {
        handleClose()
      }
    },
    [step, handleClose],
  )

  const handleGoToChoose = useCallback(() => {
    setStep('choose')
  }, [])

  const handleBackToPrompt = useCallback(() => {
    setStep('prompt')
    setError(null)
  }, [])

  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(e.target.value)
    },
    [],
  )

  const handleOverwriteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOverwriteExisting(e.target.checked)
    },
    [],
  )

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setPrompt(suggestion)
  }, [])

  const handleChooseProvider = useCallback(
    async (provider: AiProvider) => {
      if (!user) return
      setStep('loading')
      setError(null)

      try {
        const predictions = await generatePredictions(
          matchesToPredict,
          prompt,
          provider,
        )

        if (predictions.length === 0) {
          throw new Error("L'IA n'a retourné aucun pronostic valide")
        }

        const count = await saveBatchBets(user.id, predictions)
        toast.success(`${count} pronostic${count > 1 ? 's' : ''} rempli${count > 1 ? 's' : ''} par l'IA !`)
        onComplete()
        onClose()
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue')
        setStep('error')
      }
    },
    [user, matchesToPredict, prompt, onComplete, onClose],
  )

  return createPortal(
    <dialog
      ref={dialogRef}
      className="modal-dialog modal-dialog--ai"
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <div className="ai-modal">
        {step !== 'loading' && (
          <button className="ai-modal__close" onClick={handleClose}>
            <X size={18} />
          </button>
        )}

        {step === 'prompt' && (
          <div className="ai-modal__step">
            <div className="ai-modal__icon">✨</div>
            <h2 className="ai-modal__title">Laisse l'IA pronostiquer</h2>
            <p className="ai-modal__desc">
              Écris tes préférences et l'IA remplira tes pronostics
            </p>

            <textarea
              className="ai-modal__textarea"
              placeholder="Ex: Je pense que la France va gagner..."
              value={prompt}
              onChange={handlePromptChange}
              rows={3}
            />

            <div className="ai-modal__suggestions">
              {PROMPT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="ai-modal__suggestion"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {hasSomeBets && (
              <label className="ai-modal__checkbox">
                <input
                  type="checkbox"
                  checked={overwriteExisting}
                  onChange={handleOverwriteChange}
                />
                <span>Réécrire aussi mes pronostics existants</span>
              </label>
            )}

            <p className="ai-modal__count">
              {matchesToPredict.length} match
              {matchesToPredict.length > 1 ? 's' : ''} à pronostiquer
            </p>

            <button
              className="btn btn--primary ai-modal__next"
              onClick={handleGoToChoose}
              disabled={matchesToPredict.length === 0}
            >
              Choisir mon IA
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 'choose' && (
          <div className="ai-modal__step">
            <h2 className="ai-modal__title">Choisis ton IA</h2>
            <p className="ai-modal__desc">
              Chaque IA a sa propre vision du football
            </p>

            <div className="ai-modal__providers">
              {AI_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  className="ai-modal__provider"
                  onClick={() => handleChooseProvider(p.id)}
                >
                  <span className="ai-modal__provider-flag">{p.flag}</span>
                  <div className="ai-modal__provider-info">
                    <span className="ai-modal__provider-title">{p.title}</span>
                    <span className="ai-modal__provider-subtitle">
                      {p.subtitle}
                    </span>
                  </div>
                  <span className="ai-modal__provider-label">{p.label}</span>
                </button>
              ))}
            </div>

            <button
              className="btn btn--ghost ai-modal__back"
              onClick={handleBackToPrompt}
            >
              ← Retour
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="ai-modal__step ai-modal__step--center">
            <div className="ai-modal__spinner" />
            <h2 className="ai-modal__title">L'IA réfléchit...</h2>
            <p className="ai-modal__desc">
              Analyse des équipes et génération des pronostics
            </p>
            <p className="ai-modal__hint">
              Ça peut prendre quelques secondes
            </p>
          </div>
        )}

        {step === 'error' && (
          <div className="ai-modal__step ai-modal__step--center">
            <div className="ai-modal__icon">😬</div>
            <h2 className="ai-modal__title">Oups !</h2>
            <p className="ai-modal__desc">{error}</p>
            <button
              className="btn btn--primary"
              onClick={handleBackToPrompt}
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  )
}

export default AiBetModal
