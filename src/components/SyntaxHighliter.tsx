import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const RenderContent = React.memo(({ content }: { content: string }) => {
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
                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      wrapLines
                      PreTag='pre'
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
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
  }, [content])

  return processedContent
})

export default RenderContent
