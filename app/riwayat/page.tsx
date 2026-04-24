import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RiwayatClient from "@/components/RiwayatClient";
import Link from "next/link";

export default async function RiwayatPage() {
  const profil = await prisma.pengguna.findFirst();

  if (!profil) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-[var(--text-muted)]">
          User tidak ditemukan.{" "}
          <Link href="/" className="text-[var(--accent)] underline">
            Ke Home
          </Link>
        </p>
      </div>
    );
  }

  const dataTransaksi = await prisma.transaksi.findMany({
    orderBy: { tanggal: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar namaPengguna={profil.nama} />
      <div className="h-20" />

      <main className="flex-grow max-w-6xl mx-auto px-5 w-full py-8">
        <RiwayatClient dataTransaksi={dataTransaksi} />
      </main>

      <Footer namaPengelola={profil.nama} />
    </div>
  );
}
