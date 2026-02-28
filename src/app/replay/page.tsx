import ActivityFeed from '@/components/ActivityFeed';
import { mockActivity } from '@/data/mock';

export default function ReplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">⏪ Replay</h1>
        <p className="text-zinc-500 text-sm">Review what happened while you were away</p>
      </div>
      <ActivityFeed events={mockActivity} />
    </div>
  );
}
