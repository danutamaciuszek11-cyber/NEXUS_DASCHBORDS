import React from 'react';

const ReactMarkdown: React.FC<{
  children?: React.ReactNode;
  className?: string;
  components?: Record<string, any>;
  remarkPlugins?: any[];
  rehypePlugins?: any[];
}> = ({ children, className }) => {
  return (
    <div className={`prose prose-invert max-w-none font-sans text-sm leading-relaxed whitespace-pre-wrap ${className || ''}`}>
      {children}
    </div>
  );
};

export default ReactMarkdown;
