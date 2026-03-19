import { Button } from '@/components/ui/button';

const subscriptions = [
  {
    name: 'Weatherly API',
    status: 'Active',
    plan: 'Starter',
    calls: '48k',
  },
  {
    name: 'FinPulse',
    status: 'Active',
    plan: 'Growth',
    calls: '212k',
  },
];

const apiKeys = [
  {
    name: 'Mobile App',
    lastFour: '9F2A',
    createdAt: 'Mar 12, 2026',
  },
  {
    name: 'Batch Jobs',
    lastFour: '31BB',
    createdAt: 'Feb 21, 2026',
  },
];

export default function ConsumerDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Consumer</p>
            <h1 className="mt-4 text-3xl font-semibold">Consumer Dashboard</h1>
            <p className="mt-2 text-sm text-slate-300">
              Track usage, manage subscriptions, and rotate keys.
            </p>
          </div>
          <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
            Generate API Key
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Active Subscriptions</h2>
            <div className="mt-6 space-y-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub.name}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold">{sub.name}</p>
                    <p className="text-sm text-slate-400">
                      {sub.status} · {sub.plan}
                    </p>
                  </div>
                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase text-slate-500">Monthly Calls</p>
                    <p className="text-base text-slate-100">{sub.calls}</p>
                  </div>
                  <Button variant="secondary" className="bg-slate-800 text-slate-100 hover:bg-slate-700">
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">API Keys</h2>
            <div className="mt-6 space-y-4">
              {apiKeys.map((key) => (
                <div key={key.name} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{key.name}</p>
                    <span className="text-xs text-slate-400">•••• {key.lastFour}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Created {key.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Usage Overview</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase text-slate-500">Requests</p>
              <p className="mt-2 text-2xl font-semibold">420k</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase text-slate-500">Avg Latency</p>
              <p className="mt-2 text-2xl font-semibold">180ms</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase text-slate-500">Errors</p>
              <p className="mt-2 text-2xl font-semibold">0.9%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
