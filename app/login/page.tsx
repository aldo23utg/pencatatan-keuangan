"use client";

import { useState } from "react";
import { login } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    setError("");
    const res = await login(username.trim(), password);
    setLoading(false);
    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(res.error || "Login gagal.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl gradient-accent flex items-center justify-center shadow-lg mb-4">
            <span className="text-black font-black text-xl">U</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Selamat Datang</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Login ke akun UANGKU kamu.</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-[var(--border)]">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl border text-xs font-semibold text-[var(--danger)] animate-slideDown" style={{ background: "var(--danger-glow)", borderColor: "var(--danger)" }}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="usernamu" className="input-field" autoComplete="username" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="input-field" autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-[var(--accent)] hover:underline">Register</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">← Kembali ke Home</Link>
        </p>
      </div>
    </div>
  );
}
