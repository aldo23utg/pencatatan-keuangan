import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RiwayatClient from "@/components/RiwayatClient";

export const dynamic = "force-dynamic";

export default async function RiwayatPage() {
  const user = await getSession();
  let data: { id: number; judul: string; nominal: number; tipe: string; tanggal: Date }[] = [];

  if (user) {
    data = await prisma.transaksi.findMany({
      where: { penggunaId: user.id },
      orderBy: { tanggal: "desc" },
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={user?.nama ?? null} isLoggedIn={!!user} />
      <div className="h-16" />
      <main className="flex-grow max-w-6xl mx-auto px-5 w-full py-8">
        <RiwayatClient dataTransaksi={data} />
      </main>
      <Footer namaPengelola={user?.nama ?? null} />
    </div>
  );
}
