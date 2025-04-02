import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const { messages, model = null } = await req.json()

    const response = await generateText({
      model: openai(model || 'chatgpt-4o-latest'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: new URL(
                'https://thumbs.dreamstime.com/b/planet-earth-space-night-some-elements-image-furnished-nasa-52734504.jpg'
              ),
            },
            {
              type: 'image',
              image: new URL(
                'https://boroktimes.com/storage/2023/07/channels4_profile-1200x1200.jpeg'
              ),
            },
          ],
        },
        ...messages,
      ],
    })

    return NextResponse.json({ response: response.text }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ response: 'Limit reached' })
  }
}
