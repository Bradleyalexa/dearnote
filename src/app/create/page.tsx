import Link from "next/link";
import CardBuilder from "@/components/builder/CardBuilder";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffe5ec] via-[#f5ebe0] to-[#e3d5ca] text-gray-800 flex flex-col font-sans">
      {/* Header / Logo */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-rose-100/30">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">💝</span>
          <span className="font-serif text-xl font-bold tracking-tight text-rose-600">DearNote</span>
        </Link>
        <Link href="/" className="text-xs text-rose-500 hover:text-rose-700 font-semibold uppercase tracking-wider flex items-center gap-1">
          <span>←</span> Kembali ke Home
        </Link>
      </header>

      {/* Main builder form body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CardBuilder />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[10px] text-slate-500 font-medium">
        Made with DearNote • Kartu yang diterbitkan aktif selama 180 hari
      </footer>
    </div>
  );
}
