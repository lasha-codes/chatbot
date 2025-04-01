'use client'

import React, { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { Button } from './ui/button'

const RenderContent = React.memo(({ content }: { content: string }) => {
  const [copiedContent, setCopiedContent] = useState<string | undefined>(
    undefined
  )

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedContent(code)

    console.log(code)
    setTimeout(() => {
      setCopiedContent(undefined)
    }, 2500)
  }
  const processedContent = useMemo(() => {
    return (
      <div className='prose prose-invert w-[90%]'>
        <ReactMarkdown
          components={{
            code({ node, className, children }) {
              const isBlockCode = className?.startsWith('language-')

              if (isBlockCode) {
                const match = /language-(\w+)/.exec(className || '')

                if (match) {
                  const code = String(children).replace(/\n$/, '')
                  return (
                    <div className='relative'>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        wrapLines
                        PreTag='pre'
                        showInlineLineNumbers
                      >
                        {code}
                      </SyntaxHighlighter>

                      <Button
                        onClick={() => copyToClipboard(code)}
                        variant='outline'
                        className='absolute top-2 right-2 text-white px-2 py-1 rounded z-[99] cursor-pointer'
                      >
                        {copiedContent !== code ? (
                          <>
                            <Copy />
                            Copy
                          </>
                        ) : (
                          <>
                            <Check />
                            Copied
                          </>
                        )}
                      </Button>
                    </div>
                  )
                }
              }

              return (
                <code className='bg-gray-800 text-white p-1 rounded'>
                  {children}
                </code>
              )
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }, [content, copiedContent])

  return processedContent
})

export default RenderContent
