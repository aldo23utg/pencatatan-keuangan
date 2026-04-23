import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

export default async function Home() {
  // --- 1. LOGIKA BACA DATA (Read) ---
  // Kita menyuruh Prisma mengambil semua data transaksi dari Vercel Postgres,
  // dan mengurutkannya dari yang paling baru (descending).
  const dataTransaksi = await prisma.transaksi.findMany({
    orderBy: { tanggal: "desc" },
  });

  // --- 2. LOGIKA SIMPAN DATA (Create) ---
  // Ini adalah fitur canggih Next.js bernama "Server Action".
  // Fungsi ini berjalan murni di server (tidak terlihat oleh browser/hacker).
  async function tambahTransaksi(formData: FormData) {
    "use server"; // Baris sakti penanda ini adalah proses backend

    // Menangkap data yang diketik user di form HTML
    const judul = formData.get("judul") as string;
    const nominal = Number(formData.get("nominal"));
    const tipe = formData.get("tipe") as string;

    // Menyuruh Prisma merekam data baru ke database
    await prisma.transaksi.create({
      data: {
        judul,
        nominal,
        tipe,
      },
    });

    // Me-refresh data di halaman secara instan tanpa loading berkedip (SPA-like)
    revalidatePath("/");
  }

  // --- 3. ANTARMUKA PENGGUNA (Frontend UI) ---
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black p-8 font-sans transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* Bagian Header */}
        <header className="border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Buku Kas.</h1>
          <p className="text-gray-600 font-medium mt-1">Pencatatan Keuangan Minimalis</p>
        </header>

        {/* Bagian Form Input */}
        <section className="bg-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-6 uppercase tracking-wide border-b-2 border-gray-200 pb-2">Catat Transaksi</h2>
          
          {/* Form ini memicu fungsi "tambahTransaksi" saat tombol submit ditekan */}
          <form action={tambahTransaksi} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-800">Judul Transaksi</label>
              <input 
                type="text" 
                name="judul" 
                required 
                placeholder="Misal: Beli Kopi atau Gaji Bulanan" 
                className="border-2 border-gray-300 p-3 focus:border-black focus:outline-none transition-colors"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-800">Nominal (Rp)</label>
                <input 
                  type="number" 
                  name="nominal" 
                  required 
                  placeholder="25000" 
                  className="border-2 border-gray-300 p-3 focus:border-black focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-800">Tipe</label>
                <select 
                  name="tipe" 
                  className="border-2 border-gray-300 p-3 focus:border-black focus:outline-none bg-white cursor-pointer transition-colors"
                >
                  <option value="PENGELUARAN">Pengeluaran</option>
                  <option value="PEMASUKAN">Pemasukan</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="bg-black text-white font-bold py-4 mt-4 border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 uppercase tracking-widest"
            >
              Simpan Data
            </button>
          </form>
        </section>

        {/* Bagian Daftar Riwayat */}
        <section>
          <h2 className="text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2">Riwayat</h2>
          <div className="flex flex-col gap-4">
            {dataTransaksi.length === 0 ? (
              <div className="border-2 border-dashed border-gray-400 p-8 text-center text-gray-500 font-medium">
                Belum ada transaksi dicatat.
              </div>
            ) : (
              dataTransaksi.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-5 bg-white border-2 border-gray-200 hover:border-black transition-colors duration-200 group">
                  <div>
                    <h3 className="font-bold text-lg text-black">{item.judul}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", { 
                        day: '2-digit', month: 'long', year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className={`font-black text-xl tracking-tight ${item.tipe === "PEMASUKAN" ? "text-black" : "text-gray-400"}`}>
                    {item.tipe === "PEMASUKAN" ? "+" : "-"} Rp {item.nominal.toLocaleString("id-ID")}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}