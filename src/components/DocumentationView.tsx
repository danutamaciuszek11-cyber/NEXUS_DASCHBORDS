import React, { useEffect, useState } from 'react';
import { BookOpen, Download, Copy, Check, FileText, Code2, Server, Shield } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [docContent, setDocContent] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/documentation')
      .then(async (res) => {
        const ct = res.headers.get('content-type');
        if (res.ok && ct && ct.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.content) {
          setDocContent(data.content);
        }
      })
      .catch(() => {
        // Safe fallback if documentation is unavailable
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(docContent);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([docContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TECHNICAL_DOCUMENTATION.md';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base font-sans">Dokumentacja Techniczna NXL v1.0 & API Spec</h2>
            <p className="text-xs text-slate-400">Pełna specyfikacja architektoniczna, schematy API, przepływy danych i konfiguracja Docker</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Skopiowano' : 'Kopiuj Markdown'}</span>
          </button>

          <button
            onClick={() => handleDownload()}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>Pobierz .md</span>
          </button>
        </div>
      </div>

      {/* Markdown Content Box */}
      <div className="nx-glass-card rounded-2xl p-6 border border-slate-800 font-sans text-slate-300 text-xs leading-relaxed space-y-4 max-h-[700px] overflow-y-auto">
        {isLoading ? (
          <p className="text-center text-slate-500 p-8 font-mono">Wczytywanie specyfikacji technicznej...</p>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-slate-200 text-xs bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 overflow-x-auto">
            {docContent}
          </pre>
        )}
      </div>
    </div>
  );
};
