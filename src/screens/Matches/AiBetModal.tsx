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
      className="fixed inset-0 m-auto w-[90vw] max-w-md rounded-2xl bg-white p-0 shadow-xl backdrop:bg-black/40"
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <div className="relative p-6 flex flex-col gap-4">
        {step !== 'loading' && (
          <button
            className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
            onClick={handleClose}
          >
            <X size={18} />
          </button>
        )}

        {step === 'prompt' && (
          <div className="flex flex-col gap-4">
            <div className="text-3xl text-center">✨</div>
            <h2 className="text-lg font-bold text-navy text-center m-0">
              Laisse l'IA pronostiquer
            </h2>
            <p className="text-sm text-gray-500 text-center m-0">
              Écris tes préférences et l'IA remplira tes pronostics
            </p>

            <textarea
              className="w-full py-2.5 px-3.5 border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none transition-colors bg-white focus:border-indigo-500 placeholder:text-gray-300 resize-none"
              placeholder="Ex: Je pense que la France va gagner..."
              value={prompt}
              onChange={handlePromptChange}
              rows={3}
            />

            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="text-xs py-1.5 px-3 rounded-full border border-gray-200 bg-gray-50 text-gray-600 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {hasSomeBets && (
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overwriteExisting}
                  onChange={handleOverwriteChange}
                  className="accent-indigo-500"
                />
                <span>Réécrire aussi mes pronostics existants</span>
              </label>
            )}

            <p className="text-xs text-gray-400 text-center m-0">
              {matchesToPredict.length} match
              {matchesToPredict.length > 1 ? 's' : ''} à pronostiquer
            </p>

            <button
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full border-none cursor-pointer transition-all duration-150 bg-navy text-white py-2.5 px-5 text-sm hover:bg-navy-light disabled:opacity-50"
              onClick={handleGoToChoose}
              disabled={matchesToPredict.length === 0}
            >
              Choisir mon IA
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 'choose' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-navy text-center m-0">
              Choisis ton IA
            </h2>
            <p className="text-sm text-gray-500 text-center m-0">
              Chaque IA a sa propre vision du football
            </p>

            <div className="flex flex-col gap-2">
              {AI_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-indigo-300 hover:shadow-card transition-all text-left"
                  onClick={() => handleChooseProvider(p.id)}
                >
                  <span className="text-2xl">{p.flag}</span>
                  <div className="flex-1">
                    <span className="block text-sm font-semibold text-navy">
                      {p.title}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {p.subtitle}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 py-0.5 px-2 rounded-full">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full border-none cursor-pointer bg-transparent text-gray-500 py-2 px-4 text-sm hover:text-navy hover:bg-navy/[0.04] transition-colors"
              onClick={handleBackToPrompt}
            >
              ← Retour
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
            <h2 className="text-lg font-bold text-navy m-0">
              L'IA réfléchit...
            </h2>
            <p className="text-sm text-gray-500 m-0">
              Analyse des équipes et génération des pronostics
            </p>
            <p className="text-xs text-gray-400 m-0">
              Ça peut prendre quelques secondes
            </p>
          </div>
        )}

        {step === 'error' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-3xl">😬</div>
            <h2 className="text-lg font-bold text-navy m-0">Oups !</h2>
            <p className="text-sm text-gray-500 m-0">{error}</p>
            <button
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full border-none cursor-pointer transition-all duration-150 bg-navy text-white py-2 px-5 text-sm hover:bg-navy-light"
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
