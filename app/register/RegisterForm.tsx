"use client";

import { useState } from "react";
import { register } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(true); // default: visible
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNama = (v: string) => {
    // Only letters and spaces allowed
    setNama(v.replace(/[^a-zA-Z\s]/g, ""));
  };

  const handleUsername = (v: string) => {
    // Force lowercase, only a-z 0-9 _
    setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const n = nama.trim();
    const u = username.trim();
    if (n.length < 5 || n.length > 25) { setError("Nama lengkap harus 5-25 karakter."); return; }
    if (u.length < 4 || u.length > 10) { setError("Username harus 4-10 karakter."); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }
    setLoading(true);
    const res = await register(n, u, password);
    setLoading(false);
    if (res.success) { router.push("/"); router.refresh(); }
    else setError(res.error || "Register gagal.");
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-7">
        <div className="w-14 h-14 mx-auto rounded-2xl gradient-accent flex items-center justify-center shadow-lg mb-4">
          <span className="text-black font-black text-xl">U</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Buat Akun Baru</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Gratis dan hanya butuh beberapa detik.</p>
      </div>

      <div className="card-3d p-7" style={{ background: "var(--bg-card)" }}>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl border text-xs font-semibold text-[var(--danger)] animate-slideDown" style={{ background: "var(--danger-glow)", borderColor: "var(--danger)" }}>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Nama Lengkap</label>
            <input value={nama} onChange={(e) => handleNama(e.target.value)} required minLength={5} maxLength={25} placeholder="nama lengkap kamu" className="input-field" />
            <p className="text-[10px] text-[var(--text-muted)] mt-1">5-25 karakter, hanya huruf.</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Username</label>
            <input value={username} onChange={(e) => handleUsername(e.target.value)} required minLength={4} maxLength={10} placeholder="username kamu" className="input-field font-mono" autoComplete="username" />
            <p className="text-[10px] text-[var(--text-muted)] mt-1">4-10 karakter, huruf kecil. Angka dan _ opsional.</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                required minLength={6} placeholder="min. 6 karakter"
                className="input-field pr-12 font-mono" autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-1">
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-1">Huruf kecil dan angka. Angka opsional.</p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Buat Akun"}
          </button>
        </form>
        <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
          Sudah punya akun? <Link href="/login" className="font-bold text-[var(--accent)] hover:underline">Login</Link>
        </p>
      </div>
      <p className="text-center mt-5">
        <Link href="/" className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">← Kembali ke Home</Link>
      </p>
    </div>
  );
}
