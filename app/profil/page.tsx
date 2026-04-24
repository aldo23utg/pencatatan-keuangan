import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";

export default async function ProfilPage() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar namaPengguna={profil.nama} />
      <div className="h-20" />

      <main className="flex-grow max-w-6xl mx-auto px-5 w-full py-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
            Profil
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Kelola informasi pribadimu.
          </p>
        </div>

        <div className="animate-fadeInUp stagger-1">
          <ProfileForm
            id={profil.id}
            defaultNama={profil.nama}
            defaultEmail={profil.email || ""}
            defaultTelepon={profil.telepon || ""}
            defaultAlamat={profil.alamat || ""}
          />
        </div>
      </main>

      <Footer namaPengelola={profil.nama} />
    </div>
  );
}
