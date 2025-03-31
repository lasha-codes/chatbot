'use client'

import { Input } from '@/components/ui/input'
import { CoreMessage } from 'ai'
import { useContext, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { SendHorizonal } from 'lucide-react'
import 'prismjs/themes/prism.css'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import RenderContent from '@/components/SyntaxHighliter'
import { GlobalContext } from '@/components/global-provider'
import { models } from '@/config/models'
import Image from 'next/image'

const Home = () => {
  const { selectedModel } = useContext(GlobalContext)
  const [prompt, setPrompt] = useState<string>('')
  const [messages, setMessages] = useState<CoreMessage[]>([])
  const [displayWords, setDisplayWords] = useState<string[]>([])
  const [generatedIdx, setGeneratedIdx] = useState<number>()

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    const newMessage = {
      role: 'user',
      content: prompt,
    } as CoreMessage

    setPrompt('')

    setMessages((prev) => {
      const newMessages = [...prev, newMessage]
      return newMessages
    })

    const data = await selectedModel.chat({ messages, newMessage })

    setMessages((prev) => {
      setGeneratedIdx(prev.length)
      const aiMessage = {
        role: 'assistant',
        content: data?.response || "Couldn't generate response",
        model: selectedModel.id,
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
        <div className='w-full flex flex-col items-start gap-8'>
          {messages.map((message, idx) => {
            // @ts-expect-error
            const icon = models.find((model) => model.id === message?.model)
              ?.icon as string | undefined
            return (
              <div
                key={idx}
                className={`w-full flex items-start gap-5 ${
                  message.role === 'user' && ''
                }`}
              >
                <div>
                  {message.role === 'user' ? (
                    <div className='flex items-center gap-2'>
                      <FaUserCircle className='text-4xl' />
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <Image
                        width={37}
                        height={0}
                        src={icon?.trim() ? icon : '/icons/google.svg'}
                        alt='Ai logo'
                      />
                    </div>
                  )}
                </div>
                <div
                  className={`w-full ${
                    message.role === 'user' &&
                    'bg-[#282C34] !w-fit px-6 py-3 rounded-[5px]'
                  }`}
                >
                  {message.role === 'user' ? (
                    String(message.content)
                  ) : idx !== generatedIdx ? (
                    <RenderContent content={String(message.content)} />
                  ) : (
                    <RenderContent content={String(displayWords.join(' '))} />
                  )}
                </div>
              </div>
            )
          })}
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
