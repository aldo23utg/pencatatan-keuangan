import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

export default async function Home() {
  // --- 1. JEROAN: AMBIL DATA ---
  
  // Ambil profil atau buat otomatis jika pertama kali buka
  let profil = await prisma.pengguna.findFirst();
  if (!profil) {
    profil = await prisma.pengguna.create({
      data: { nama: "User Baru", saldoAwal: 0 }
    });
  }

  // Ambil semua transaksi
  const dataTransaksi = await prisma.transaksi.findMany({
    orderBy: { tanggal: "desc" },
  });

  // --- 2. LOGIKA KALKULASI ---
  const totalPemasukan = dataTransaksi
    .filter((t) => t.tipe === "PEMASUKAN")
    .reduce((acc, t) => acc + t.nominal, 0);

  const totalPengeluaran = dataTransaksi
    .filter((t) => t.tipe === "PENGELUARAN")
    .reduce((acc, t) => acc + t.nominal, 0);

  const saldoAkhir = (profil?.saldoAwal || 0) + totalPemasukan - totalPengeluaran;

  // --- 3. SERVER ACTIONS ---
  async function updateProfil(formData: FormData) {
    "use server";
    const nama = formData.get("nama") as string;
    const saldoAwal = Number(formData.get("saldoAwal"));
    const id = Number(formData.get("id"));

    await prisma.pengguna.update({
      where: { id },
      data: { nama, saldoAwal }
    });
    revalidatePath("/");
  }

  async function tambahTransaksi(formData: FormData) {
    "use server";
    const judul = formData.get("judul") as string;
    const nominal = Number(formData.get("nominal"));
    const tipe = formData.get("tipe") as string;
    const pId = Number(formData.get("penggunaId"));

    await prisma.transaksi.create({
      data: { 
        judul, 
        nominal, 
        tipe, 
        penggunaId: pId 
      },
    });
    revalidatePath("/");
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-black font-sans flex flex-col transition-all">
      
      {/* HEADER: Responsif & Sticky */}
      <header className="bg-black text-white p-6 sticky top-0 z-50 border-b-4 border-gray-800 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">BUKU.KAS</h1>
            <p className="text-[10px] tracking-[0.3em] text-gray-400 font-bold">VERCEL CLOUD DATABASE</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-900 p-2 px-4 border border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="font-bold text-sm uppercase tracking-widest">{profil.nama}</p>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-10 max-w-5xl mx-auto w-full space-y-10">
        
        {/* GRID ATAS: Saldo & Profil */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* KARTU SALDO UTAMA */}
          <section className="lg:col-span-2 bg-black text-white p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] flex flex-col justify-center min-h-[200px]">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-3">Total Saldo Tersedia</p>
            <h2 className="text-4xl md:text-6xl font-black tabular-nums break-all">
              Rp {saldoAkhir.toLocaleString("id-ID")}
            </h2>
          </section>

          {/* KARTU EDIT PROFIL */}
          <section className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black uppercase text-xs mb-5 border-b-2 border-black pb-2 tracking-widest">Pengaturan Profil</h3>
            <form action={updateProfil} className="space-y-4">
              <input type="hidden" name="id" value={profil.id} />
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase">Nama Pemilik</label>
                <input name="nama" defaultValue={profil.nama} className="w-full border-2 border-black p-2 text-sm focus:bg-gray-50 outline-none font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase">Saldo Awal (Rp)</label>
                <input name="saldoAwal" type="number" defaultValue={profil.saldoAwal} className="w-full border-2 border-black p-2 text-sm focus:bg-gray-50 outline-none font-bold" />
              </div>
              <button className="w-full bg-black text-white text-[10px] font-black p-3 hover:bg-white hover:text-black border-2 border-black transition-all uppercase tracking-widest cursor-pointer">Update Profil</button>
            </form>
          </section>
        </div>

        {/* GRID BAWAH: Input & List */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* FORM TRANSAKSI */}
          <section className="lg:col-span-2">
            <div className="bg-white p-8 border-4 border-black relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
               <div className="absolute -top-4 -left-4 bg-black text-white text-[10px] font-black px-4 py-2 uppercase tracking-tighter">Catat Baru</div>
               <form action={tambahTransaksi} className="space-y-5 pt-4">
                 <input type="hidden" name="penggunaId" value={profil.id} />
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase tracking-widest">Keterangan</label>
                   <input name="judul" required placeholder="Beli apa hari ini?" className="w-full border-2 border-black p-3 focus:ring-4 focus:ring-gray-100 outline-none font-bold" />
                 </div>
                 <div className="flex gap-4">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-black uppercase tracking-widest">Nominal</label>
                      <input name="nominal" type="number" required placeholder="0" className="w-full border-2 border-black p-3 outline-none font-bold" />
                    </div>
                    <div className="space-y-1 w-1/3">
                      <label className="text-[10px] font-black uppercase tracking-widest">Tipe</label>
                      <select name="tipe" className="w-full border-2 border-black p-3 font-black uppercase text-xs bg-white cursor-pointer h-[54px]">
                        <option value="PENGELUARAN">OUT</option>
                        <option value="PEMASUKAN">IN</option>
                      </select>
                    </div>
                 </div>
                 <button className="w-full bg-black text-white font-black py-5 hover:bg-gray-800 transition-all uppercase tracking-widest text-sm shadow-inner active:scale-95 cursor-pointer">Simpan Data</button>
               </form>
            </div>
          </section>

          {/* LIST RIWAYAT */}
          <section className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center border-b-4 border-black pb-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Riwayat Transaksi</h2>
              <div className="bg-black text-white text-[10px] px-2 py-1 font-bold">{dataTransaksi.length} ITEMS</div>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {dataTransaksi.length === 0 ? (
                <div className="border-4 border-dashed border-gray-300 p-10 text-center text-gray-400 font-black uppercase text-xs tracking-widest">Kosong</div>
              ) : (
                dataTransaksi.map((item) => (
                  <div key={item.id} className="bg-white border-2 border-black p-5 flex justify-between items-center hover:translate-x-2 transition-transform duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                      <p className="font-black uppercase text-sm leading-none mb-1">{item.judul}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter italic">
                        {new Date(item.tanggal).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-lg tabular-nums ${item.tipe === 'PEMASUKAN' ? 'text-black' : 'text-gray-400'}`}>
                        {item.tipe === 'PEMASUKAN' ? '+' : '-'} Rp{item.nominal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER: Bersih & Informatif */}
      <footer className="bg-white border-t-4 border-black p-10 mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-1">Dikelola Oleh</p>
            <p className="text-sm font-black uppercase">{profil.nama} — 2026</p>
          </div>
          <div className="flex gap-8">
            <div className="group cursor-pointer">
              <p className="text-[9px] font-black text-gray-400 group-hover:text-black uppercase tracking-widest transition-colors">Stack</p>
              <p className="text-[10px] font-bold">NEXT.JS + PRISMA</p>
            </div>
            <div className="group cursor-pointer text-right">
              <p className="text-[9px] font-black text-gray-400 group-hover:text-black uppercase tracking-widest transition-colors">Hosting</p>
              <p className="text-[10px] font-bold">VERCEL EDGE</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}