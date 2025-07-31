"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import menuConfig from "../data/menu.json";

type Language = "en" | "ro";

interface LanguageItem {
  name: string;
  value: Language;
}

interface HeaderProps {
  lang: Language;
  dict: {
    navigation: {
      homepage: string;
      offers: string;
      hotels: string;
    };
  };
}

const languageItems: LanguageItem[] = [
  { name: "EN", value: "en" },
  { name: "RO", value: "ro" },
];

export default function Header({ lang, dict }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageItem>(
    languageItems.find((item) => item.value === lang) || languageItems[0]
  );
  const pathname = usePathname();

  useEffect(() => {
    setSelectedLanguage(
      languageItems.find((item) => item.value === lang) || languageItems[0]
    );
  }, [lang]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectLanguage = (language: LanguageItem) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);

    // Navigate to the new language
    const currentPath = pathname.split("/").slice(2).join("/"); // Remove /[lang] part
    const newPath = `/${language.value}${currentPath ? `/${currentPath}` : ""}`;
    window.location.href = newPath;
  };

  const menuItems = menuConfig.map((item) => ({
    name: dict.navigation[item.key as keyof typeof dict.navigation],
    url: `/${lang}${item.path ? `/${item.path}` : ""}`,
  }));

  return (
    <header className="p-3 bg-blue-300">
      <nav className="flex items-center justify-between">
        <ul className="flex space-x-4 text-black">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.url}>{item.name}</Link>
            </li>
          ))}
        </ul>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="language-menu-button"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            onClick={toggleDropdown}
          >
            {selectedLanguage.name}
            <svg
              className="-mr-1 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="language-menu-button"
            >
              <div className="py-1" role="none">
                {languageItems.map((item, index) => (
                  <button
                    key={index}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      selectedLanguage.value === item.value
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    role="menuitem"
                    onClick={() => selectLanguage(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
