import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { SendHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AntIcon } from './ant-icon'
import { getGreetingForPath, getTopicsForPath, type GuideTopic } from '../data/guide-topics'
import { matchTopic } from '../lib/match-topic'

type GuideMessage = {
  id: string
  from: 'hormi' | 'user'
  text: string
  href?: string
  hrefLabel?: string
}

function makeId() {
  return Math.random().toString(36).slice(2)
}

export function AntGuide() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<GuideMessage[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const topics = getTopicsForPath(location.pathname)

  function handleToggle() {
    setIsOpen((wasOpen) => {
      if (!wasOpen && !hasOpenedOnce) {
        setMessages([{ id: makeId(), from: 'hormi', text: getGreetingForPath(location.pathname) }])
        setHasOpenedOnce(true)
      }
      return !wasOpen
    })
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isOpen])

  function pushTopicResponse(topic: GuideTopic) {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), from: 'hormi', text: topic.response, href: topic.href, hrefLabel: topic.hrefLabel },
    ])
  }

  function handleTopicClick(topic: GuideTopic) {
    setMessages((prev) => [...prev, { id: makeId(), from: 'user', text: topic.label }])
    pushTopicResponse(topic)
  }

  function handleSend() {
    const query = input.trim()
    if (!query) return
    setMessages((prev) => [...prev, { id: makeId(), from: 'user', text: query }])
    setInput('')

    const match = matchTopic(query, topics)
    if (match) {
      pushTopicResponse(match)
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          from: 'hormi',
          text: 'No tengo una respuesta exacta para eso todavía, pero en el Centro de ayuda seguro encuentras más detalle.',
          href: '/ayuda',
          hrefLabel: 'Ir al Centro de ayuda',
        },
      ])
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="animate-ant-bubble-pop mb-2 flex h-110 w-[320px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-agrobot-100 bg-white shadow-card-hover">
          <div className="flex items-center justify-between gap-2 bg-agrobot-700 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <AntIcon className="h-6 w-9" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">Hormi</p>
                <p className="text-xs text-agrobot-100">Tu guía en TierraMarket</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Cerrar guía"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-surface px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.from === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm',
                    message.from === 'user'
                      ? 'rounded-br-sm bg-agrobot-600 text-white'
                      : 'rounded-bl-sm border border-agrobot-100 bg-white text-foreground',
                  )}
                >
                  <p>{message.text}</p>
                  {message.href && (
                    <Link
                      to={message.href}
                      onClick={() => setIsOpen(false)}
                      className="mt-1.5 inline-block text-xs font-semibold text-agrobot-700 underline underline-offset-2 hover:text-agrobot-800"
                    >
                      {message.hrefLabel ?? 'Ver más'}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-agrobot-100 bg-white px-3 py-2">
            {topics.slice(0, 4).map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleTopicClick(topic)}
                className="rounded-full border border-agrobot-200 bg-agrobot-50 px-2.5 py-1 text-xs font-medium text-agrobot-800 hover:bg-agrobot-100"
              >
                {topic.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 border-t border-agrobot-100 bg-white p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="input-base flex-1"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-agrobot-600 text-white disabled:opacity-40"
              aria-label="Enviar"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? 'Cerrar guía Hormi' : 'Abrir guía Hormi'}
        className="group relative flex h-16 w-24 items-end justify-center"
      >
        <span
          className={cn(
            'relative flex h-12 w-20 items-center justify-center drop-shadow-md transition-transform group-hover:scale-110',
            !isOpen && 'animate-ant-patrol',
          )}
        >
          <AntIcon walking={!isOpen} className="h-11 w-20 animate-ant-bob" />
          <span className="absolute bottom-0 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-black/10 blur-[2px]" />
        </span>
      </button>
    </div>
  )
}
