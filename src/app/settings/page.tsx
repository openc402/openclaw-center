export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">⚙️ Settings</h1>
        <p className="text-zinc-500 text-sm">Configuration and preferences</p>
      </div>
      <div className="glass p-8 text-center text-zinc-500">
        <p className="text-4xl mb-4">⚙️</p>
        <p>Notification prefs, API connections, theme settings</p>
        <p className="text-xs mt-2 text-zinc-600">Coming soon</p>
      </div>
    </div>
  );
}
