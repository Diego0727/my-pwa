// src/lib/db.ts
import { openDB, type IDBPDatabase } from 'idb';

export interface Entry {
  id?: number;
  title: string;
  notes?: string;
  createdAt: number;
  status: 'pending' | 'sent';
}

export interface PushSub {
  id: 'current';
  subscription: PushSubscriptionJSON | null;
}

const DB_NAME = 'pwa-demo';
const DB_VERSION = 1;
let _db: IDBPDatabase | null = null;

export async function getDB() {
  if (_db) return _db;
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('entries')) {
        const store = db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
        store.createIndex('by_status', 'status');
        store.createIndex('by_date', 'createdAt');
      }
      if (!db.objectStoreNames.contains('push-sub')) {
        db.createObjectStore('push-sub', { keyPath: 'id' });
      }
    }
  });
  return _db;
}

/** Guarda y devuelve el id generado (para refrescar la UI al instante) */
export async function addEntry(e: Omit<Entry, 'id'>): Promise<number> {
  const db = await getDB();
  const id = await db.add('entries', e);
  return id as number;
}

export async function listEntries(): Promise<Entry[]> {
  const db = await getDB();
  return db.getAllFromIndex('entries', 'by_date');
}

export async function listPending(): Promise<Entry[]> {
  const db = await getDB();
  return db.getAllFromIndex('entries', 'by_status', 'pending');
}

export async function markAsSent(ids: number[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('entries', 'readwrite');
  const store = tx.objectStore('entries');
  for (const id of ids) {
    const e = await store.get(id);
    if (e) {
      e.status = 'sent';
      await store.put(e);
    }
  }
  await tx.done;
}

export async function savePushSub(sub: PushSubscription | null) {
  const db = await getDB();
  await db.put('push-sub', { id: 'current', subscription: sub ? sub.toJSON() : null } as PushSub);
}

export async function getPushSub() {
  const db = await getDB();
  return (await db.get('push-sub', 'current')) as PushSub | undefined;
}
