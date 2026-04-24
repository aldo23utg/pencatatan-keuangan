"use client";

import { useState } from "react";
import { updateProfil } from "@/app/actions";

export default function ProfileForm({
  defaultNama, defaultEmail, defaultTelepon, defaultAlamat,
}: {
  defaultNama: string; defaultEmail: string; defaultTelepon: string; defaultAlamat: string;
}) {
  const [nama, setNama] = useState(defaultNama);
  const [email, setEmail] = useState(defaultEmail);
  const [telepon, setTelepon] = useState(defaultTelepon);
  const [alamat, setAlamat] = useState(defaultAlamat);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!nama.trim()) return; setShowConfirm(true); };

  const onConfirm = async () => {
    setIsSubmitting(true);
    await updateProfil(nama.trim(), email.trim(), telepon.trim(), alamat.trim());
    setIsSubmitting(false); setShowConfirm(false); setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const fields = [
    { label: "Nama Lengkap", value: nama, setter: setNama, type: "text", placeholder: "Nama kamu", required: true },
    { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "email@example.com", required: false },
    { label: "Nomor Telepon", value: telepon, setter: setTelepon, type: "tel", placeholder: "08XXXXXXXXX", required: false },
    { label: "Alamat", value: alamat, setter: setAlamat, type: "text", placeholder: "Kota, Provinsi", required: false },
  ];

  return (
    <>
      <div className="card-3d p-7 max-w-2xl mx-auto w-full" style={{ background: "var(--bg-card)" }}>
        <div className="text-center mb-7">
          <div className="w-18 h-18 w-[72px] h-[72px] mx-auto rounded-2xl gradient-accent flex items-center justify-center shadow-lg mb-4 animate-float">
            <span className="text-black font-black text-2xl">{nama.charAt(0).toUpperCase()}</span>
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{nama}</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{email || "Belum diatur"}</p>
        </div>

        {showSuccess && (
          <div className="mb-5 px-4 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-xs font-semibold flex items-center gap-2 animate-slideDown" style={{ background: "var(--accent-glow)" }}>
            ✓ Profil berhasil diperbarui!
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.label}>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">{f.label}</label>
                <input type={f.type} value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder} required={f.required} className="input-field" />
              </div>
            ))}
          </div>
          <button type="submit" className="btn-primary mt-2">Simpan Perubahan</button>
        </form>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-fadeIn" style={{ background: "var(--modal-overlay)", backdropFilter: "blur(8px)" }}>
          <div className="card-3d p-7 max-w-sm w-full animate-scaleIn" style={{ background: "var(--bg-card)" }}>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Simpan Profil?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5">Data profil akan diperbarui.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} disabled={isSubmitting} className="btn-outline flex-1">Batal</button>
              <button onClick={onConfirm} disabled={isSubmitting} className="btn-primary flex-1">
                {isSubmitting ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Ya, Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
