import React, { useState } from 'react';
import { XnlParser } from '../xnl/xnl-parser';

interface XnlEditorModalProps {
  xnlCode: string;
  onApply: (newXnl: string) => void;
  onClose: () => void;
}

export const XnlEditorModal: React.FC<XnlEditorModalProps> = ({ xnlCode, onApply = (_: any) => {}, onClose = () => {} }) => {
  const [code, setCode] = useState(xnlCode);
  const [parseStatus, setParseStatus] = useState<string | null>(null);

  const handleValidateAndApply = () => {
    try {
      const ast = XnlParser.parse(code);
      setParseStatus(`VALID XNL: ${ast.modules.length} MODULE DECLARATIONS`);
      setTimeout(() => {
        onApply(code);
        onClose();
      }, 300);
    } catch (e: any) {
      setParseStatus(`PARSE ERROR: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070D]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#090C16] border border-[#A855F7]/60 rounded-xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] font-mono-tech flex flex-col h-[75vh]">
        <div className="flex items-center justify-between pb-3 border-b border-[#121827] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7]" />
            <h3 className="text-white text-sm font-bold tracking-wider uppercase">
              XNL DECLARATIVE UI ARCHITECTURE
            </h3>
          </div>
          <button onClick={onClose} className="text-[#64748B] hover:text-white cursor-pointer">✕</button>
        </div>

        <p className="text-[11px] text-[#94A3B8] mb-3">
          Edit the declarative XNL layout below. The Vanilla JS XNL engine parses the XML tree and dynamically registers and orders modules.
        </p>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 w-full bg-[#05070D] border border-[#1A2234] rounded-lg p-3 text-xs text-[#00E5FF] font-mono-tech focus:outline-none focus:border-[#A855F7] resize-none selection:bg-[#A855F7]/30"
          spellCheck={false}
        />

        {parseStatus && (
          <div className="mt-2 text-[11px] text-[#00D9A6]">{parseStatus}</div>
        )}

        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#121827]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#64748B] hover:text-white rounded cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleValidateAndApply}
            className="px-4 py-2 text-xs bg-[#A855F7] text-white font-bold rounded shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:bg-[#A855F7]/90 cursor-pointer"
          >
            APPLY XNL
          </button>
        </div>
      </div>
    </div>
  );
};
