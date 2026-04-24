import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransactionForm from "@/components/TransactionForm";
import Link from "next/link";

export default async function Home() {
  let profil = await prisma.pengguna.findFirst();
  if (!profil) {
    profil = await prisma.pengguna.create({
      data: { nama: "User Baru" },
    });
  }

  const dataTransaksi = await prisma.transaksi.findMany({
    orderBy: { tanggal: "desc" },
  });

  const totalIn = dataTransaksi
    .filter((t) => t.tipe === "PEMASUKAN")
    .reduce((a, t) => a + t.nominal, 0);

  const totalOut = dataTransaksi
    .filter((t) => t.tipe === "PENGELUARAN")
    .reduce((a, t) => a + t.nominal, 0);

  const saldo = totalIn - totalOut;
  const recent = dataTransaksi.slice(0, 5);

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar namaPengguna={profil.nama} />
      <div className="h-20" />

      <main className="flex-grow max-w-6xl mx-auto px-5 w-full py-8 space-y-8">
        {/* HERO BALANCE */}
        <section className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden animate-fadeInUp">
          {/* Decorative orbs */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[var(--accent)] opacity-[0.04] blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-500 opacity-[0.03] blur-[80px]" />

          <p className="text-xs text-[var(--text-muted)] font-medium tracking-wide mb-2 relative z-10">
            Total Saldo
          </p>
          <h2 className="text-5xl md:text-7xl font-black font-mono tabular-nums tracking-tight relative z-10 leading-none">
            <span className="text-[var(--text-muted)] text-3xl md:text-4xl mr-2">Rp</span>
            {fmt(saldo)}
          </h2>

          <div className="flex items-center gap-6 mt-6 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="text-xs text-[var(--text-muted)]">
                Masuk:{" "}
                <span className="text-[var(--accent)] font-bold font-mono">
                  +{fmt(totalIn)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--danger)]" />
              <span className="text-xs text-[var(--text-muted)]">
                Keluar:{" "}
                <span className="text-[var(--danger)] font-bold font-mono">
                  -{fmt(totalOut)}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* FORM */}
          <div className="lg:col-span-2 animate-fadeInUp stagger-1">
            <TransactionForm penggunaId={profil.id} />
          </div>

          {/* RECENT */}
          <div className="lg:col-span-3 animate-fadeInUp stagger-2">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full gradient-accent" />
                  <h3 className="text-sm font-bold">Transaksi Terbaru</h3>
                </div>
                <Link
                  href="/riwayat"
                  className="text-[11px] font-medium text-[var(--accent)] hover:underline underline-offset-4 transition-all"
                >
                  Lihat Semua →
                </Link>
              </div>

              <div className="space-y-1.5">
                {recent.length === 0 ? (
                  <div className="py-10 text-center text-[var(--text-muted)] text-sm">
                    Belum ada transaksi. Mulai catat!
                  </div>
                ) : (
                  recent.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.03] transition-colors duration-200 group animate-fadeInUp stagger-${
                        i + 1
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                            item.tipe === "PEMASUKAN"
                              ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                              : "bg-[var(--danger)]/10 text-[var(--danger)]"
                          }`}
                        >
                          {item.tipe === "PEMASUKAN" ? "↗" : "↘"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate group-hover:text-[var(--accent)] transition-colors">
                            {item.judul}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {new Date(item.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-bold font-mono text-sm tabular-nums shrink-0 ${
                          item.tipe === "PEMASUKAN"
                            ? "text-[var(--accent)]"
                            : "text-[var(--danger)]"
                        }`}
                      >
                        {item.tipe === "PEMASUKAN" ? "+" : "-"}
                        {fmt(item.nominal)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer namaPengelola={profil.nama} />
    </div>
  );
}