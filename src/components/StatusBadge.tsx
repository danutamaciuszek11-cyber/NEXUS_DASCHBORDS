import React from 'react';
import { ModuleStatus } from '../core/types';

interface StatusBadgeProps {
  status: ModuleStatus;
  accent?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, accent, className = '' }) => {
  let color = accent || '#00E5FF';
  let dotColor = '#00E5FF';
  let bgColor = 'rgba(0, 229, 255, 0.08)';
  let borderColor = 'rgba(0, 229, 255, 0.3)';

  switch (status) {
    case 'OPERATIONAL':
    case 'RUNNING':
      color = accent || '#00E5FF';
      dotColor = '#00E5FF';
      bgColor = 'rgba(0, 229, 255, 0.08)';
      borderColor = 'rgba(0, 229, 255, 0.35)';
      break;
    case 'READY':
      color = '#00D9A6'; // Green
      dotColor = '#00D9A6';
      bgColor = 'rgba(0, 217, 166, 0.08)';
      borderColor = 'rgba(0, 217, 166, 0.35)';
      break;
    case 'INSTALLING':
      color = '#A855F7'; // Violet
      dotColor = '#A855F7';
      bgColor = 'rgba(168, 85, 247, 0.08)';
      borderColor = 'rgba(168, 85, 247, 0.35)';
      break;
    case 'UPDATE AVAILABLE':
      color = '#38BDF8';
      dotColor = '#38BDF8';
      bgColor = 'rgba(56, 189, 248, 0.08)';
      borderColor = 'rgba(56, 189, 248, 0.35)';
      break;
    case 'OFFLINE':
      color = '#64748B';
      dotColor = '#64748B';
      bgColor = 'rgba(100, 116, 139, 0.08)';
      borderColor = 'rgba(100, 116, 139, 0.25)';
      break;
    case 'ERROR':
      color = '#FF3B5C'; // Red
      dotColor = '#FF3B5C';
      bgColor = 'rgba(255, 59, 92, 0.08)';
      borderColor = 'rgba(255, 59, 92, 0.4)';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech tracking-wider uppercase border ${className}`}
      style={{
        color,
        borderColor,
        backgroundColor: bgColor,
      }}
    >
      <span
        className={`status-dot ${status === 'OPERATIONAL' || status === 'RUNNING' ? 'active' : ''}`}
        style={{ backgroundColor: dotColor }}
      />
      {status}
    </span>
  );
};
