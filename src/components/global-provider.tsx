'use client'
import { models } from '@/config/models'
import { createContext, Dispatch, SetStateAction, useState } from 'react'

interface Context {
  selectedModel: (typeof models)[number]
  setSelectedModel: Dispatch<SetStateAction<(typeof models)[number]>>
}

export const GlobalContext = createContext<Context>({
  selectedModel: models[0],
  setSelectedModel: () => models[0],
})

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState<(typeof models)[number]>(
    models[0]
  )
  return (
    <GlobalContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
