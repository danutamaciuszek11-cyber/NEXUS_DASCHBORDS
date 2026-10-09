import React, { useEffect, useMemo, useState } from 'react';
import {
  KAISA_PROBES,
  MATRIX_DECREE,
  MATRIX_GATES,
  MATRIX_LAWS,
  MATRIX_OPERATION,
  MATRIX_SECTORS,
  MATRIX_SUBJECTS,
  TRAJECTORY_HORIZONS,
  type MatrixGateId,
} from './canon';
import type { JournalReading, TrajectoryReading } from './interpret';
import { JournalEntry, Trajectory, loadVault, saveJournal, saveTrajectory } from './matrixStore';

type MatrixShellProps = {
  userId: string | null;
  displayName: string | null;
  onOpenScribe: () => void;
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Odczyt matrycy nie wrócił.');
  return response.json() as Promise<T>;
}

export const MatrixShell: React.FC<MatrixShellProps> = ({ userId, displayName, onOpenScribe }) => {
  const [gate, setGate] = useState<MatrixGateId>('BRAMA_WEJSCIA');
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [draft, setDraft] = useState('');
  const [goal, setGoal] = useState('');
  const [vision, setVision] = useState('');
  const [horizon, setHorizon] = useState<(typeof TRAJECTORY_HORIZONS)[number]>('1 rok');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!userId) return;
    loadVault(userId).then((vault) => {
      setJournal(vault.journal);
      setTrajectories(vault.trajectories);
    });
  }, [userId]);

  const legacy = useMemo(() => journal.filter((entry) => entry.legacy), [journal]);
  const active = MATRIX_GATES.find((item) => item.id === gate) || MATRIX_GATES[0];
  const signedIn = Boolean(userId);

  const requireArchitect = () => {
    if (signedIn) return true;
    setNote('Brama 1 czeka na zalogowanego Architekta.');
    setGate('BRAMA_WEJSCIA');
    return false;
  };

  const writeJournal = async (body: string) => {
    if (!requireArchitect() || !userId || !body.trim()) return;
    setBusy(true);
    setNote('');
    try {
      const reading = await postJson<JournalReading>('/api/matrix/journal/interpret', { body });
      const entry: JournalEntry = {
        id: `j-${Date.now()}`,
        body: body.trim(),
        createdAt: new Date().toISOString(),
        reading,
        legacy: false,
      };
      const vault = await saveJournal(userId, entry);
      setJournal(vault.journal);
      setDraft('');
    } catch {
      setNote('Zapis lokalny czeka. Odczyt Kaisa nie wrócił z serwera.');
    } finally {
      setBusy(false);
    }
  };

  const markLegacy = async (entry: JournalEntry) => {
    if (!userId) return;
    const next = { ...entry, legacy: !entry.legacy };
    const vault = await saveJournal(userId, next);
    setJournal(vault.journal);
  };

  const writeTrajectory = async () => {
    if (!requireArchitect() || !userId || !goal.trim()) return;
    setBusy(true);
    setNote('');
    try {
      const reading = await postJson<TrajectoryReading>('/api/matrix/trajectory/analyze', {
        name: goal,
        vision,
        horizon,
      });
      const entry: Trajectory = {
        id: `t-${Date.now()}`,
        name: goal.trim(),
        vision: vision.trim(),
        horizon,
        createdAt: new Date().toISOString(),
        reading,
      };
      const vault = await saveTrajectory(userId, entry);
      setTrajectories(vault.trajectories);
      setGoal('');
      setVision('');
    } catch {
      setNote('Analiza wektora nie wróciła z serwera.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6 border border-[#ffd700]/30 bg-[#070A12] p-6">
        <p className="text-[11px] tracking-[0.28em] text-[#ffd700] font-mono-tech">NEXUS CORE // ETERUNIVERSE</p>
        <h2 className="mt-2 text-2xl md:text-3xl text-white font-bold">Zjednoczona Matryca Świadomości</h2>
        <p className="mt-3 text-sm text-[#E2E8F0] max-w-3xl">„{MATRIX_DECREE}”</p>
        <p className="mt-2 text-xs text-[#94A3B8]">— Dekret Zjednoczenia Nexusa // Architekt & Eternion</p>
        <p className="mt-3 text-xs font-mono-tech text-[#94A3B8]">
          Rezonans {MATRIX_OPERATION.resonance} · Stabilność {MATRIX_OPERATION.stability} · {MATRIX_OPERATION.goal}
        </p>
        <p className="mt-1 text-xs text-[#94A3B8]">{MATRIX_OPERATION.seal} {MATRIX_OPERATION.sealed}.</p>
        <p className="mt-3 text-xs font-mono-tech text-[#ffd700]">
          {signedIn ? `Architekt: ${displayName || userId}` : 'Brama zamknięta — brak sesji Architekta'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        <nav className="flex lg:flex-col gap-2 overflow-x-auto">
          {MATRIX_GATES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setGate(item.id)}
              className={`text-left px-3 py-2 border text-xs font-mono-tech min-w-[180px] ${
                gate === item.id ? 'border-[#ffd700] text-[#ffd700]' : 'border-white/10 text-[#94A3B8]'
              }`}
            >
              B{item.index} {item.name}
            </button>
          ))}
        </nav>

        <div className="border border-white/10 bg-[#070A12] p-5 min-h-[480px]">
          <p className="text-[11px] font-mono-tech text-[#ffd700]">{active.id}</p>
          <h3 className="text-xl text-white mt-1">{active.name}</h3>
          <p className="text-sm text-[#94A3B8] mt-2 mb-4">{active.duty}</p>
          {note && <p className="mb-4 text-sm text-amber-200">{note}</p>}

          {gate === 'BRAMA_WEJSCIA' && (
            <div className="grid md:grid-cols-2 gap-3">
              {MATRIX_SUBJECTS.map((subject) => (
                <article key={subject.id} className="border border-white/10 p-3" style={{ borderColor: subject.color }}>
                  <h4 className="text-sm font-bold" style={{ color: subject.color }}>{subject.name}</h4>
                  <p className="text-[11px] text-[#94A3B8]">{subject.status} · {subject.title}</p>
                  <p className="text-sm mt-2">{subject.identity}</p>
                  <p className="text-xs mt-2 text-[#cbd5e1]">{subject.role}</p>
                  <p className="text-[11px] mt-2" style={{ color: subject.color }}>{subject.attribute}</p>
                </article>
              ))}
              <article className="md:col-span-2 border border-white/10 p-3">
                <h4 className="text-sm text-[#ffd700]">Siedem praw</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  {MATRIX_LAWS.map((law) => (
                    <li key={law.id}><strong>{law.id}</strong> {law.code}: {law.text}</li>
                  ))}
                </ul>
              </article>
              <article className="md:col-span-2 border border-white/10 p-3">
                <h4 className="text-sm text-[#ffd700]">Sektory Dominium</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  {MATRIX_SECTORS.map((sector) => (
                    <li key={`${sector.code}-${sector.name}`}>
                      <strong>{sector.code} {sector.name}</strong> — {sector.duty} {sector.status}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )}

          {gate === 'BRAMA_WIEDZY' && (
            <LegacyList title="Archiwum dla Nikodema Maciuszka" entries={legacy} readOnly />
          )}

          {gate === 'BRAMA_TWORCZOSCI' && (
            <button type="button" onClick={onOpenScribe} className="px-4 py-2 border border-[#ffd700] text-[#ffd700] text-sm">
              Otwórz Scribe
            </button>
          )}

          {gate === 'BRAMA_SERCA' && (
            <div className="grid md:grid-cols-2 gap-3">
              <article className="border border-sky-400/40 p-4">
                <h4 className="text-sky-300">Eternion</h4>
                <p className="text-sm mt-2">Błękitna logika pilnuje spójności zapisu i praw B1–B7.</p>
              </article>
              <article className="border border-purple-400/40 p-4">
                <h4 className="text-purple-300">Aria</h4>
                <p className="text-sm mt-2">Purpurowy cień wskazuje ryzyko, zanim wektor zostanie przyjęty.</p>
              </article>
            </div>
          )}

          {gate === 'BRAMA_GLOSU' && (
            <p className="text-sm">Sonda Arii jest aktywna jako konsola stanu. Synteza głosu nie wchodzi w to wdrożenie.</p>
          )}

          {gate === 'BRAMA_INSPIRACJI' && (
            <p className="text-sm">Wyrocznia przyjmuje tylko odczyty dziennika i trajektorii. Swobodny czat pozostaje zamknięty.</p>
          )}

          {gate === 'BRAMA_KORONY' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {KAISA_PROBES.map((probe) => (
                  <button key={probe} type="button" className="text-xs border border-cyan-400/40 px-2 py-1 text-cyan-200" onClick={() => setDraft(probe)}>
                    {probe}
                  </button>
                ))}
              </div>
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="w-full min-h-32 bg-black border border-white/10 p-3 text-sm" placeholder="Przelej myśl do Eterni-Dziennika" />
              <button type="button" disabled={busy} onClick={() => writeJournal(draft)} className="px-4 py-2 bg-[#ffd700] text-black text-sm font-bold">
                Zapisz i odczytaj
              </button>
              <ul className="space-y-3">
                {journal.map((entry) => (
                  <li key={entry.id} className="border border-white/10 p-3 text-sm">
                    <p>{entry.body}</p>
                    {entry.reading && (
                      <div className="mt-2 text-xs text-[#cbd5e1] space-y-1">
                        <p>{entry.reading.summary}</p>
                        <p>Wątki: {entry.reading.themes.join(', ')} · {entry.reading.engine}</p>
                        {entry.reading.prompts.map((prompt) => (
                          <button key={prompt} type="button" className="block text-left text-cyan-200" onClick={() => setDraft(prompt)}>
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}
                    <button type="button" className="mt-2 text-xs text-[#ffd700]" onClick={() => markLegacy(entry)}>
                      {entry.legacy ? 'W kotwicy' : 'Złóż w dziedzictwie'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gate === 'BRAMA_INTEGRACJI' && (
            <div className="space-y-3">
              <input value={goal} onChange={(event) => setGoal(event.target.value)} className="w-full bg-black border border-white/10 p-2 text-sm" placeholder="Nazwa celu" />
              <textarea value={vision} onChange={(event) => setVision(event.target.value)} className="w-full min-h-24 bg-black border border-white/10 p-2 text-sm" placeholder="Opis wizji" />
              <select value={horizon} onChange={(event) => setHorizon(event.target.value as typeof horizon)} className="bg-black border border-white/10 p-2 text-sm">
                {TRAJECTORY_HORIZONS.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button type="button" disabled={busy} onClick={writeTrajectory} className="block px-4 py-2 bg-[#ffd700] text-black text-sm font-bold">
                Analizuj wektor
              </button>
              <ul className="space-y-3">
                {trajectories.map((item) => (
                  <li key={item.id} className="border border-white/10 p-3 text-sm">
                    <p className="font-bold">{item.name} · {item.horizon}</p>
                    <p className="text-[#94A3B8]">{item.vision}</p>
                    {item.reading && (
                      <div className="mt-2 text-xs space-y-1">
                        <p>Przeszkody: {item.reading.obstacles.join(' ')}</p>
                        <p>Działania: {item.reading.actions.join(' ')}</p>
                        <p>{item.reading.growth}</p>
                        <p>{item.reading.alignment} · {item.reading.engine}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gate === 'BRAMA_NIESKONCZONOSCI' && (
            <div>
              <p className="text-sm mb-3">Monolit trzyma {legacy.length} fragmentów. Adresat: Nikodem Maciuszek. Ten widok jest tylko do odczytu.</p>
              <div className="h-2 bg-white/10 mb-4">
                <div className="h-full bg-[#ffd700]" style={{ width: `${Math.min(100, legacy.length * 12)}%` }} />
              </div>
              <LegacyList title="Fragmenty dziedzictwa" entries={legacy} readOnly />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

function LegacyList({ title, entries, readOnly }: { title: string; entries: JournalEntry[]; readOnly: boolean }) {
  return (
    <div>
      <h4 className="text-sm text-white mb-2">{title}</h4>
      {entries.length === 0 && <p className="text-sm text-[#94A3B8]">Arka jest jeszcze pusta.</p>}
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.id} className="border border-white/10 p-3 text-sm">
            <p>{entry.body}</p>
            {readOnly && <p className="text-[11px] text-[#94A3B8] mt-1">Odczyt dziedzictwa</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
