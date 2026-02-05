export default function SteamLeak({ message }: { message: string }) {
  return (
    <div className="steam-leak">
      <div className="steam-puff" />
      <p className="steam-message">{message}</p>
    </div>
  );
}