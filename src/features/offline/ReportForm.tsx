
import { useState } from 'react';
import { addEntry } from '../../lib/db';

export default function ReportForm() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const entry = {
      title,
      notes,
      createdAt: Date.now(),
      status: navigator.onLine ? 'sent' : 'pending',
    } as const;


    const id = await addEntry(entry);

    
    window.dispatchEvent(new CustomEvent('entries:changed', { detail: { id } }));

    
    setTitle('');
    setNotes('');

    if (!navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
      const reg = await navigator.serviceWorker.ready;
      await (reg as any).sync.register('sync-entries'); // cast por tipos TS del navegador
      setMsg('Guardado offline. Se sincronizará cuando haya red.');
    } else {
      setMsg(navigator.onLine ? 'Enviado (simulado).' : 'Guardado offline.');
    }

   
    if ('Notification' in window && Notification.permission === 'granted') {
      const reg = await navigator.serviceWorker.ready;
      reg.active?.postMessage({
        type: 'TEST_PUSH',
        payload: {
          title: 'Formulario guardado',
          body: navigator.onLine ? 'Se envió (simulado).' : 'Se guardó en cola.',
        },
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          className="border rounded p-2 w-full"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          type="text"
          placeholder="Ej. Actividad de PWA"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Notas</label>
        <textarea
          className="border rounded p-2 w-full"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Detalles adicionales..."
        />
      </div>
      <button className="px-4 py-2 rounded" type="submit">Guardar</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
