'use client'

import { useContext, useState } from 'react'
import { Bot, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { models } from '@/config/models'
import Image from 'next/image'
import { GlobalContext } from './global-provider'

export function Header() {
  const { selectedModel, setSelectedModel } = useContext(GlobalContext)

  return (
    <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/60 border-b border-border/40 shadow-2xl shadow-black/5'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center'>
            <Bot className='h-5 w-5 text-primary' />
          </div>
          <h1 className='text-xl font-semibold'>AI Assistant</h1>
        </div>

        <div className='flex items-center gap-4'>
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

interface ModelSelectorProps {
  selectedModel: (typeof models)[number]
  setSelectedModel: React.Dispatch<
    React.SetStateAction<(typeof models)[number]>
  >
}

function ModelSelector({
  selectedModel,
  setSelectedModel,
}: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='flex items-center justify-between gap-2 rounded-[4px] w-[230px] dark:bg-[#0A0A0A]'
        >
          <div className='flex items-center gap-2.5'>
            <Image
              src={selectedModel.icon}
              alt={`${selectedModel.name} icon`}
              width={20}
              height={20}
            />
            <span>Model: {selectedModel.name}</span>
          </div>
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-[230px] rounded-[4px] flex flex-col items-start gap-1'
      >
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className={cn(
              'cursor-pointer rounded-[4px] flex items-center gap-3 w-full',
              selectedModel.id === model.id && 'bg-accent'
            )}
            onClick={() => setSelectedModel(model)}
          >
            <Image
              src={model.icon}
              alt={`${model.name} icon`}
              width={20}
              height={20}
            />
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
