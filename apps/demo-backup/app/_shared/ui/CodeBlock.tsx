'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language = 'typescript',
  className = '',
  showLineNumbers = false
}: CodeBlockProps) {
  return (
    <div className={`rounded-lg overflow-hidden border border-slate-800 ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#020617', // slate-950
          fontSize: '0.875rem', // text-sm
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
