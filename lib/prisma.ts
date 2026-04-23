import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Di sinilah Aplikasi Web kita memanggil Jalur Tol (Pooling)
const prismaClientSingleton = () => {
  // 1. Buat kolam koneksi murni menggunakan sopir 'pg'
  // (Kita tambahkan 'as string' agar TypeScript yakin bahwa URL-nya pasti ada)
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_PRISMA_URL as string 
  })
  
  // 2. Jadikan kolam tersebut sebagai Adapter untuk Prisma
  const adapter = new PrismaPg(pool)
  
  // 3. Masukkan adapter tersebut ke dalam PrismaClient
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Mencegah koneksi database menumpuk saat kita sering Save/Reload di komputer lokal
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma