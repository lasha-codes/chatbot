'use client'

import { useState } from 'react'
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

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'llama-3', name: 'Llama 3' },
]

export function Header() {
  const [selectedModel, setSelectedModel] = useState(models[0])

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
  selectedModel: { id: string; name: string }
  setSelectedModel: (model: { id: string; name: string }) => void
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
          className='flex items-center justify-between gap-2 rounded-[4px] w-[200px] dark:bg-[#0A0A0A]'
        >
          <span>Model: {selectedModel.name}</span>
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px] rounded-[4px]'>
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className={cn(
              'cursor-pointer rounded-[4px]',
              selectedModel.id === model.id && 'bg-accent'
            )}
            onClick={() => setSelectedModel(model)}
          >
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
