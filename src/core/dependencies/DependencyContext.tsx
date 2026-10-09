import React, { createContext, useContext, useEffect, useState } from 'react';
import { registry } from './DependencyRegistry';

// Import bazowych zależności, które ładujemy natychmiast
import * as d3 from 'd3';
import * as lucideReact from 'lucide-react';
import { eventBus } from '../event-bus';
import { nexusCore } from '../nexus-core';

interface DependencyContextState {
  isInitialized: boolean;
  registeredKeys: string[];
}

const DependencyContext = createContext<DependencyContextState>({
  isInitialized: false,
  registeredKeys: [],
});

interface NexusDependencyProviderProps {
  children: React.ReactNode;
}

export const NexusDependencyProvider: React.FC<NexusDependencyProviderProps> = ({ children }) => {
  const [state, setState] = useState<DependencyContextState>({
    isInitialized: false,
    registeredKeys: [],
  });

  useEffect(() => {
    // Rejestracja natywnych bibliotek i funkcji systemowych
    registry.register('d3', d3);
    registry.register('lucide-react', lucideReact);
    registry.register('eventBus', eventBus);
    registry.register('nexusCore', nexusCore);
    registry.register('React', React);
    
    // Theme values (zgodnie z "zapewni wszystkie wartości")
    registry.register('themeTokens', {
      colors: {
        primary: '#A855F7',
        secondary: '#00E5FF',
        accent: '#00D9A6',
        danger: '#FF3B5C',
        background: '#05070D',
        panel: '#090C16'
      },
      borders: 'border border-cyan-500/30',
      shadows: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]'
    });

    setState({
      isInitialized: true,
      registeredKeys: registry.getRegisteredKeys(),
    });

    eventBus.emit('log', {
      tag: 'DEPENDENCY LAYER',
      message: `Zainicjowano główny system wstrzykiwania zależności. Dostępne paczki: ${registry.getRegisteredKeys().length}`,
      level: 'success'
    });
  }, []);

  if (!state.isInitialized) {
    // Ekran ładowania warstwy systemowej
    return (
      <div className="w-full h-screen bg-[#05070D] flex flex-col items-center justify-center font-mono-tech text-white">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#A855F7] animate-spin mb-4" />
        <span className="text-xs text-[#94A3B8] tracking-widest uppercase">Initializing Dependency Layer...</span>
      </div>
    );
  }

  return (
    <DependencyContext.Provider value={state}>
      {children}
    </DependencyContext.Provider>
  );
};
