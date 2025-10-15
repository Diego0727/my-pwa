
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import type { Entry } from './lib/db';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });

  navigator.serviceWorker.addEventListener('message', async (ev: MessageEvent) => {
    if ((ev.data && ev.data.type) === 'SYNC_ENTRIES_REQUEST') {
      const { listPending, markAsSent } = await import('./lib/db');
      const pending = await listPending();
      const ids = pending
        .map((p: Entry) => p.id as number)
        .filter((id): id is number => typeof id === 'number');

      if (ids.length) {
        await markAsSent(ids);
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({
          type: 'TEST_PUSH',
          payload: { title: 'Sincronización completada', body: `${ids.length} elementos enviados (simulado).` },
        });
      }
    }
  });
}

