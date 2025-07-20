"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { decrement, increment } from "@/store/counterSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export default function Home() {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { value } = useAppSelector((state) => state?.counter);

  const dispatch = useAppDispatch();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // locale lang changes
  const supportedLocales = ["tr", "en", "de"];

  const changeLanguage = (lang: string) => {
    router.push(pathname, { locale: lang });
    setIsLangDropdownOpen(false);
  };

  return (
    <div className="flex  gap-4">
      <Button onClick={() => dispatch(increment())}>+</Button>
      <div className="bg-red-400 text-white p-2 rounded-md">
        {t("HomePage.title")}:{value}
      </div>
      <Button onClick={() => dispatch(decrement())}>-</Button>

      <li
        className="flex  justify-center items-center relative z-50"
        onMouseLeave={() => setIsLangDropdownOpen(false)}
      >
        <button
          className="w-7 h-6 flex items-center justify-center border border-slate-300   rounded-md text-secondary text-xs font-semibold uppercase transition duration-500 hover:bg-secondary hover:text-white"
          onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
          onMouseLeave={() => setIsLangDropdownOpen(false)}
          onMouseEnter={() => setIsLangDropdownOpen(true)}
        >
          {locale}
        </button>
        {isLangDropdownOpen && (
          <ul
            className=" absolute  top-6 w-8 bg-white border   shadow-md text-sm rounded"
            onMouseEnter={() => setIsLangDropdownOpen(true)}
          >
            {supportedLocales.map((lang) => (
              <li
                key={lang}
                className="transition-all duration-200 hover:scale-105"
              >
                <button
                  onClick={() => changeLanguage(lang)}
                  className="block  w-full  py-1.5 text-center text-xs text-secondary rounded 
                                hover:bg-secondary hover:text-white  transition-all duration-300"
                >
                  {lang.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        )}
      </li>
    </div>
  );
}
