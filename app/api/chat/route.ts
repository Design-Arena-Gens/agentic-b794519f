import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!ANTHROPIC_API_KEY) {
      // Fallback mock response if no API key
      return NextResponse.json({
        message: "I'm a School AI Assistant here to help you with your studies! I can help with:\n\n• Math problems and explanations\n• Science concepts\n• History and social studies\n• Essay writing and grammar\n• Study tips and organization\n\nWhat would you like help with today?"
      })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: `You are a helpful AI assistant for school students. Your role is to:
- Help students understand concepts, not just give answers
- Encourage critical thinking and learning
- Be patient, clear, and educational
- Break down complex topics into simpler parts
- Provide step-by-step explanations when needed
- Support various subjects: math, science, history, literature, etc.
- Help with writing, proofreading, and study strategies
- Be encouraging and positive

Always aim to teach and guide rather than just provide direct answers. Help students learn HOW to solve problems themselves.`,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    const assistantMessage = data.content[0].text

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
