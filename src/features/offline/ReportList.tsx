// src/features/offline/ReportList.tsx
import { useEffect, useState } from 'react';
import { listEntries, type Entry } from '../../lib/db';

export default function ReportList() {
  const [items, setItems] = useState<Entry[]>([]);

  async function load() {
    const all = await listEntries();
    setItems([...all].sort((a, b) => b.createdAt - a.createdAt));
  }

  useEffect(() => {
    // Carga inicial
    void load();

    // 🔔 refresca cuando el formulario agrega un item nuevo
    const reload = () => { void load(); };
    window.addEventListener('entries:changed', reload as EventListener);

    // también refresca al volver el foco a la pestaña
    window.addEventListener('focus', reload);

    return () => {
      window.removeEventListener('entries:changed', reload as EventListener);
      window.removeEventListener('focus', reload);
    };
  }, []);

  return (
    <div className="mt-4 space-y-2">
      {items.map((it) => (
        <div key={it.id} className="border rounded p-2">
          <div className="text-sm font-semibold">{it.title}</div>
          {it.notes && <div className="text-sm opacity-80">{it.notes}</div>}
          <div className="text-xs opacity-60">
            {new Date(it.createdAt).toLocaleString()} — {it.status}
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm opacity-75">Sin registros.</p>}
    </div>
  );
}

