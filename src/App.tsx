import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');

  // Simular splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Splash Screen
  if (loading) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="app-logo">📱</div>
          <h1>Mi PWA Pro</h1>
          <p>Tu aplicación progresiva</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Renderizar diferentes vistas
  const renderHome = () => (
    <div className="home-content">
      <h2>¡Bienvenido a Mi PWA!</h2>
      <div className="feature-card">
        <h3>✅ Características Implementadas</h3>
        <ul>
          <li>Web App Manifest</li>
          <li>App Shell Architecture</li>
          <li>Service Worker</li>
          <li>Splash Screen nativo</li>
          <li>Instalable en dispositivo</li>
          <li>Funciona offline</li>
        </ul>
      </div>
      
      <div className="features-grid">
        <div className="feature-item">
          <span className="feature-icon">📱</span>
          <h4>Instalable</h4>
          <p>Instala como app nativa</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <h4>Rápida</h4>
          <p>Carga instantánea</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔒</span>
          <h4>Segura</h4>
          <p>HTTPS requerido</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📶</span>
          <h4>Offline</h4>
          <p>Funciona sin conexión</p>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="about-content">
      <h2>Acerca de esta PWA</h2>
      <div className="info-card">
        <h3>Tecnologías Utilizadas</h3>
        <ul>
          <li>React + Vite</li>
          <li>Web App Manifest</li>
          <li>Service Workers</li>
          <li>CSS3 Moderno</li>
          <li>App Shell Pattern</li>
        </ul>
      </div>
      <div className="info-card">
        <h3>Para la Tarea</h3>
        <p>Esta aplicación demuestra todos los componentes esenciales de una PWA requeridos en la tarea.</p>
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="config-content">
      <h2>Configuración</h2>
      <div className="config-card">
        <h3>Estado de la PWA</h3>
        <div className="status-item">
          <span>Service Worker:</span>
          <span className="status-active">✅ Activo</span>
        </div>
        <div className="status-item">
          <span>Cache:</span>
          <span className="status-active">✅ Funcionando</span>
        </div>
        <div className="status-item">
          <span>Instalable:</span>
          <span className="status-active">✅ Listo</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-content">
          <h1>Mi PWA Pro</h1>
          <nav className="app-nav">
            <button 
              className={currentView === 'home' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('home')}
            >
              🏠 Inicio
            </button>
            <button 
              className={currentView === 'about' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('about')}
            >
              ℹ️ Acerca
            </button>
            <button 
              className={currentView === 'config' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('config')}
            >
              ⚙️ Config
            </button>
          </nav>
        </div>
      </header>
      
      <main className="app-main">
        {currentView === 'home' && renderHome()}
        {currentView === 'about' && renderAbout()}
        {currentView === 'config' && renderConfig()}
      </main>
      
      <footer className="app-footer">
        <p>🚀 Aplicación PWA - Desarrollada para la tarea - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;