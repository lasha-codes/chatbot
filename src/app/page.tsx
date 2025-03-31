'use client'

import { Input } from '@/components/ui/input'
import { CoreMessage } from 'ai'
import axios from 'axios'
import { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { PiOpenAiLogoDuotone } from 'react-icons/pi'
import { SendHorizonal } from 'lucide-react'
import 'prismjs/themes/prism.css'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import RenderContent from '@/components/SyntaxHighliter'

const Home = () => {
  const [prompt, setPrompt] = useState<string>('')
  const [messages, setMessages] = useState<CoreMessage[]>([])
  const [displayWords, setDisplayWords] = useState<string[]>([])
  const [generatedIdx, setGeneratedIdx] = useState<number>()

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    const newMessage = { role: 'user', content: prompt } as CoreMessage

    setPrompt('')

    setMessages((prev) => {
      const newMessages = [...prev, newMessage]
      return newMessages
    })

    const { data } = await axios.post(`/api/bot/deepseek/r1`, {
      messages: [...messages, newMessage],
    })

    setMessages((prev) => {
      setGeneratedIdx(prev.length)
      const aiMessage = {
        role: 'assistant',
        content: data?.response || "Couldn't generate response",
      } as CoreMessage
      return [...prev, aiMessage]
    })

    if (data.response) {
      const words = data.response.split(' ')
      setDisplayWords([])
      words.forEach((word: string, idx: number) => {
        setTimeout(() => {
          setDisplayWords((prev) => [...prev, word])
        }, 50 * idx)
      })
    }
  }

  return (
    <div className='py-5 px-10 max-w-screen overflow-x-clip min-h-screen flex relative'>
      <Header />
      <div className='w-full flex flex-col items-start gap-5 mt-16 mb-[90px]'>
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
              <div className='w-full'>
                {message.role === 'user' ? (
                  String(message.content)
                ) : idx !== generatedIdx ? (
                  <RenderContent content={String(message.content)} />
                ) : (
                  <RenderContent content={String(displayWords.join(' '))} />
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={sendMessage}
          className='w-[95%] py-3 rounded-lg shadow-2xl shadow-black/5 dark:shadow-white/5 flex items-center gap-3 fixed bottom-5 -translate-x-1/2 left-1/2 px-5 bg-white dark:bg-[#0A0A0A] border'
        >
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Say something...'
            className='h-[40px] rounded-[5px] !bg-transparent'
          />

          <Button className='w-[120px] cursor-pointer h-[40px] rounded-[5px] flex items-center gap-1.5'>
            Send
            <SendHorizonal />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Home
