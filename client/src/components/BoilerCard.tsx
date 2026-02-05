import PressureGauge from './PressureGauge';
import SteamLeak from './SteamLeak';

export default function BoilerCard({
  service,
  onToggle
}: {
  service: {
    id: string;
    name: string;
    running: boolean;
    cpu: number;
    memory: number;
    lastError: string | null;
  };
  onToggle: () => void;
}) {
  const hasError = !!service.lastError;

  return (
    <article className={`boiler-card ${service.running ? 'on' : 'off'}`}>
      <div className="boiler-header">
        <h2>{service.name}</h2>
        <button onClick={onToggle}>
          {service.running ? 'Shut Valve' : 'Open Valve'}
        </button>
      </div>

      <div className="boiler-gauges">
        <PressureGauge label="CPU Pressure" value={service.cpu} />
        <PressureGauge label="Steam Volume" value={service.memory} />
      </div>

      {hasError && <SteamLeak message={service.lastError!} />}
    </article>
  );
}