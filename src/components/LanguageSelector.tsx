"use client";

import { useI18nStore } from "@/lib/i18n/store";
import { useEffect, useState } from "react";

export default function LanguageSelector() {
  const { lang, setLang } = useI18nStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 border border-gray-100 rounded-full text-gray-400 opacity-60">
        ID | EN
      </div>
    );
  }

  return (
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-0.5 shadow-2xs">
      <button
        type="button"
        onClick={() => setLang("id")}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
          lang === "id"
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
          lang === "en"
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        EN
      </button>
    </div>
  );
}
