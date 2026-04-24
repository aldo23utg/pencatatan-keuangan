"use client";

import { useState, useRef } from "react";
import { formatRupiah } from "@/lib/utils";
import { tambahTransaksi } from "@/app/actions";

export default function TransactionForm({
  penggunaId,
}: {
  penggunaId: number;
}) {
  const [judul, setJudul] = useState("");
  const [displayNominal, setDisplayNominal] = useState("");
  const [rawNominal, setRawNominal] = useState(0);
  const [tipe, setTipe] = useState("PENGELUARAN");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      setDisplayNominal("");
      setRawNominal(0);
      return;
    }
    const num = parseInt(digits, 10);
    setRawNominal(num);
    setDisplayNominal(formatRupiah(num));
  };

  const onSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || rawNominal <= 0) return;
    setShowConfirm(true);
  };

  const onConfirm = async () => {
    setIsSubmitting(true);
    await tambahTransaksi(judul.trim(), rawNominal, tipe, penggunaId);
    setJudul("");
    setDisplayNominal("");
    setRawNominal(0);
    setTipe("PENGELUARAN");
    setIsSubmitting(false);
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <>
      <div className="glass rounded-2xl p-6 relative overflow-hidden group">
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--accent)] opacity-[0.03] blur-3xl group-hover:opacity-[0.06] transition-opacity duration-700" />

        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 rounded-full gradient-accent" />
          <h3 className="text-sm font-bold tracking-wide">Catatan Baru</h3>
        </div>

        {showSuccess && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-medium flex items-center gap-2 animate-slideDown">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Transaksi berhasil disimpan!
          </div>
        )}

        <form ref={formRef} onSubmit={onSubmitAttempt} className="space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1.5 block">
              Keterangan
            </label>
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              maxLength={50}
              placeholder="Makan siang, gaji, bensin..."
              className="w-full bg-white/5 border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all duration-200"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1.5 block">
                Nominal
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] font-mono">
                  Rp
                </span>
                <input
                  type="text"
                  value={displayNominal}
                  onChange={handleNominalChange}
                  required
                  placeholder="0"
                  className="w-full bg-white/5 border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm font-bold font-mono tabular-nums placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all duration-200"
                />
              </div>
            </div>

            <div className="w-28">
              <label className="text-[11px] font-medium text-[var(--text-muted)] mb-1.5 block">
                Tipe
              </label>
              <div className="flex rounded-xl overflow-hidden border border-[var(--border)] bg-white/5 h-[46px]">
                <button
                  type="button"
                  onClick={() => setTipe("PENGELUARAN")}
                  className={`flex-1 text-[10px] font-bold tracking-wide transition-all duration-200 ${
                    tipe === "PENGELUARAN"
                      ? "bg-[var(--danger)] text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  OUT
                </button>
                <button
                  type="button"
                  onClick={() => setTipe("PEMASUKAN")}
                  className={`flex-1 text-[10px] font-bold tracking-wide transition-all duration-200 ${
                    tipe === "PEMASUKAN"
                      ? "bg-[var(--accent)] text-black"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  IN
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 gradient-accent text-black font-bold text-sm py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[var(--accent-glow)] hover:shadow-xl hover:shadow-[var(--accent-glow)]"
          >
            Simpan Transaksi
          </button>
        </form>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 animate-fadeIn">
          <div className="glass rounded-2xl p-8 max-w-sm w-full animate-scaleIn border border-white/10">
            <h3 className="text-lg font-bold mb-1">Konfirmasi Transaksi</h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              Pastikan data sudah benar sebelum menyimpan.
            </p>

            <div className="bg-white/5 rounded-xl p-4 space-y-3 mb-6 border border-[var(--border)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Keterangan</span>
                <span className="font-medium text-right max-w-[60%] truncate">{judul}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Nominal</span>
                <span className="font-bold font-mono">
                  Rp {displayNominal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Tipe</span>
                <span
                  className={`font-bold text-xs px-2 py-0.5 rounded-md ${
                    tipe === "PEMASUKAN"
                      ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                      : "bg-[var(--danger)]/15 text-[var(--danger)]"
                  }`}
                >
                  {tipe === "PEMASUKAN" ? "PEMASUKAN" : "PENGELUARAN"}
                </span>
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
                  "Konfirmasi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
