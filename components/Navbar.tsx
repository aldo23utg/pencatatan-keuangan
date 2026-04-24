"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Riwayat", href: "/riwayat" },
  { label: "Profil", href: "/profil" },
];

export default function Navbar({ namaPengguna }: { namaPengguna: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 80) {
      setIsVisible(false);
      setIsOpen(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out glass ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-[var(--accent-glow)] group-hover:shadow-xl group-hover:shadow-[var(--accent-glow)] transition-shadow duration-300">
            <span className="text-black font-black text-sm">U</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none">
              UANGKU
            </h1>
            <p className="text-[9px] text-[var(--text-muted)] font-mono tracking-widest leading-none mt-0.5">
              v1.5.26
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-lg transition-all duration-200 ${
                pathname === link.href
                  ? "text-[var(--accent)] bg-[var(--accent-glow)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-4 flex items-center gap-2.5 bg-white/5 rounded-full py-1.5 px-4 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {namaPengguna}
            </span>
          </div>
        </div>

        {/* HAMBURGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 relative flex flex-col justify-between">
            <span
              className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                isOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${
                isOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                isOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-1 space-y-1 border-t border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "text-[var(--accent)] bg-[var(--accent-glow)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-2.5 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-xs text-[var(--text-muted)]">
              Logged in as <span className="text-[var(--text-secondary)] font-medium">{namaPengguna}</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
