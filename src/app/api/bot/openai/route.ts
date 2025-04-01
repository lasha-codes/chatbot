import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const { messages, model = null } = await req.json()

    const response = await generateText({
      model: openai(model || 'chatgpt-4o-latest'),
      messages,
    })

    return NextResponse.json({ response: response.text }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ response: 'Limit reached' })
  }
}
