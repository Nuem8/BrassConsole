import { useEffect, useState } from 'react';
import BoilerCard from './BoilerCard';
import LogPanel from './LogPanel';

interface ServiceStatus {
  id: string;
  name: string;
  running: boolean;
  cpu: number;
  memory: number;
  lastError: string | null;
}

function BrassLayout() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/services')
      .then(r => r.json())
      .then(setServices);

    const ws = new WebSocket('ws://localhost:4000');
    ws.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'pressureUpdate') setServices(msg.data);
      if (msg.type === 'log') setLogs(prev => [...prev, msg.data]);
    };
    return () => ws.close();
  }, []);

  const toggleService = (svc: ServiceStatus) => {
    const action = svc.running ? 'stop' : 'start';
    fetch(`http://localhost:4000/api/services/${svc.id}/${action}`, {
      method: 'POST'
    });
  };

  return (
    <div className="brass-root">
      <header className="brass-header">
        <h1>The Brass Console</h1>
        <p>A steampunk dashboard for your dev boilers.</p>
      </header>

      <main className="brass-main">
        <section className="boilers-grid">
          {services.map(svc => (
            <BoilerCard
              key={svc.id}
              service={svc}
              onToggle={() => toggleService(svc)}
            />
          ))}
        </section>
        <section className="logs-panel">
          <LogPanel logs={logs} />
        </section>
      </main>
    </div>
  );
}

export default BrassLayout;