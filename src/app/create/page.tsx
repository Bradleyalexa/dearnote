"use client";

import Link from "next/link";
import CardBuilder from "@/components/builder/CardBuilder";
import LanguageSelector from "@/components/LanguageSelector";
import { useI18nStore } from "@/lib/i18n/store";
import { translations } from "@/lib/i18n/translations";
import { useEffect, useState } from "react";

export default function CreatePage() {
  const { lang } = useI18nStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = mounted ? lang : "id";
  const t = translations[currentLang];
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased">

      {/* Header / Logo */}
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <img
              src="/img/dearnote_logo.png"
              alt={t.logoAlt}
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <LanguageSelector />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">{t.backHome}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main builder form body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CardBuilder />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <p>{t.footerText}</p>
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
          <Link href="/terms" target="_blank" className="hover:text-gray-600 transition-colors underline decoration-dotted">
            {t.terms}
          </Link>
          <span>•</span>
          <Link href="/refund" target="_blank" className="hover:text-gray-600 transition-colors underline decoration-dotted">
            {t.refund}
          </Link>
          <span>•</span>
          <Link href="/privacy" target="_blank" className="hover:text-gray-600 transition-colors underline decoration-dotted">
            {t.privacy}
          </Link>
        </div>
        <div className="mt-3 text-xs text-gray-400 space-y-0.5">
          <p>{t.jakartaIndonesia}</p>
          <p>{t.contactText}: <a href="mailto:hidearnote@gmail.com" className="hover:text-gray-600 underline">hidearnote@gmail.com</a></p>
        </div>
      </footer>
    </div>
  );
}
