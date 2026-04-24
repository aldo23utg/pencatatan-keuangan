"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { tambahTransaksi } from "@/app/actions";

export default function TransactionForm() {
  const [judul, setJudul] = useState("");
  const [displayNominal, setDisplayNominal] = useState("");
  const [rawNominal, setRawNominal] = useState(0);
  const [tipe, setTipe] = useState("PENGELUARAN");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) { setDisplayNominal(""); setRawNominal(0); return; }
    const num = parseInt(digits, 10);
    setRawNominal(num);
    setDisplayNominal(formatRupiah(num));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || rawNominal <= 0) return;
    setShowConfirm(true);
  };

  const onConfirm = async () => {
    setIsSubmitting(true);
    const res = await tambahTransaksi(judul.trim(), rawNominal, tipe);
    setIsSubmitting(false);
    setShowConfirm(false);
    if (res.success) {
      setJudul(""); setDisplayNominal(""); setRawNominal(0); setTipe("PENGELUARAN");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }
  };

  return (
    <>
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full gradient-accent" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Catatan Baru</h3>
        </div>

        {showSuccess && (
          <div className="mb-4 px-4 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-xs font-semibold flex items-center gap-2 animate-slideDown" style={{ background: "var(--accent-glow)" }}>
            ✓ Transaksi berhasil disimpan!
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Keterangan</label>
            <input value={judul} onChange={(e) => setJudul(e.target.value)} required maxLength={50} placeholder="Makan siang, gaji, bensin..." className="input-field" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Nominal</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] font-mono">Rp</span>
                <input type="text" value={displayNominal} onChange={handleNominalChange} required placeholder="0" className="input-field pl-10 font-mono font-bold tabular-nums" />
              </div>
            </div>
            <div className="w-28">
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Tipe</label>
              <div className="flex rounded-xl overflow-hidden border border-[var(--border)] h-[46px]" style={{ background: "var(--bg-secondary)" }}>
                <button type="button" onClick={() => setTipe("PENGELUARAN")} className={`flex-1 text-[10px] font-bold transition-all ${tipe === "PENGELUARAN" ? "bg-[var(--danger)] text-white" : "text-[var(--text-secondary)]"}`}>OUT</button>
                <button type="button" onClick={() => setTipe("PEMASUKAN")} className={`flex-1 text-[10px] font-bold transition-all ${tipe === "PEMASUKAN" ? "bg-[var(--accent)] text-black" : "text-[var(--text-secondary)]"}`}>IN</button>
              </div>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-2">Simpan Transaksi</button>
        </form>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-fadeIn" style={{ background: "var(--modal-overlay)", backdropFilter: "blur(8px)" }}>
          <div className="glass rounded-2xl p-7 max-w-sm w-full animate-scaleIn border border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Konfirmasi Transaksi</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5">Pastikan data sudah benar.</p>
            <div className="rounded-xl p-4 space-y-3 mb-5 border border-[var(--border)]" style={{ background: "var(--bg-secondary)" }}>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Keterangan</span><span className="font-semibold text-[var(--text-primary)] truncate max-w-[60%] text-right">{judul}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Nominal</span><span className="font-bold font-mono text-[var(--text-primary)]">Rp {displayNominal}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Tipe</span><span className={`font-bold text-xs px-2 py-0.5 rounded-md ${tipe === "PEMASUKAN" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`} style={{ background: tipe === "PEMASUKAN" ? "var(--accent-glow)" : "var(--danger-glow)" }}>{tipe}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} disabled={isSubmitting} className="btn-outline flex-1">Batal</button>
              <button onClick={onConfirm} disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {isSubmitting ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
