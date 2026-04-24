"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { tambahTransaksi } from "@/app/actions";

export default function TransactionForm() {
  const [judul, setJudul] = useState("");
  const [displayNominal, setDisplayNominal] = useState("");
  const [rawNominal, setRawNominal] = useState(0);
  const [pendingTipe, setPendingTipe] = useState<"PEMASUKAN" | "PENGELUARAN" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) { setDisplayNominal(""); setRawNominal(0); return; }
    const num = parseInt(digits, 10);
    setRawNominal(num);
    setDisplayNominal(formatRupiah(num));
  };

  const onTipeClick = (tipe: "PEMASUKAN" | "PENGELUARAN") => {
    if (!judul.trim() || rawNominal <= 0) return;
    setPendingTipe(tipe);
  };

  const onConfirm = async () => {
    if (!pendingTipe) return;
    setIsSubmitting(true);
    const res = await tambahTransaksi(judul.trim(), rawNominal, pendingTipe);
    setIsSubmitting(false);
    setPendingTipe(null);
    if (res.success) {
      setJudul(""); setDisplayNominal(""); setRawNominal(0);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }
  };

  const isFormValid = judul.trim().length > 0 && rawNominal > 0;

  return (
    <>
      <div className="card-3d p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full gradient-accent" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Catatan Baru</h3>
        </div>

        {showSuccess && (
          <div className="mb-4 px-4 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-xs font-semibold flex items-center gap-2 animate-slideDown" style={{ background: "var(--accent-glow)" }}>
            ✓ Transaksi berhasil disimpan!
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Keterangan</label>
            <input value={judul} onChange={(e) => setJudul(e.target.value)} maxLength={50} placeholder="Makan siang, gaji, bensin..." className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Nominal</label>
            <input type="text" inputMode="numeric" value={displayNominal} onChange={handleNominalChange} placeholder="Rp 10.000" className="input-field font-mono font-bold tabular-nums" />
          </div>

          {/* TWO ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => onTipeClick("PEMASUKAN")}
              disabled={!isFormValid}
              className="btn-primary text-sm py-3"
              style={{ background: isFormValid ? "linear-gradient(135deg, #00D4AA, #00B4D8)" : undefined, opacity: isFormValid ? 1 : 0.4 }}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => onTipeClick("PENGELUARAN")}
              disabled={!isFormValid}
              className="btn-danger text-sm py-3"
              style={{ opacity: isFormValid ? 1 : 0.4 }}
            >
              Pengeluaran
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {pendingTipe && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-fadeIn" style={{ background: "var(--modal-overlay)", backdropFilter: "blur(8px)" }}>
          <div className="card-3d p-7 max-w-sm w-full animate-scaleIn" style={{ background: "var(--bg-card)" }}>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Konfirmasi Transaksi</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5">Pastikan data sudah benar.</p>
            <div className="rounded-xl p-4 space-y-3 mb-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Keterangan</span><span className="font-semibold text-[var(--text-primary)] truncate max-w-[55%] text-right">{judul}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Nominal</span><span className="font-bold font-mono text-[var(--text-primary)]">Rp {displayNominal}</span></div>
              <div className="flex justify-between text-sm items-center"><span className="text-[var(--text-secondary)]">Tipe</span><span className={`font-bold text-xs px-2.5 py-1 rounded-lg ${pendingTipe === "PEMASUKAN" ? "text-[var(--accent)]" : "text-[var(--danger)]"}`} style={{ background: pendingTipe === "PEMASUKAN" ? "var(--accent-glow)" : "var(--danger-glow)" }}>{pendingTipe}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPendingTipe(null)} disabled={isSubmitting} className="btn-outline flex-1">Batal</button>
              <button onClick={onConfirm} disabled={isSubmitting} className={`flex-1 flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-xl transition-all ${pendingTipe === "PEMASUKAN" ? "btn-primary" : "btn-danger"}`}>
                {isSubmitting ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
