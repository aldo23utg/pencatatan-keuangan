"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfil(
  id: number,
  nama: string,
  email?: string,
  telepon?: string,
  alamat?: string
) {
  try {
    await prisma.pengguna.update({
      where: { id },
      data: { nama, email, telepon, alamat },
    });
    revalidatePath("/");
    revalidatePath("/profil");
    return { success: true };
  } catch (error) {
    console.error("updateProfil error:", error);
    return { success: false, error: "Gagal memperbarui profil." };
  }
}

export async function tambahTransaksi(
  judul: string,
  nominal: number,
  tipe: string,
  penggunaId: number
) {
  try {
    await prisma.transaksi.create({
      data: { judul, nominal, tipe, penggunaId },
    });
    revalidatePath("/");
    revalidatePath("/riwayat");
    return { success: true };
  } catch (error) {
    console.error("tambahTransaksi error:", error);
    return { success: false, error: "Gagal menambahkan transaksi." };
  }
}
