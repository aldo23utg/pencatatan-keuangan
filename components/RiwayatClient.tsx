"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Transaksi = { id: number; judul: string; nominal: number; tipe: string; tanggal: Date };
type FilterMode = "ALL" | "WEEK" | "MONTH" | "YEAR";

const filters: { key: FilterMode; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "WEEK", label: "7 Hari" },
  { key: "MONTH", label: "1 Bulan" },
  { key: "YEAR", label: "1 Tahun" },
];

const PAGE_SIZE = 10;

export default function RiwayatClient({ dataTransaksi }: { dataTransaksi: Transaksi[] }) {
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");
  const [page, setPage] = useState(0);

  const filteredData = useMemo(() => {
    if (filterMode === "ALL") return dataTransaksi;
    const now = new Date();
    const ms = { WEEK: 7, MONTH: 30, YEAR: 365 }[filterMode] * 24 * 60 * 60 * 1000;
    return dataTransaksi.filter((t) => now.getTime() - new Date(t.tanggal).getTime() <= ms);
  }, [dataTransaksi, filterMode]);

  const setFilter = (f: FilterMode) => { setFilterMode(f); setPage(0); };

  const totalIn = filteredData.filter((t) => t.tipe === "PEMASUKAN").reduce((a, t) => a + t.nominal, 0);
  const totalOut = filteredData.filter((t) => t.tipe === "PENGELUARAN").reduce((a, t) => a + t.nominal, 0);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pagedData = filteredData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const chartData = useMemo(() => {
    const map: Record<string, { masuk: number; keluar: number; sortKey: number }> = {};
    filteredData.forEach((item) => {
      const d = new Date(item.tanggal);
      let key: string;
      let sortKey: number;
      if (filterMode === "YEAR") {
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        sortKey = d.getFullYear() * 100 + d.getMonth();
      } else {
        key = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
        sortKey = d.getTime();
      }
      if (!map[key]) map[key] = { masuk: 0, keluar: 0, sortKey };
      if (item.tipe === "PEMASUKAN") map[key].masuk += item.nominal;
      else map[key].keluar += item.nominal;
    });
    return Object.entries(map)
      .map(([name, val]) => ({ name, masuk: val.masuk, keluar: val.keluar, sortKey: val.sortKey }))
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [filteredData, filterMode]);

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">Riwayat</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Analisis cashflow dan histori transaksi.</p>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-[var(--border)]" style={{ background: "var(--bg-secondary)" }}>
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 text-xs font-semibold transition-all ${filterMode === f.key ? "bg-[var(--accent)] text-black" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-3d p-4">
          <p className="text-[11px] font-semibold text-[var(--text-secondary)] mb-0.5">Masuk</p>
          <p className="text-lg md:text-xl font-black font-mono text-[var(--accent)]">+{fmt(totalIn)}</p>
        </div>
        <div className="card-3d p-4">
          <p className="text-[11px] font-semibold text-[var(--text-secondary)] mb-0.5">Keluar</p>
          <p className="text-lg md:text-xl font-black font-mono text-[var(--danger)]">-{fmt(totalOut)}</p>
        </div>
        <div className="card-3d p-4">
          <p className="text-[11px] font-semibold text-[var(--text-secondary)] mb-0.5">Selisih</p>
          <p className={`text-lg md:text-xl font-black font-mono ${totalIn - totalOut >= 0 ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>{fmt(totalIn - totalOut)}</p>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="card-3d p-5 md:p-7">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full gradient-accent" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Diagram Batang</h3>
        </div>
        <div className="h-[260px] md:h-[340px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[var(--text-secondary)] text-sm">Belum ada data.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} interval={0} angle={chartData.length > 7 ? -35 : 0} textAnchor={chartData.length > 7 ? "end" : "middle"} height={chartData.length > 7 ? 60 : 30} />
                <YAxis tickFormatter={(v) => v >= 1e6 ? `${v / 1e6}jt` : v >= 1e3 ? `${v / 1e3}k` : `${v}`} tick={{ fontSize: 10, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="card-3d p-3 text-xs space-y-1 min-w-[130px]" style={{ background: "var(--bg-card)" }}>
                      <p className="font-bold text-[var(--text-primary)] text-[11px]">{label}</p>
                      {payload.map((p) => (
                        <div key={p.dataKey as string} className="flex justify-between gap-3">
                          <span className="text-[var(--text-secondary)]">{p.dataKey === "masuk" ? "Masuk" : "Keluar"}</span>
                          <span className={`font-bold font-mono ${p.dataKey === "masuk" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>Rp {fmt(Number(p.value) || 0)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }} />
                <Legend formatter={(v) => v === "masuk" ? "Pemasukan" : "Pengeluaran"} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Bar dataKey="masuk" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="keluar" fill="var(--danger)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* LIST WITH PAGINATION */}
      <div className="card-3d p-5 md:p-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full gradient-accent" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Daftar Transaksi</h3>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)] px-2.5 py-0.5 rounded-full" style={{ background: "var(--bg-secondary)" }}>{filteredData.length} item</span>
        </div>
        <div className="space-y-1">
          {pagedData.length === 0 ? (
            <div className="py-10 text-center text-[var(--text-secondary)] text-sm">Tidak ada transaksi.</div>
          ) : (
            pagedData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--bg-card-hover)] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${item.tipe === "PEMASUKAN" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`} style={{ background: item.tipe === "PEMASUKAN" ? "var(--accent-glow)" : "var(--danger-glow)" }}>
                    {item.tipe === "PEMASUKAN" ? "↗" : "↘"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">{item.judul}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">{new Date(item.tanggal).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <p className={`font-bold font-mono text-sm tabular-nums shrink-0 ${item.tipe === "PEMASUKAN" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>
                  {item.tipe === "PEMASUKAN" ? "+" : "-"}Rp {fmt(item.nominal)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-[var(--border)]">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 transition-all">
              ← Prev
            </button>
            <span className="text-xs font-mono text-[var(--text-secondary)] px-3">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 transition-all">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
