"use client";

import { useState } from "react";
import { register } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !username.trim() || !password) return;
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }
    if (/[^a-zA-Z0-9_]/.test(username)) { setError("Username hanya boleh huruf, angka, dan underscore."); return; }
    setLoading(true);
    setError("");
    const res = await register(nama.trim(), username.trim(), password);
    setLoading(false);
    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(res.error || "Register gagal.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl gradient-accent flex items-center justify-center shadow-lg mb-4">
            <span className="text-black font-black text-xl">U</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Buat Akun Baru</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Gratis dan hanya butuh beberapa detik.</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-[var(--border)]">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl border text-xs font-semibold text-[var(--danger)] animate-slideDown" style={{ background: "var(--danger-glow)", borderColor: "var(--danger)" }}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Nama Lengkap</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} required placeholder="Nama kamu" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} required placeholder="username_kamu" className="input-field font-mono" autoComplete="username" />
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Huruf kecil, angka, underscore. Harus unik.</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 karakter" className="input-field" autoComplete="new-password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Buat Akun"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-[var(--accent)] hover:underline">Login</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">← Kembali ke Home</Link>
        </p>
      </div>
    </div>
  );
}
