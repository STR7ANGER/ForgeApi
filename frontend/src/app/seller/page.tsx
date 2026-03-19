import { Button } from '@/components/ui/button';

const listings = [
  {
    name: 'Weatherly API',
    status: 'Published',
    subscribers: 182,
    calls: '1.2M',
  },
  {
    name: 'ShipFast Logistics',
    status: 'Draft',
    subscribers: 0,
    calls: '0',
  },
  {
    name: 'VoiceCraft',
    status: 'Published',
    subscribers: 64,
    calls: '320k',
  },
];

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Seller</p>
            <h1 className="mt-4 text-3xl font-semibold">Seller Dashboard</h1>
            <p className="mt-2 text-sm text-slate-300">
              Manage your APIs, pricing, and performance.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-slate-800 text-slate-100 hover:bg-slate-700">
              View Analytics
            </Button>
            <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              New API Listing
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Your Listings</h2>
            <div className="mt-6 space-y-4">
              {listings.map((listing) => (
                <div
                  key={listing.name}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold">{listing.name}</p>
                    <p className="text-sm text-slate-400">Status: {listing.status}</p>
                  </div>
                  <div className="flex gap-6 text-sm text-slate-300">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Subscribers</p>
                      <p className="text-base text-slate-100">{listing.subscribers}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Monthly Calls</p>
                      <p className="text-base text-slate-100">{listing.calls}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="bg-slate-800 text-slate-100 hover:bg-slate-700">
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Next Actions</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-300">
              <li className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                Complete docs for ShipFast Logistics to publish.
              </li>
              <li className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                Set pricing tiers for Weatherly API.
              </li>
              <li className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                Review usage spikes in VoiceCraft analytics.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
