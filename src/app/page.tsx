'use client'

import { Input } from '@/components/ui/input'
import { CoreMessage } from 'ai'
import axios from 'axios'
import { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { PiOpenAiLogoDuotone } from 'react-icons/pi'
import { highlight } from 'sugar-high'
import 'prismjs/themes/prism.css'
import { Header } from '@/components/header'

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

  const renderContent = (content: string) => {
    const inlineCodeRegex = /`([^`]+)`/g

    const blockCodeRegex = /```([\s\S]+?)```/g

    let processedContent = content.replace(blockCodeRegex, (match, code) => {
      const highlightedCode = highlight(code.trim())
      return `<pre class="bg-gray-800 text-white p-3 rounded-lg w-full overflow-auto my-3">${highlightedCode}</pre>`
    })

    processedContent = processedContent.replace(
      inlineCodeRegex,
      (match, code) => {
        const highlightedCode = highlight(code)
        return `<code class="bg-gray-800 text-white p-1 rounded">${highlightedCode}</code>`
      }
    )

    return (
      <div
        className='w-[90%]'
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    )
  }

  return (
    <div className='py-5 px-10 max-w-screen overflow-x-clip min-h-screen flex'>
      <Header />
      <div className='w-full flex flex-col items-start gap-5 mt-16'>
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
                {message.role === 'user'
                  ? String(message.content)
                  : idx !== generatedIdx
                  ? renderContent(String(message.content))
                  : renderContent(String(displayWords.join(' ')))}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className='w-full mt-auto'>
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
