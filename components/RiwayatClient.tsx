"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Transaksi = { id: number; judul: string; nominal: number; tipe: string; tanggal: Date };
type FilterMode = "ALL" | "WEEK" | "MONTH" | "YEAR";

const filters: { key: FilterMode; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "WEEK", label: "7 Hari" },
  { key: "MONTH", label: "1 Bulan" },
  { key: "YEAR", label: "1 Tahun" },
];

export default function RiwayatClient({ dataTransaksi }: { dataTransaksi: Transaksi[] }) {
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");

  const filteredData = useMemo(() => {
    if (filterMode === "ALL") return dataTransaksi;
    const now = new Date();
    const ms = { WEEK: 7, MONTH: 30, YEAR: 365 }[filterMode] * 24 * 60 * 60 * 1000;
    return dataTransaksi.filter((t) => now.getTime() - new Date(t.tanggal).getTime() <= ms);
  }, [dataTransaksi, filterMode]);

  const totalIn = filteredData.filter((t) => t.tipe === "PEMASUKAN").reduce((a, t) => a + t.nominal, 0);
  const totalOut = filteredData.filter((t) => t.tipe === "PENGELUARAN").reduce((a, t) => a + t.nominal, 0);

  const chartData = useMemo(() => {
    const map: Record<string, { pemasukan: number; pengeluaran: number }> = {};
    filteredData.forEach((item) => {
      const d = new Date(item.tanggal);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      if (!map[key]) map[key] = { pemasukan: 0, pengeluaran: 0 };
      if (item.tipe === "PEMASUKAN") map[key].pemasukan += item.nominal;
      else map[key].pengeluaran += item.nominal;
    });
    return Object.entries(map).map(([name, val]) => ({ name, masuk: val.pemasukan, keluar: val.pengeluaran })).reverse();
  }, [filteredData]);

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">Riwayat</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Analisis cashflow dan histori transaksimu.</p>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-[var(--border)]" style={{ background: "var(--bg-secondary)" }}>
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilterMode(f.key)} className={`px-4 py-2.5 text-xs font-semibold transition-all ${filterMode === f.key ? "bg-[var(--accent)] text-black" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Total Masuk</p>
          <p className="text-xl font-black font-mono text-[var(--accent)]">+Rp {fmt(totalIn)}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Total Keluar</p>
          <p className="text-xl font-black font-mono text-[var(--danger)]">-Rp {fmt(totalOut)}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Selisih</p>
          <p className={`text-xl font-black font-mono ${totalIn - totalOut >= 0 ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>Rp {fmt(totalIn - totalOut)}</p>
        </div>
      </div>

      {/* LINE CHART */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 rounded-full gradient-accent" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Grafik Cashflow</h3>
          <div className="ml-auto flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[var(--accent)]" /> Masuk</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[var(--danger)]" /> Keluar</span>
          </div>
        </div>
        <div className="h-[280px] md:h-[350px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[var(--text-secondary)] text-sm">Belum ada data.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => v >= 1e6 ? `${v / 1e6}jt` : v >= 1e3 ? `${v / 1e3}k` : `${v}`} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="glass rounded-xl p-3 border border-[var(--border)] text-xs space-y-1 min-w-[140px]">
                      <p className="font-bold text-[var(--text-primary)]">{label}</p>
                      {payload.map((p) => (
                        <div key={p.dataKey as string} className="flex justify-between gap-4">
                          <span className="text-[var(--text-secondary)]">{p.dataKey === "masuk" ? "Masuk" : "Keluar"}</span>
                          <span className={`font-bold font-mono ${p.dataKey === "masuk" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>Rp {fmt(Number(p.value) || 0)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }} />
                <Line type="monotone" dataKey="masuk" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--accent)" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="keluar" stroke="var(--danger)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--danger)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full gradient-accent" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Daftar Transaksi</h3>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]" style={{ background: "var(--bg-secondary)", padding: "2px 10px", borderRadius: "99px" }}>{filteredData.length} item</span>
        </div>
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="py-10 text-center text-[var(--text-secondary)] text-sm">Tidak ada transaksi.</div>
          ) : (
            filteredData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-card-hover)] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${item.tipe === "PEMASUKAN" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`} style={{ background: item.tipe === "PEMASUKAN" ? "var(--accent-glow)" : "var(--danger-glow)" }}>
                    {item.tipe === "PEMASUKAN" ? "↗" : "↘"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{item.judul}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{new Date(item.tanggal).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <p className={`font-bold font-mono text-sm tabular-nums ${item.tipe === "PEMASUKAN" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>
                  {item.tipe === "PEMASUKAN" ? "+" : "-"}Rp {fmt(item.nominal)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
