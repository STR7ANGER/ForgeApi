import Link from 'next/link';
import { marketplaceApis } from '../data';
import { Button } from '@/components/ui/button';

type PageProps = {
  params: { id: string };
};

export default function MarketplaceDetailPage({ params }: PageProps) {
  const api = marketplaceApis.find((item) => item.slug === params.id) ?? marketplaceApis[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/marketplace" className="text-sm text-emerald-300 hover:text-emerald-200">
          ← Back to marketplace
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">{api.category}</p>
              <h1 className="mt-3 text-4xl font-semibold">{api.name}</h1>
              <p className="mt-3 max-w-2xl text-slate-300">{api.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {api.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
              <p className="text-lg font-semibold text-slate-100">{api.price}</p>
              <p className="mt-2">Latency: {api.latency}</p>
              <p>Uptime: {api.uptime}</p>
              <Button className="mt-5 w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                Subscribe
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase text-slate-500">Auth</p>
              <p className="mt-2 text-sm text-slate-200">API Key + OAuth2 support</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase text-slate-500">Rate Limits</p>
              <p className="mt-2 text-sm text-slate-200">1,000 rpm baseline</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase text-slate-500">SLA</p>
              <p className="mt-2 text-sm text-slate-200">Priority incident response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
