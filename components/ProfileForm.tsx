"use client";

import { useState } from "react";
import { updateProfil } from "@/app/actions";

export default function ProfileForm({
  id,
  defaultNama,
  defaultEmail,
  defaultTelepon,
  defaultAlamat,
}: {
  id: number;
  defaultNama: string;
  defaultEmail: string;
  defaultTelepon: string;
  defaultAlamat: string;
}) {
  const [nama, setNama] = useState(defaultNama);
  const [email, setEmail] = useState(defaultEmail);
  const [telepon, setTelepon] = useState(defaultTelepon);
  const [alamat, setAlamat] = useState(defaultAlamat);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    setShowConfirm(true);
  };

  const onConfirm = async () => {
    setIsSubmitting(true);
    await updateProfil(id, nama.trim(), email.trim(), telepon.trim(), alamat.trim());
    setIsSubmitting(false);
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const fields = [
    { label: "Nama Lengkap", value: nama, setter: setNama, type: "text", icon: "👤", placeholder: "Nama kamu" },
    { label: "Email", value: email, setter: setEmail, type: "email", icon: "✉️", placeholder: "email@example.com" },
    { label: "Nomor Telepon", value: telepon, setter: setTelepon, type: "tel", icon: "📱", placeholder: "08XXXXXXXXX" },
    { label: "Alamat", value: alamat, setter: setAlamat, type: "text", icon: "📍", placeholder: "Kota, Provinsi" },
  ];

  return (
    <>
      <div className="glass rounded-2xl p-8 max-w-2xl mx-auto w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[var(--accent)] opacity-[0.03] blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[var(--danger)] opacity-[0.03] blur-3xl" />

        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="w-20 h-20 mx-auto rounded-2xl gradient-accent flex items-center justify-center text-3xl shadow-lg shadow-[var(--accent-glow)] mb-4 animate-float">
            <span className="text-black font-black text-2xl">
              {nama.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold">{nama}</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">{email}</p>
        </div>

        {showSuccess && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-medium flex items-center gap-2 animate-slideDown">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Profil berhasil diperbarui!
          </div>
        )}

        <form onSubmit={onSubmitAttempt} className="space-y-5">
          {fields.map((f) => (
            <div key={f.label}>
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
                <span>{f.icon}</span> {f.label}
              </label>
              <input
                type={f.type}
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                placeholder={f.placeholder}
                required={f.label === "Nama Lengkap"}
                className="w-full bg-white/5 border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all duration-200"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full mt-3 gradient-accent text-black font-bold text-sm py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[var(--accent-glow)]"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 animate-fadeIn">
          <div className="glass rounded-2xl p-8 max-w-sm w-full animate-scaleIn border border-white/10">
            <h3 className="text-lg font-bold mb-1">Simpan Profil?</h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              Data profil Anda akan diperbarui.
            </p>

            <div className="bg-white/5 rounded-xl p-4 space-y-2 mb-6 border border-[var(--border)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Nama</span>
                <span className="font-medium">{nama}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Email</span>
                <span className="font-medium text-xs">{email}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-white/5 active:scale-[0.97] transition-all"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl text-sm font-bold gradient-accent text-black hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  "Ya, Simpan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
