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

const openaiGptChat = async ({
  messages,
  newMessage,
}: {
  messages: CoreMessage[]
  newMessage: CoreMessage
}) => {
  const { data } = await axios.post(`/api/bot/openai`, {
    messages: [...messages, newMessage],
  })

  return data
}

const openaiGpt3TurboChat = async ({
  messages,
  newMessage,
}: {
  messages: CoreMessage[]
  newMessage: CoreMessage
}) => {
  const { data } = await axios.post(`/api/bot/openai`, {
    messages: [...messages, newMessage],
    model: 'gpt-3.5-turbo',
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

  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    icon: '/icons/openai.svg',
    chat: openaiGptChat,
  },

  {
    id: 'gpt-3o-turbo',
    name: 'GPT-3o Turbo',
    icon: '/icons/openai.svg',
    chat: openaiGpt3TurboChat,
  },
] as const
