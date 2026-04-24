export function formatRupiah(number: number): string {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(number);
}

export function unformatRupiah(rupiah: string): number {
  return parseInt(rupiah.replace(/[^0-9]/g, ""), 10) || 0;
}
