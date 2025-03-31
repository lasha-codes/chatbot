import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const { messages } = await req.json()

    const response = await generateText({
      model: google('gemini-1.5-flash-latest'),
      messages,
    })

    return NextResponse.json({ response: response.text })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ response: 'Limit reached' })
  }
}
