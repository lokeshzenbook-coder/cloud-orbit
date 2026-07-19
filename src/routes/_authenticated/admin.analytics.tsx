import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
  head: () => ({ meta: [{ title: "Admin — Resume Analytics" }, { name: "robots", content: "noindex" }] }),
});

type Row = { id: string; source: string; user_agent: string | null; referrer: string | null; created_at: string };

function AnalyticsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Filters
  const [source, setSource] = useState<"all" | "hero" | "contact">("all");
  const [days, setDays] = useState<7 | 30 | 90 | 365>(30);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", u.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
    })();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      let q = supabase
        .from("resume_downloads")
        .select("id, source, user_agent, referrer, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false });
      if (source !== "all") q = q.eq("source", source);
      const { data, error } = await q;
      if (error) setError(error.message);
      else setRows((data ?? []) as Row[]);
    })();
  }, [isAdmin, source, days]);

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    (rows ?? []).forEach((r) => map.set(r.source, (map.get(r.source) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [rows]);

  const byDay = useMemo(() => {
    const map = new Map<string, { day: string; hero: number; contact: number; total: number }>();
    // Pre-seed days so gaps show as 0
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      map.set(d, { day: d, hero: 0, contact: 0, total: 0 });
    }
    (rows ?? []).forEach((r) => {
      const d = r.created_at.slice(0, 10);
      const cur = map.get(d) ?? { day: d, hero: 0, contact: 0, total: 0 };
      if (r.source === "hero") cur.hero++;
      else if (r.source === "contact") cur.contact++;
      cur.total++;
      map.set(d, cur);
    });
    return Array.from(map.values()).sort((a, b) => a.day.localeCompare(b.day));
  }, [rows, days]);

  const total = rows?.length ?? 0;
  const heroTotal = (rows ?? []).filter((r) => r.source === "hero").length;
  const contactTotal = (rows ?? []).filter((r) => r.source === "contact").length;

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isAdmin === null) {
    return <Shell><p className="text-sm text-muted-foreground">Checking permissions…</p></Shell>;
  }
  if (!isAdmin) {
    return (
      <Shell>
        <div className="glass rounded-xl p-8 border border-red-500/30">
          <div className="font-mono text-xs text-red-400 mb-2">$ auth --check-role admin</div>
          <h2 className="text-xl font-bold">Access denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have the admin role.
          </p>
          <button onClick={signOut} className="mt-4 rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">
            Sign out
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="font-mono text-xs text-cyber-cyan mb-1">$ kubectl get downloads --all</div>
          <h1 className="text-3xl font-bold text-gradient">Résumé download analytics</h1>
        </div>
        <button onClick={signOut} className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">
          Sign out
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <FilterGroup label="Source">
          {(["all", "hero", "contact"] as const).map((s) => (
            <FilterPill key={s} active={source === s} onClick={() => setSource(s)}>{s}</FilterPill>
          ))}
        </FilterGroup>
        <FilterGroup label="Range">
          {([7, 30, 90, 365] as const).map((d) => (
            <FilterPill key={d} active={days === d} onClick={() => setDays(d)}>{d}d</FilterPill>
          ))}
        </FilterGroup>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Kpi label="Total downloads" value={total} accent="text-cyber-cyan" />
        <Kpi label="From hero" value={heroTotal} accent="text-cyber-purple" />
        <Kpi label="From contact" value={contactTotal} accent="text-cyber-blue" />
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {/* Chart */}
      <div className="glass rounded-xl border border-white/10 p-4 sm:p-6 mb-8">
        <h2 className="text-sm font-medium mb-4 text-muted-foreground">Downloads by day</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#0b1024", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {(source === "all" || source === "hero") && <Bar dataKey="hero" stackId="a" fill="#a855f7" />}
              {(source === "all" || source === "contact") && <Bar dataKey="contact" stackId="a" fill="#22d3ee" />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* By source */}
      <div className="glass rounded-xl border border-white/10 p-4 sm:p-6 mb-8">
        <h2 className="text-sm font-medium mb-4 text-muted-foreground">By source</h2>
        <div className="space-y-2">
          {bySource.length === 0 && <p className="text-sm text-muted-foreground">No data in range.</p>}
          {bySource.map((s) => {
            const pct = total ? (s.count / total) * 100 : 0;
            return (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono">{s.name}</span>
                  <span className="text-muted-foreground">{s.count} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-cyber" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent */}
      <div className="glass rounded-xl border border-white/10 p-4 sm:p-6">
        <h2 className="text-sm font-medium mb-4 text-muted-foreground">Recent downloads ({rows?.length ?? 0})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-white/10">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">Referrer</th>
                <th className="py-2">User agent</th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).slice(0, 50).map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="py-2 pr-4 font-mono whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="py-2 pr-4"><span className="rounded bg-white/5 px-1.5 py-0.5">{r.source}</span></td>
                  <td className="py-2 pr-4 max-w-[220px] truncate">{r.referrer ?? "—"}</td>
                  <td className="py-2 max-w-[320px] truncate text-muted-foreground">{r.user_agent ?? "—"}</td>
                </tr>
              ))}
              {rows && rows.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No downloads recorded in this range.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-white px-4 sm:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><Link to="/" className="text-xs text-muted-foreground hover:text-white">← Back to portfolio</Link></div>
        {children}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs border transition ${
        active ? "bg-gradient-cyber text-white border-transparent" : "border-white/10 text-muted-foreground hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Kpi({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="glass rounded-xl border border-white/10 p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-3xl font-bold font-mono mt-1 ${accent}`}>{value}</div>
    </div>
  );
}
