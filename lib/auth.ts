import { cookies } from "next/headers";
import prisma from "./prisma";

const SESSION_COOKIE = "uangku_session";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const userId = parseInt(sessionId, 10);
  if (isNaN(userId)) return null;

  const user = await prisma.pengguna.findUnique({
    where: { id: userId },
    select: { id: true, nama: true, username: true, email: true, telepon: true, alamat: true },
  });

  return user;
}

export async function setSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, String(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
