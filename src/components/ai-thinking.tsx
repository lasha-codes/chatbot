import { cn } from '@/lib/utils'

interface AIThinkingLoaderProps {
  className?: string
  text?: string
}

const AIThinkingLoader = ({
  className,
  text = 'AI is thinking',
}: AIThinkingLoaderProps) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className='flex items-center space-x-1.5' aria-hidden='true'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'h-2 w-2 rounded-full bg-primary/80',
              'animate-pulse',
              i === 0 && 'animation-delay-0',
              i === 1 && 'animation-delay-150',
              i === 2 && 'animation-delay-300'
            )}
            style={{
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>
      {text && <p className='text-sm text-muted-foreground'>{text}</p>}
    </div>
  )
}

export default AIThinkingLoader
