import Link from "next/link";

export default function Footer({ namaPengelola }: { namaPengelola: string | null }) {
  return (
    <footer className="mt-auto border-t border-[var(--border)]" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
              <span className="text-black font-black text-xs">U</span>
            </div>
            <span className="font-bold text-sm">UANGKU</span>
          </div>
          <div className="flex gap-6">
            {["/", "/riwayat", "/profil"].map((href) => (
              <Link key={href} href={href} className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                {href === "/" ? "Home" : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} UANGKU. Dibuat oleh <span className="gradient-text font-semibold">aldodev</span>
          </p>
          <div className="flex items-center gap-4">
            {namaPengelola && (
              <p className="text-xs text-[var(--text-secondary)]">👤 {namaPengelola}</p>
            )}
            <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-2.5 py-0.5">v1.5.26</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
