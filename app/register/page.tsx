import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getSession();
  if (user) redirect("/");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={null} isLoggedIn={false} />
      <div className="h-14" />
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <RegisterForm />
      </main>
      <Footer namaPengelola={null} />
    </div>
  );
}
