import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const categories = [
  {
    title: "Saham & Reksa Dana",
    desc: "Mulai investasi saham dan reksa dana dari Rp10.000.",
    items: [
      { name: "Bibit", desc: "Reksa dana & saham terkurasi AI", url: "https://bibit.id", color: "#22C55E", icon: "🌱" },
      { name: "Ajaib", desc: "Trading saham & reksa dana mudah", url: "https://ajaib.co.id", color: "#6366F1", icon: "✨" },
      { name: "Stockbit", desc: "Komunitas & trading saham", url: "https://stockbit.com", color: "#3B82F6", icon: "📊" },
      { name: "Bareksa", desc: "Marketplace reksa dana terbesar", url: "https://bareksa.com", color: "#F59E0B", icon: "💰" },
    ],
  },
  {
    title: "Crypto & Digital Assets",
    desc: "Perdagangan aset kripto terdaftar Bappebti.",
    items: [
      { name: "Indodax", desc: "Exchange crypto terbesar di Indonesia", url: "https://indodax.com", color: "#22D3EE", icon: "₿" },
      { name: "Tokocrypto", desc: "Crypto exchange by Binance", url: "https://tokocrypto.com", color: "#F59E0B", icon: "🪙" },
      { name: "Pintu", desc: "Beli crypto mulai Rp11.000", url: "https://pintu.co.id", color: "#3B82F6", icon: "🔐" },
      { name: "Reku", desc: "Investasi crypto & saham AS", url: "https://reku.id", color: "#8B5CF6", icon: "🚀" },
    ],
  },
  {
    title: "Emas & Logam Mulia",
    desc: "Investasi emas digital mulai Rp5.000.",
    items: [
      { name: "Pluang", desc: "Emas, saham AS, dan crypto", url: "https://pluang.com", color: "#F59E0B", icon: "🥇" },
      { name: "Treasury", desc: "Tabungan emas digital", url: "https://treasury.id", color: "#EAB308", icon: "🏆" },
      { name: "Pegadaian Digital", desc: "Tabungan emas BUMN", url: "https://pegadaian.co.id", color: "#22C55E", icon: "🏛️" },
    ],
  },
  {
    title: "P2P Lending",
    desc: "Pendanaan UMKM dengan imbal hasil menarik.",
    items: [
      { name: "Asetku", desc: "P2P lending return tinggi", url: "https://asetku.co.id", color: "#EC4899", icon: "📈" },
      { name: "KoinWorks", desc: "Super financial app", url: "https://koinworks.com", color: "#3B82F6", icon: "🤝" },
      { name: "Modalku", desc: "Pendanaan UMKM terpercaya", url: "https://modalku.co.id", color: "#10B981", icon: "🏢" },
    ],
  },
];

export default async function InvestasiPage() {
  const user = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={user?.nama ?? null} isLoggedIn={!!user} />
      <div className="h-14" />

      <main className="flex-grow max-w-6xl mx-auto px-4 w-full py-6 space-y-8">
        <div className="animate-fadeInUp">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">Investasi</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Rekomendasi platform investasi terpercaya di Indonesia.</p>
        </div>

        {/* TIP CARD */}
        <div className="card-3d p-5 md:p-6 animate-fadeInUp stagger-1" style={{ borderLeft: "4px solid var(--accent)" }}>
          <p className="text-sm text-[var(--text-primary)] font-semibold mb-1">💡 Tips Investasi</p>
          <p className="text-sm text-[var(--text-secondary)]">Diversifikasi portofoliomu di berbagai instrumen. Mulai dari yang kamu pahami, dan selalu sisihkan dana darurat sebelum berinvestasi.</p>
        </div>

        {categories.map((cat, ci) => (
          <section key={cat.title} className={`animate-fadeInUp stagger-${Math.min(ci + 1, 3)}`}>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{cat.title}</h2>
              <p className="text-sm text-[var(--text-secondary)]">{cat.desc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cat.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-3d p-5 group cursor-pointer block"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: `${item.color}18`, color: item.color }}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{item.name}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)]">
                    <span>Kunjungi</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* DISCLAIMER */}
        <div className="card-3d p-5 text-center animate-fadeInUp" style={{ borderTop: "2px solid var(--danger)" }}>
          <p className="text-xs text-[var(--text-secondary)]">
            ⚠️ <span className="font-semibold">Disclaimer:</span> UANGKU hanya menyediakan rekomendasi platform. Segala keputusan investasi merupakan tanggung jawab pribadi. Pastikan platform terdaftar dan diawasi oleh OJK atau Bappebti.
          </p>
        </div>
      </main>

      <Footer namaPengelola={user?.nama ?? null} />
    </div>
  );
}
