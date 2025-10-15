// src/components/PushTester.tsx
export default function PushTester() {
  async function onClick() {
    // 1) Soporte básico
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      alert('Este navegador no soporta Service Worker o Notification API.');
      return;
    }

    // 2) Permiso de notificaciones
    if (Notification.permission !== 'granted') {
      const res = await Notification.requestPermission();
      if (res !== 'granted') {
        alert('Permiso de notificaciones denegado.');
        return;
      }
    }

    // 3) Registro del SW listo
    const reg = await navigator.serviceWorker.ready;

    // 4) Intento principal: postMessage → SW (handler TEST_PUSH en sw.js)
    try {
      reg.active?.postMessage({
        type: 'TEST_PUSH',
        payload: {
          title: 'Prueba de notificación',
          body: 'Enviada desde la app (postMessage → SW)',
        },
      });
    } catch (err) {
      // 5) Fallback: dispara la notificación directo desde el registro
      // (evita quedarte sin notificación si algo pasa con postMessage)
      try {
        await reg.showNotification('Prueba de notificación', {
          body: 'Fallback directo desde Registration',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'fallback-directo',
          requireInteraction: false,
          data: { url: '/' },
        });
      } catch (err2) {
        console.error('No se pudo mostrar la notificación:', err2);
        alert('No se pudo mostrar la notificación.');
      }
    }
  }

  return (
    <button className="mt-4 px-3 py-2 rounded border" onClick={onClick} title="Enviar notificación de prueba">
      Probar notificación
    </button>
  );
}
