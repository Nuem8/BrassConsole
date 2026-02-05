export default function PressureGauge({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="gauge">
      <div className="gauge-face">
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${(clamped / 100) * 180 - 90}deg)` }}
        />
      </div>
      <span className="gauge-label">
        {label} ({clamped.toFixed(0)}%)
      </span>
    </div>
  );
}