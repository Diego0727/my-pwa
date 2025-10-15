

if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log(' Permiso de notificación concedido');
    } else {
      console.warn(' Permiso de notificación denegado');
    }
  });
}



if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => console.log('SW registrado'));
}


const estado = document.getElementById('estado');
function actualizarEstado() {
  estado.textContent = navigator.onLine ? "🟢 En línea" : "🔴 Sin conexión";
}
window.addEventListener('online', actualizarEstado);
window.addEventListener('offline', actualizarEstado);
actualizarEstado();


let db;
const request = indexedDB.open('tareasDB', 1);
request.onupgradeneeded = e => {
  db = e.target.result;
  db.createObjectStore('tareas', { keyPath: 'id', autoIncrement: true });
};
request.onsuccess = e => {
  db = e.target.result;
  mostrarTareas();
};


document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const texto = document.getElementById('tarea').value.trim();
  if (!texto) return;

  const tx = db.transaction('tareas', 'readwrite');
  tx.objectStore('tareas').add({ texto, fecha: new Date().toLocaleString() });
  tx.oncomplete = () => {
    document.getElementById('tarea').value = '';
    mostrarTareas();

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ tipo: 'notificar', texto: 'Tarea guardada offline.' });
    }
  };
});


function mostrarTareas() {
  const lista = document.getElementById('listaTareas');
  const tx = db.transaction('tareas', 'readonly');
  const store = tx.objectStore('tareas');
  const req = store.getAll();

  req.onsuccess = () => {
    lista.innerHTML = '';
    req.result.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.texto} (${t.fecha})`;
      lista.appendChild(li);
    });
  };
}
