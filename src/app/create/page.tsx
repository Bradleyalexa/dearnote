import Link from "next/link";
import CardBuilder from "@/components/builder/CardBuilder";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFBF9] via-[#F4F3EF] to-[#EAE8E2] text-zinc-800 flex flex-col font-sans">
      {/* Header / Logo */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-zinc-200/50">
        <Link href="/" className="flex items-center group">
          <img
            src="/dearnote_logo.png"
            alt="DearNote Logo"
            className="h-16 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold uppercase tracking-wider flex items-center gap-1">
          <span>←</span> Kembali ke Home
        </Link>
      </header>

      {/* Main builder form body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CardBuilder />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[10px] text-slate-500 font-medium">
        Made with DearNote • Kartu yang diterbitkan aktif selama 90 hari
      </footer>
    </div>
  );
}
