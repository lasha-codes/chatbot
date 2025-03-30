'use client'

import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { PiOpenAiLogoDuotone } from 'react-icons/pi'

interface Message {
  role: 'user' | 'ai'
  content: string
}

const Home = () => {
  const [prompt, setPrompt] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessages((prev) => [...prev, { role: 'user', content: prompt }])
    setPrompt('')

    const { data } = await axios.post(`/api/bot`, {
      prompt,
    })

    setMessages((prev) => [
      ...prev,
      { role: 'ai', content: data?.response || 'Something went wrong' },
    ])
  }

  return (
    <div className='p-10'>
      <div className='w-full flex flex-col items-start gap-5'>
        <div className='w-full flex flex-col items-start gap-5'>
          {messages.map((message, idx) => (
            <div key={idx} className='w-full flex items-start gap-3'>
              <div className=''>
                {message.role === 'user' ? (
                  <div className='flex items-center gap-2'>
                    <FaUserCircle className='text-4xl' />
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <PiOpenAiLogoDuotone className='text-4xl text-[#2897d8]' />
                  </div>
                )}
              </div>
              <p className='w-full'>{message.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className='w-full'>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Say something...'
          />
        </form>
      </div>
    </div>
  )
}

export default Home
