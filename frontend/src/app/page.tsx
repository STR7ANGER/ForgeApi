import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">ForgeAPI</p>
            <h1 className="mt-5 text-5xl font-semibold text-slate-100">
              Build. Publish. Monetize APIs in one platform.
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              Launch API products faster with marketplace visibility, managed access, and analytics
              that scale with your customers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-300" asChild>
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
              <Button variant="secondary" className="bg-slate-800 text-slate-100 hover:bg-slate-700" asChild>
                <Link href="/seller">Go to Seller Dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200 shadow-xl">
            <p className="text-xs uppercase text-slate-500">Quick Start</p>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                Create a listing and publish your API in minutes.
              </li>
              <li className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                Generate API keys and manage subscriptions.
              </li>
              <li className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                Track usage and revenue from one dashboard.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
