export default function LogPanel({ logs }: { logs: string[] }) {
  return (
    <div className="log-panel-inner">
      <h2>Boiler Room Logs</h2>
      <div className="log-lines">
        {logs.slice(-200).map((line, i) => (
          <pre key={i}>{line}</pre>
        ))}
      </div>
    </div>
  );
}