declare module 'canvas-confetti' {
  export default function confetti(options?: any): Promise<null> | null;
}

declare module 'react-markdown' {
  import React from 'react';
  const ReactMarkdown: React.FC<{ children?: React.ReactNode; className?: string }>;
  export default ReactMarkdown;
}
