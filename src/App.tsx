
import './App.css'; 
import './index.css'; 

import ReportForm from './features/offline/ReportForm';
import ReportList from './features/offline/ReportList';
import PushTester from './components/PushTester';

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="container">
          <h1 className="hero__title">PWA – Semana 4</h1>
          <p className="hero__lead">
            Formulario offline (IndexedDB) · Background Sync simulado · Caché · Notificaciones.
          </p>
        </div>
      </header>

      <main className="container stack-lg">
        <section className="card">
          <h2 className="section__title">Nuevo registro</h2>
          <div className="form-grid">
            <ReportForm />
          </div>
        </section>

        <section className="card">
          <h2 className="section__title">Registros</h2>
          <ReportList />
        </section>

        <section className="card">
          <h2 className="section__title">Notificaciones</h2>
          <PushTester />
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <small>App de tareas</small>
        </div>
      </footer>
    </div>
  );
}
