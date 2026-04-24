"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Transaksi = {
  id: number;
  judul: string;
  nominal: number;
  tipe: string;
  tanggal: Date;
};

type FilterMode = "ALL" | "WEEK" | "MONTH";

const filters: { key: FilterMode; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "MONTH", label: "Bulan Ini" },
  { key: "WEEK", label: "7 Hari" },
];

export default function RiwayatClient({
  dataTransaksi,
}: {
  dataTransaksi: Transaksi[];
}) {
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");

  const filteredData = useMemo(() => {
    if (filterMode === "ALL") return dataTransaksi;
    const now = new Date();
    return dataTransaksi.filter((t) => {
      const d = new Date(t.tanggal);
      if (filterMode === "WEEK") {
        return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
      }
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
  }, [dataTransaksi, filterMode]);

  const totalIn = filteredData
    .filter((t) => t.tipe === "PEMASUKAN")
    .reduce((a, t) => a + t.nominal, 0);

  const totalOut = filteredData
    .filter((t) => t.tipe === "PENGELUARAN")
    .reduce((a, t) => a + t.nominal, 0);

  const chartData = useMemo(() => {
    const map: Record<string, { pemasukan: number; pengeluaran: number }> = {};
    filteredData.forEach((item) => {
      const d = new Date(item.tanggal);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      if (!map[key]) map[key] = { pemasukan: 0, pengeluaran: 0 };
      if (item.tipe === "PEMASUKAN") map[key].pemasukan += item.nominal;
      else map[key].pengeluaran += item.nominal;
    });
    return Object.entries(map)
      .map(([name, val]) => ({ name, in: val.pemasukan, out: val.pengeluaran }))
      .reverse();
  }, [filteredData]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-8">
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
            Riwayat
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Analisis cashflow & histori transaksimu.
          </p>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-[var(--border)] bg-white/5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterMode(f.key)}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                filterMode === f.key
                  ? "bg-[var(--accent)] text-black"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[var(--accent)] opacity-[0.05] blur-2xl" />
          <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
            Total Masuk
          </p>
          <p className="text-xl font-black font-mono text-[var(--accent)]">
            +Rp {fmt(totalIn)}
          </p>
        </div>
        <div className="glass rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[var(--danger)] opacity-[0.05] blur-2xl" />
          <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
            Total Keluar
          </p>
          <p className="text-xl font-black font-mono text-[var(--danger)]">
            -Rp {fmt(totalOut)}
          </p>
        </div>
        <div className="glass rounded-2xl p-5 relative overflow-hidden">
          <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
            Selisih
          </p>
          <p
            className={`text-xl font-black font-mono ${
              totalIn - totalOut >= 0
                ? "text-[var(--accent)]"
                : "text-[var(--danger)]"
            }`}
          >
            Rp {fmt(totalIn - totalOut)}
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 rounded-full gradient-accent" />
          <h3 className="text-sm font-bold">Grafik Cashflow</h3>
        </div>

        <div className="h-[300px] md:h-[380px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
              Belum ada data untuk dirender
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4D6A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF4D6A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#555" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1000000
                      ? `${v / 1000000}jt`
                      : v >= 1000
                      ? `${v / 1000}k`
                      : `${v}`
                  }
                  tick={{ fontSize: 10, fill: "#555" }}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="glass rounded-xl p-3 border border-white/10 text-xs space-y-1 min-w-[140px]">
                        <p className="font-bold text-[var(--text-secondary)]">{label}</p>
                        {payload.map((p) => (
                          <div key={p.dataKey as string} className="flex justify-between gap-4">
                            <span className="text-[var(--text-muted)]">
                              {p.dataKey === "in" ? "Masuk" : "Keluar"}
                            </span>
                            <span
                              className={`font-bold font-mono ${
                                p.dataKey === "in"
                                  ? "text-[var(--accent)]"
                                  : "text-[var(--danger)]"
                              }`}
                            >
                              Rp {fmt(Number(p.value) || 0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="in"
                  stroke="#00D4AA"
                  strokeWidth={2}
                  fill="url(#gIn)"
                  name="Pemasukan"
                />
                <Area
                  type="monotone"
                  dataKey="out"
                  stroke="#FF4D6A"
                  strokeWidth={2}
                  fill="url(#gOut)"
                  name="Pengeluaran"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full gradient-accent" />
            <h3 className="text-sm font-bold">Daftar Transaksi</h3>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)] bg-white/5 px-3 py-1 rounded-full">
            {filteredData.length} item
          </span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredData.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)] text-sm">
              Tidak ada transaksi pada periode ini.
            </div>
          ) : (
            filteredData.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.03] transition-colors duration-200 group"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      item.tipe === "PEMASUKAN"
                        ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "bg-[var(--danger)]/10 text-[var(--danger)]"
                    }`}
                  >
                    {item.tipe === "PEMASUKAN" ? "↗" : "↘"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors">
                      {item.judul}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-bold font-mono text-sm tabular-nums ${
                    item.tipe === "PEMASUKAN"
                      ? "text-[var(--accent)]"
                      : "text-[var(--danger)]"
                  }`}
                >
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
