import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const user = await getSession();

  // Not logged in → show login/register prompt
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar userName={null} isLoggedIn={false} />
        <div className="h-16" />
        <main className="flex-grow flex items-center justify-center px-5">
          <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-accent flex items-center justify-center mb-5">
              <span className="text-black font-black text-xl">?</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Akses Profil</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Silakan login atau register untuk mengakses halaman profil.</p>
            <div className="flex gap-3">
              <Link href="/login" className="btn-outline flex-1 text-center py-3">Login</Link>
              <Link href="/register" className="btn-primary flex-1 text-center py-3">Register</Link>
            </div>
          </div>
        </main>
        <Footer namaPengelola={null} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={user.nama} isLoggedIn={true} />
      <div className="h-16" />
      <main className="flex-grow max-w-6xl mx-auto px-5 w-full py-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">Profil</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Kelola informasi akun kamu.</p>
        </div>
        <div className="animate-fadeInUp stagger-1">
          <ProfileForm
            defaultNama={user.nama}
            defaultEmail={user.email || ""}
            defaultTelepon={user.telepon || ""}
            defaultAlamat={user.alamat || ""}
          />
        </div>
      </main>
      <Footer namaPengelola={user.nama} />
    </div>
  );
}
