'use client'

import { Input } from '@/components/ui/input'
import { CoreMessage } from 'ai'
import { useContext, useEffect, useRef, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { SendHorizonal } from 'lucide-react'
import 'prismjs/themes/prism.css'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import RenderContent from '@/components/SyntaxHighliter'
import { GlobalContext } from '@/components/global-provider'
import { models } from '@/config/models'
import Image from 'next/image'
import Loader from '@/components/loader'

const Home = () => {
  const { selectedModel } = useContext(GlobalContext)
  const [prompt, setPrompt] = useState<string>('')
  const [messages, setMessages] = useState<CoreMessage[]>([])
  const [displayWords, setDisplayWords] = useState<string[]>([])
  const [generatedIdx, setGeneratedIdx] = useState<number | undefined>(
    undefined
  )
  const [error, setError] = useState<string | undefined>(undefined)
  const [generating, setGenerating] = useState<boolean>(false)
  const bottomViewRef = useRef<HTMLDivElement | null>(null)
  const cancelRef = useRef(false)

  useEffect(() => {
    if (bottomViewRef.current) {
      bottomViewRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    try {
      e.preventDefault()

      if (generating) {
        cancelRef.current = true
        setGenerating(false)
        setGeneratedIdx(undefined)
        return
      }

      if (!prompt.trim()) {
        return setError('Prompt cant be empty.')
      } else if (error) {
        setError(undefined)
      }

      cancelRef.current = false

      setGenerating(true)

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
            if (cancelRef.current) return

            setDisplayWords((prev) => [...prev, word])
            if (idx === words.length - 1) {
              setGenerating(false)
            }
          }, 50 * idx)
        })
      } else {
        setGenerating(false)
      }
    } catch (err) {
      setGenerating(false)
    }
  }

  return (
    <>
      <Header />
      {messages.length > 0 ? (
        <div className='py-5 px-10 max-w-screen overflow-x-clip min-h-screen flex relative'>
          <div className='w-full flex flex-col items-start gap-5 mt-16 mb-[90px]'>
            <div className='w-full flex flex-col items-start'>
              <div className='w-full flex flex-col items-start gap-8'>
                {messages.map((message, idx) => {
                  const modelData = models.find(
                    // @ts-expect-error
                    (model) => model.id === message?.model
                  )

                  console.log(modelData?.icon)

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
                              src={modelData?.icon || '/icons/google.svg'}
                              alt='Ai logo'
                              objectFit='contain'
                              className='min-w-[37px] max-w-[37px]'
                            />
                          </div>
                        )}
                      </div>
                      <div
                        className={`w-full ${
                          message.role === 'user' &&
                          'bg-[#282C34] !w-fit px-6 py-3 rounded-[5px] text-white'
                        }`}
                      >
                        {message.role === 'user' ? (
                          String(message.content)
                        ) : idx !== generatedIdx ? (
                          <RenderContent content={String(message.content)} />
                        ) : (
                          <RenderContent
                            content={String(displayWords.join(' '))}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div ref={bottomViewRef} />
            </div>
          </div>
        </div>
      ) : (
        <div className='container mx-auto px-4 pt-24 pb-12'>
          <div className='max-w-3xl mx-auto space-y-8'>
            <section className='space-y-4'>
              <h2 className='text-3xl font-bold'>Your AI Assistant</h2>
              <p className='text-muted-foreground'>
                Ask me anything and I'll provide helpful responses.
              </p>

              <div className='mt-8 p-6 border rounded-lg bg-card'>
                <p className='text-center text-muted-foreground'>
                  Chat interface will appear here
                </p>
              </div>
            </section>
          </div>
        </div>
      )}
      <form
        onSubmit={sendMessage}
        className='w-[95%] py-3 rounded-lg shadow-2xl shadow-black/5 dark:shadow-white/5 flex items-center gap-3 fixed bottom-5 -translate-x-1/2 left-1/2 px-5 bg-white dark:bg-[#0A0A0A] border'
      >
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Say something...'
          className={`h-[40px] rounded-[5px] !bg-transparent ${
            error && '!border-red-500'
          }`}
        />
        <Button
          className={`w-[120px] cursor-pointer h-[40px] rounded-[5px] flex items-center gap-1.5 ${
            generating &&
            '!text-white !bg-red-600 hover:!bg-red-700 dark:!bg-red-700 dark:hover:!bg-red-800'
          }`}
        >
          {!generating ? (
            <>
              Send
              <SendHorizonal />
            </>
          ) : (
            <>
              Skip
              <Loader />
            </>
          )}
        </Button>
      </form>
    </>
  )
}

export default Home
