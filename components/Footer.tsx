import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/investasi", label: "Investasi" },
  { href: "/profil", label: "Profil" },
];

export default function Footer({ namaPengelola }: { namaPengelola: string | null }) {
  return (
    <footer className="mt-auto border-t border-[var(--border)]" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto px-5 py-7">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
              <span className="text-black font-black text-xs">U</span>
            </div>
            <span className="font-bold text-sm text-[var(--text-primary)]">UANGKU</span>
          </div>
          <div className="flex gap-5">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[var(--text-secondary)]">&copy; {new Date().getFullYear()} UANGKU. Dibuat oleh <span className="gradient-text font-semibold">aldodev</span></p>
          <div className="flex items-center gap-3">
            {namaPengelola && <p className="text-xs text-[var(--text-secondary)]">👤 {namaPengelola}</p>}
            <span className="text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border)] rounded-full px-2.5 py-0.5" style={{ background: "var(--bg-card)" }}>v1.5.26</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
