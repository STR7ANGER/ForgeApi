import Link from 'next/link';
import { marketplaceApis } from './data';
import { Button } from '@/components/ui/button';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Marketplace</p>
            <h1 className="mt-4 text-4xl font-semibold">Discover APIs built for production</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Browse curated APIs with live reliability metrics, transparent pricing, and instant
              access.
            </p>
          </div>
          <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">Publish API</Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {marketplaceApis.map((api) => (
            <div
              key={api.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40"
            >
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{api.category}</span>
                <span>{api.price}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-slate-100">{api.name}</h2>
              <p className="mt-2 text-sm text-slate-300">{api.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {api.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-6 text-sm text-slate-400">
                <span>Latency {api.latency}</span>
                <span>Uptime {api.uptime}</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Link className="text-emerald-300 hover:text-emerald-200" href={`/marketplace/${api.slug}`}>
                  View details
                </Link>
                <Button variant="secondary" className="bg-slate-800 text-slate-100 hover:bg-slate-700">
                  Subscribe
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
