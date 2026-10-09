import { disableNetwork, Firestore } from 'firebase/firestore';

let networkMuted = false;

export function isFirestoreNetworkMuted() {
  return networkMuted;
}

export async function runGuarded<T>(
  db: Firestore,
  task: () => Promise<T>,
): Promise<{ ok: true; value: T } | { ok: false; muted: boolean }> {
  if (networkMuted) return { ok: false, muted: true };
  try {
    return { ok: true, value: await task() };
  } catch (err: unknown) {
    const text = err instanceof Error ? `${(err as { code?: string }).code || ''} ${err.message}` : String(err);
    const quota = text.includes('resource-exhausted') || text.toLowerCase().includes('quota');
    if (quota) {
      networkMuted = true;
      try {
        await disableNetwork(db);
      } catch {
        networkMuted = true;
      }
    }
    return { ok: false, muted: quota };
  }
}
