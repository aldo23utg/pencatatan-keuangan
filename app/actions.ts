"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession, setSession, clearSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// ========== AUTH ==========

export async function register(nama: string, username: string, password: string) {
  const existing = await prisma.pengguna.findUnique({ where: { username } });
  if (existing) {
    return { success: false, error: "Username sudah dipakai. Pilih yang lain." };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.pengguna.create({
    data: { nama, username, password: hashed },
  });

  await setSession(user.id);
  return { success: true };
}

export async function login(username: string, password: string) {
  const user = await prisma.pengguna.findUnique({ where: { username } });
  if (!user) {
    return { success: false, error: "Username tidak ditemukan." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, error: "Password salah." };
  }

  await setSession(user.id);
  return { success: true };
}

export async function logout() {
  await clearSession();
  redirect("/");
}

// ========== TRANSAKSI ==========

export async function tambahTransaksi(judul: string, nominal: number, tipe: string) {
  const user = await getSession();
  if (!user) return { success: false, error: "Silakan login terlebih dahulu." };

  await prisma.transaksi.create({
    data: { judul, nominal, tipe, penggunaId: user.id },
  });
  revalidatePath("/");
  revalidatePath("/riwayat");
  return { success: true };
}

// ========== PROFIL ==========

export async function updateProfil(nama: string, email?: string, telepon?: string, alamat?: string) {
  const user = await getSession();
  if (!user) return { success: false, error: "Silakan login terlebih dahulu." };

  await prisma.pengguna.update({
    where: { id: user.id },
    data: { nama, email, telepon, alamat },
  });
  revalidatePath("/");
  revalidatePath("/profil");
  return { success: true };
}
