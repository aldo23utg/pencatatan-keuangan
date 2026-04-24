"use client";

import { useState } from "react";
import { login } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true); setError("");
    const res = await login(username.trim(), password);
    setLoading(false);
    if (res.success) { router.push("/"); router.refresh(); }
    else setError(res.error || "Login gagal.");
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-7">
        <div className="w-14 h-14 mx-auto rounded-2xl gradient-accent flex items-center justify-center shadow-lg mb-4">
          <span className="text-black font-black text-xl">U</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Selamat Datang</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Login ke akun UANGKU kamu.</p>
      </div>

      <div className="card-3d p-7" style={{ background: "var(--bg-card)" }}>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl border text-xs font-semibold text-[var(--danger)] animate-slideDown" style={{ background: "var(--danger-glow)", borderColor: "var(--danger)" }}>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              required maxLength={10} 
              placeholder="username kamu" 
              className="input-field font-mono" autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="input-field pr-12" autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-1">
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
          Belum punya akun? <Link href="/register" className="font-bold text-[var(--accent)] hover:underline">Register</Link>
        </p>
      </div>
      <p className="text-center mt-5">
        <Link href="/" className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">← Kembali ke Home</Link>
      </p>
    </div>
  );
}
