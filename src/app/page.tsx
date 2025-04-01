'use client'

import { CoreMessage } from 'ai'
import { Header } from '@/components/header'
import ChatInterface from '@/components/chat-interface'
import { useState } from 'react'

const Home = () => {
  const [messages, setMessages] = useState<CoreMessage[]>([])

  return (
    <>
      <Header />
      <ChatInterface messages={messages} setMessages={setMessages} />
    </>
  )
}

export default Home
