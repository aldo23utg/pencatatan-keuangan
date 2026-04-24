"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { logout } from "@/app/actions";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Riwayat", href: "/riwayat" },
  { label: "Profil", href: "/profil" },
];

export default function Navbar({
  userName,
  isLoggedIn,
}: {
  userName: string | null;
  isLoggedIn: boolean;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setIsVisible(y <= lastScrollY || y < 80);
    setLastScrollY(y);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ background: "var(--navbar-bg)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shadow-md">
            <span className="text-black font-black text-sm">U</span>
          </div>
          <span className="font-black text-base tracking-tight">UANGKU</span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                pathname === l.href
                  ? "text-[var(--accent)] bg-[var(--accent-glow)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-sm hover:bg-[var(--bg-secondary)] transition-colors"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* User badge or login */}
          {isLoggedIn ? (
            <div className="ml-2 flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-full py-1.5 px-3 border border-[var(--border)]">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span className="text-xs font-medium text-[var(--text-secondary)]">{userName}</span>
              </div>
              <form action={logout}>
                <button type="submit" className="text-[10px] font-semibold text-[var(--danger)] hover:underline px-2 py-1">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-3 px-4 py-2 text-xs font-bold gradient-accent text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          )}
        </div>

        {/* HAMBURGER */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="w-8 h-8 flex items-center justify-center text-sm">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2" aria-label="Menu">
            <div className="w-5 h-3.5 relative flex flex-col justify-between">
              <span className={`block h-0.5 bg-[var(--text-primary)] rounded transition-all duration-300 origin-center ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block h-0.5 bg-[var(--text-primary)] rounded transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-[var(--text-primary)] rounded transition-all duration-300 origin-center ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "var(--navbar-bg)" }}
      >
        <div className="px-5 pb-4 pt-1 space-y-1 border-t border-[var(--border)]">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                pathname === l.href
                  ? "text-[var(--accent)] bg-[var(--accent-glow)]"
                  : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[var(--border)] mt-2">
            {isLoggedIn ? (
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm text-[var(--text-secondary)]">👤 {userName}</span>
                <form action={logout}>
                  <button type="submit" className="text-xs font-semibold text-[var(--danger)] hover:underline">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-3 rounded-lg text-sm font-bold gradient-accent text-black"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
