'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const quickQuestions = [
  "Explain photosynthesis",
  "Help with algebra homework",
  "What is the Pythagorean theorem?",
  "Summarize World War 2",
  "Explain DNA structure",
  "How do I write a good essay?",
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return

    const userMessage: Message = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickQuestion = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎓 School AI Assistant</h1>
        <p>Your intelligent companion for learning and homework help</p>
      </div>

      <div className="main-content">
        {messages.length === 0 ? (
          <>
            <div className="features">
              <div className="feature-card">
                <h3>📚 Homework Help</h3>
                <p>Get assistance with math, science, history, and more</p>
              </div>
              <div className="feature-card">
                <h3>✍️ Writing Support</h3>
                <p>Improve your essays and creative writing</p>
              </div>
              <div className="feature-card">
                <h3>🧪 Science Explanations</h3>
                <p>Understand complex scientific concepts</p>
              </div>
              <div className="feature-card">
                <h3>🔢 Math Tutoring</h3>
                <p>Solve problems step-by-step</p>
              </div>
            </div>

            <div className="quick-questions">
              <h3>Try asking:</h3>
              <div className="quick-questions-grid">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="chat-container">
            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <div className="message-role">
                    {msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div className="loading">AI is thinking...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit} className="input-container">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your schoolwork..."
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <button type="submit" disabled={loading || !input.trim()}>
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
