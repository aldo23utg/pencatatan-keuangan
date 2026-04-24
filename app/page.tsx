import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransactionForm from "@/components/TransactionForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSession();

  let saldo = 0;
  let totalIn = 0;
  let totalOut = 0;
  let recent: { id: number; judul: string; nominal: number; tipe: string; tanggal: Date }[] = [];

  if (user) {
    const data = await prisma.transaksi.findMany({
      where: { penggunaId: user.id },
      orderBy: { tanggal: "desc" },
    });
    totalIn = data.filter((t) => t.tipe === "PEMASUKAN").reduce((a, t) => a + t.nominal, 0);
    totalOut = data.filter((t) => t.tipe === "PENGELUARAN").reduce((a, t) => a + t.nominal, 0);
    saldo = totalIn - totalOut;
    recent = data.slice(0, 5);
  }

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={user?.nama ?? null} isLoggedIn={!!user} />
      <div className="h-16" />

      <main className="flex-grow max-w-6xl mx-auto px-5 w-full py-8 space-y-8">
        {/* HERO */}
        <section className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden animate-fadeInUp">
          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Total Saldo</p>
          <h2 className="text-4xl md:text-6xl font-black font-mono tabular-nums tracking-tight leading-none text-[var(--text-primary)]">
            <span className="text-2xl md:text-3xl text-[var(--text-secondary)] mr-1">Rp</span>
            {fmt(saldo)}
          </h2>
          <div className="flex items-center gap-6 mt-5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
              <span className="text-sm text-[var(--text-secondary)]">Masuk: <span className="text-[var(--accent)] font-bold font-mono">+{fmt(totalIn)}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--danger)]" />
              <span className="text-sm text-[var(--text-secondary)]">Keluar: <span className="text-[var(--danger)] font-bold font-mono">-{fmt(totalOut)}</span></span>
            </div>
          </div>
          {!user && (
            <div className="mt-6 p-4 rounded-xl border border-[var(--accent)] text-sm text-[var(--text-primary)]" style={{ background: "var(--accent-glow)" }}>
              <Link href="/login" className="font-bold text-[var(--accent)] hover:underline">Login</Link> atau <Link href="/register" className="font-bold text-[var(--accent)] hover:underline">Register</Link> untuk mulai mencatat keuanganmu.
            </div>
          )}
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 animate-fadeInUp stagger-1">
            {user ? (
              <TransactionForm />
            ) : (
              <div className="glass rounded-2xl p-8 text-center">
                <p className="text-base font-semibold text-[var(--text-primary)] mb-2">Catat Keuanganmu</p>
                <p className="text-sm text-[var(--text-secondary)] mb-5">Login untuk mulai menambahkan transaksi.</p>
                <Link href="/login" className="btn-primary inline-block px-8 py-3">Login Sekarang</Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 animate-fadeInUp stagger-2">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full gradient-accent" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Transaksi Terbaru</h3>
                </div>
                {user && <Link href="/riwayat" className="text-xs font-semibold text-[var(--accent)] hover:underline">Lihat Semua →</Link>}
              </div>
              <div className="space-y-1.5">
                {recent.length === 0 ? (
                  <div className="py-10 text-center text-[var(--text-secondary)] text-sm">
                    {user ? "Belum ada transaksi. Mulai catat!" : "Login untuk melihat transaksi."}
                  </div>
                ) : (
                  recent.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--bg-card-hover)] transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${item.tipe === "PEMASUKAN" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`} style={{ background: item.tipe === "PEMASUKAN" ? "var(--accent-glow)" : "var(--danger-glow)" }}>
                          {item.tipe === "PEMASUKAN" ? "↗" : "↘"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">{item.judul}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</p>
                        </div>
                      </div>
                      <p className={`font-bold font-mono text-sm tabular-nums shrink-0 ${item.tipe === "PEMASUKAN" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>
                        {item.tipe === "PEMASUKAN" ? "+" : "-"}{fmt(item.nominal)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer namaPengelola={user?.nama ?? null} />
    </div>
  );
}