import { NextResponse } from 'next/server'
import axios from 'axios'

interface DeepseekMessage {
  content: string
  reasoning: string
  index?: number
  role: string
}

interface DeepseekResponse {
  data: {
    id: string
    provider: string
    model: string
    object: string
    created: number
    choices: { message: DeepseekMessage }[]
  }
}

export const POST = async (req: Request) => {
  try {
    const { messages } = await req.json()

    const response: DeepseekResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { model: 'deepseek/deepseek-r1-zero:free', messages },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_R1_API_KEY}`,
        },
      }
    )

    const output =
      response?.data?.choices?.[0]?.message?.reasoning ||
      "Couldn't get a response."

    return NextResponse.json({ response: output }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ response: 'Limit reached' })
  }
}
