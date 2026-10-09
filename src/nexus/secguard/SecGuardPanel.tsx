import React, { useEffect, useState } from 'react';

type Snapshot = {
  version: string;
  protocol: string;
  source: string;
  status: string;
  fingerprint: string;
  driftLimit: number;
  modules: { id: string; name: string; role: string; status: string; drift: number }[];
  ledger: { id: string; at: string; moduleId: string; event: string; hash: string }[];
};

type Review = {
  severity: string;
  summary: string;
  actions: string[];
  engine: string;
};

export const SecGuardPanel: React.FC = () => {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [moduleId, setModuleId] = useState('AUTH-MATRIX-01');
  const [alertType, setAlertType] = useState('BEHAVIORAL_DRIFT');
  const [review, setReview] = useState<Review | null>(null);
  const [drift, setDrift] = useState(10);

  const load = () => {
    fetch('/api/sec-guard/status')
      .then((response) => response.json())
      .then((data) => setSnap(data))
      .catch(() => setSnap(null));
  };

  useEffect(() => {
    load();
  }, []);

  const post = async (url: string, body: unknown) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (data.snapshot) setSnap(data.snapshot);
    if (data.review) setReview(data.review);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6 border border-cyan-400/40 bg-[#070A12] p-6">
        <p className="text-[11px] tracking-[0.28em] text-cyan-300 font-mono-tech">ETERNIVERSE-SEC-GUARD 2.4.1-LTS</p>
        <h2 className="mt-2 text-2xl text-white font-bold">Straż połączona z matrycą</h2>
        <p className="mt-2 text-sm text-[#94A3B8]">
          AuthMatrix, CipherStream, SentinelNode i księga zdarzeń. Manifest: src/nxl/sec-guard.nxl.
        </p>
        {snap && (
          <p className="mt-3 text-xs font-mono-tech text-cyan-200">
            {snap.status} · próg {snap.driftLimit}% · etykieta {snap.fingerprint}
          </p>
        )}
      </header>

      {!snap && <p className="text-sm text-amber-200">Status straży nie wrócił z serwera.</p>}

      {snap && (
        <div className="grid md:grid-cols-2 gap-3">
          {snap.modules.map((item) => (
            <article key={item.id} className="border border-white/10 p-4">
              <h3 className="text-cyan-200">{item.name}</h3>
              <p className="text-xs text-[#94A3B8]">{item.id} · {item.role}</p>
              <p className="mt-2 text-sm">{item.status} · odchylenie {item.drift}%</p>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <form
          className="border border-white/10 p-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            post('/api/sec-guard/drift', { moduleId, drift });
          }}
        >
          <h3 className="text-sm text-white">Próg Sentinela</h3>
          <select value={moduleId} onChange={(event) => setModuleId(event.target.value)} className="w-full bg-black border border-white/10 p-2 text-sm">
            <option value="AUTH-MATRIX-01">AuthMatrix</option>
            <option value="CIPHER-STREAM-02">CipherStream</option>
            <option value="SENTINEL-NODE-03">SentinelNode</option>
            <option value="IMMUTABLE-LEDGER-05">ImmutableLedger</option>
          </select>
          <input type="number" min={0} max={100} value={drift} onChange={(event) => setDrift(Number(event.target.value))} className="w-full bg-black border border-white/10 p-2 text-sm" />
          <button type="submit" className="px-3 py-2 bg-cyan-300 text-black text-sm font-bold">Ustaw odchylenie</button>
          <button type="button" className="ml-2 px-3 py-2 border border-cyan-300 text-cyan-200 text-sm" onClick={() => post('/api/sec-guard/release', { moduleId })}>
            Zdejmij kwarantannę
          </button>
          <button type="button" className="ml-2 px-3 py-2 border border-white/20 text-sm" onClick={() => post('/api/sec-guard/rotate', {})}>
            Obróć etykietę
          </button>
        </form>

        <form
          className="border border-white/10 p-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            post('/api/sec-guard/review', { moduleId, alertType });
          }}
        >
          <h3 className="text-sm text-white">Odczyt Kaisa</h3>
          <select value={alertType} onChange={(event) => setAlertType(event.target.value)} className="w-full bg-black border border-white/10 p-2 text-sm">
            <option value="BEHAVIORAL_DRIFT">Odchylenie zachowania</option>
            <option value="INTEGRITY_MISMATCH">Niezgodność zapisu</option>
            <option value="AUTH_FAILURE">Odmowa tożsamości</option>
          </select>
          <button type="submit" className="px-3 py-2 bg-[#ffd700] text-black text-sm font-bold">Oceń zdarzenie</button>
          {review && (
            <div className="text-sm space-y-1">
              <p>{review.severity} · {review.engine}</p>
              <p>{review.summary}</p>
              <ul>{review.actions.map((action) => <li key={action}>{action}</li>)}</ul>
            </div>
          )}
        </form>
      </div>

      {snap && (
        <ul className="mt-6 space-y-2">
          {snap.ledger.map((entry) => (
            <li key={entry.id} className="text-xs font-mono-tech text-[#94A3B8] border border-white/10 px-3 py-2">
              {entry.at} · {entry.moduleId} · {entry.event} · {entry.hash}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
