import React from 'react';

export interface BatchQueueItem {
  id: string;
  name: string;
  file: File;
  status: 'pending' | 'installing' | 'success' | 'error' | 'conflict';
  error?: string;
}

interface BatchInstallModalProps {
  queue: BatchQueueItem[];
  isComplete: boolean;
  onClose: () => void;
}

export const BatchInstallModal: React.FC<BatchInstallModalProps> = ({
  queue,
  isComplete,
  onClose,
}) => {
  const successCount = queue.filter((i) => i.status === 'success').length;
  const errorCount = queue.filter((i) => i.status === 'error' || i.status === 'conflict').length;
  const totalCount = queue.length;
  const completedCount = successCount + errorCount;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#05070D]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-[#090C16] border border-[#00D9A6]/40 rounded-xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(0,217,166,0.15)] font-mono-tech">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#121827]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D9A6] shadow-[0_0_8px_#00D9A6] animate-pulse" />
            <h3 className="text-white text-xs font-bold tracking-[0.2em] uppercase">
              NEXUS BATCH INSTALLER QUEUE ({successCount}/{totalCount})
            </h3>
          </div>
          {isComplete && (
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-white text-xs cursor-pointer px-1.5 py-0.5"
            >
              ✕
            </button>
          )}
        </div>

        {/* Global Progress Bar */}
        <div className="mb-5 bg-[#05070D] border border-[#121827] rounded-full h-2 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full transition-all duration-300 bg-[#00D9A6] shadow-[0_0_10px_#00D9A6]"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Queue Items List */}
        <div className="space-y-2.5 my-4 max-h-[360px] overflow-y-auto pr-1">
          {queue.map((item, idx) => {
            let bg = 'bg-[#0C101C]';
            let border = 'border-[#121827]';
            let textColor = 'text-[#64748B]';
            let badgeText = 'OCZEKIWANIE';

            if (item.status === 'installing') {
              bg = 'bg-[#00E5FF]/15';
              border = 'border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.2)]';
              textColor = 'text-[#00E5FF]';
              badgeText = 'INSTALOWANIE...';
            } else if (item.status === 'success') {
              bg = 'bg-[#00D9A6]/10';
              border = 'border-[#00D9A6]/40';
              textColor = 'text-[#00D9A6]';
              badgeText = 'ZAINSTALOWANY ✓';
            } else if (item.status === 'error' || item.status === 'conflict') {
              bg = 'bg-[#FF3B5C]/10';
              border = 'border-[#FF3B5C]/40';
              textColor = 'text-[#FF3B5C]';
              badgeText = 'BŁĄD / KONFLIKT';
            }

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${bg} ${border}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-[10px] text-[#475569] font-mono-tech w-5">
                    #{idx + 1}
                  </span>
                  <div className="overflow-hidden">
                    <div className="text-white text-xs font-bold truncate max-w-[260px]">
                      {item.name}
                    </div>
                    {item.error && (
                      <div className="text-[10px] text-[#FF3B5C] truncate mt-0.5">
                        {item.error}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-[#05070D] ${textColor}`}>
                  {badgeText}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-[#121827] flex items-center justify-between">
          <div className="text-[11px] text-[#94A3B8]">
            {isComplete
              ? `Batch queue completed. Success: ${successCount}, Errors: ${errorCount}`
              : 'Processing packages sequentially through Nexus validation pipeline...'}
          </div>
          {isComplete && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#00D9A6] text-[#05070D] font-bold text-xs uppercase tracking-wider hover:bg-[#00D9A6]/90 cursor-pointer transition-all shadow-[0_0_15px_rgba(0,217,166,0.4)]"
            >
              ZAMKNIJ OKNO
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
