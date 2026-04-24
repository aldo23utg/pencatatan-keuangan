import Link from "next/link";

export default function Footer({ namaPengelola }: { namaPengelola: string }) {
  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <span className="text-black font-black text-xs">U</span>
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight">UANGKU</p>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">Personal Finance</p>
            </div>
          </div>

          <div className="flex gap-8">
            <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <Link href="/riwayat" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              Riwayat
            </Link>
            <Link href="/profil" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              Profil
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} UANGKU. Dikembangkan oleh{" "}
            <span className="gradient-text font-semibold">aldodev</span>
          </p>

          <div className="flex items-center gap-6">
            <p className="text-[11px] text-[var(--text-muted)]">
              Dikelola oleh <span className="text-[var(--text-secondary)]">{namaPengelola}</span>
            </p>
            <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[10px] font-mono text-[var(--text-muted)]">v1.5.26</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
