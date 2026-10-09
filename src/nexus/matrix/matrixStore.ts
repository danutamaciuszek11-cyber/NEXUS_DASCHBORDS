import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../core/firebase';
import { runGuarded } from '../../lib/firestore-proxy';
import type { JournalReading, TrajectoryReading } from './interpret';

export type JournalEntry = {
  id: string;
  body: string;
  createdAt: string;
  reading?: JournalReading;
  legacy: boolean;
};

export type Trajectory = {
  id: string;
  name: string;
  vision: string;
  horizon: string;
  createdAt: string;
  reading?: TrajectoryReading;
};

type Vault = {
  journal: JournalEntry[];
  trajectories: Trajectory[];
};

const emptyVault = (): Vault => ({ journal: [], trajectories: [] });

const storageKey = (uid: string) => `nexus-matrix:${uid}`;

function readLocal(uid: string): Vault {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return emptyVault();
    const parsed = JSON.parse(raw) as Vault;
    return {
      journal: Array.isArray(parsed.journal) ? parsed.journal : [],
      trajectories: Array.isArray(parsed.trajectories) ? parsed.trajectories : [],
    };
  } catch {
    return emptyVault();
  }
}

function writeLocal(uid: string, vault: Vault) {
  localStorage.setItem(storageKey(uid), JSON.stringify(vault));
}

export async function loadVault(uid: string): Promise<Vault> {
  const local = readLocal(uid);
  const remote = await runGuarded(db, async () => {
    const journalSnap = await getDocs(collection(db, 'matrix', uid, 'journal'));
    const trajectorySnap = await getDocs(collection(db, 'matrix', uid, 'trajectories'));
    return {
      journal: journalSnap.docs.map((item) => item.data() as JournalEntry),
      trajectories: trajectorySnap.docs.map((item) => item.data() as Trajectory),
    };
  });
  if (!remote.ok) return local;
  const journal = mergeById(local.journal, remote.value.journal);
  const trajectories = mergeById(local.trajectories, remote.value.trajectories);
  const vault = { journal, trajectories };
  writeLocal(uid, vault);
  return vault;
}

function mergeById<T extends { id: string; createdAt: string }>(local: T[], remote: T[]) {
  const map = new Map<string, T>();
  for (const item of remote) map.set(item.id, item);
  for (const item of local) map.set(item.id, item);
  return [...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveJournal(uid: string, entry: JournalEntry) {
  const vault = readLocal(uid);
  vault.journal = [entry, ...vault.journal.filter((item) => item.id !== entry.id)];
  writeLocal(uid, vault);
  await runGuarded(db, () => setDoc(doc(db, 'matrix', uid, 'journal', entry.id), entry));
  return vault;
}

export async function saveTrajectory(uid: string, entry: Trajectory) {
  const vault = readLocal(uid);
  vault.trajectories = [entry, ...vault.trajectories.filter((item) => item.id !== entry.id)];
  writeLocal(uid, vault);
  await runGuarded(db, () => setDoc(doc(db, 'matrix', uid, 'trajectories', entry.id), entry));
  return vault;
}
