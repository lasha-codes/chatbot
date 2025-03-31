import axios from 'axios'
import { CoreMessage } from 'ai'

const gemini15Chat = async ({
  messages,
  newMessage,
}: {
  messages: CoreMessage[]
  newMessage: CoreMessage
}) => {
  const { data } = await axios.post(`/api/bot/gemini/1.5`, {
    messages: [...messages, newMessage],
  })

  return data
}

const deepseekR1Chat = async ({
  messages,
  newMessage,
}: {
  messages: CoreMessage[]
  newMessage: CoreMessage
}) => {
  const { data } = await axios.post(`/api/bot/deepseek/r1`, {
    messages: [...messages, newMessage],
  })

  return data
}

export const models = [
  {
    id: 'gemini-1.5',
    name: 'Gemini 1.5 Flash',
    icon: '/icons/google.svg',
    chat: gemini15Chat,
  },
  {
    id: 'depseek-1r',
    name: 'Deepseek R1',
    icon: '/icons/deepseek.svg',
    chat: deepseekR1Chat,
  },
] as const
