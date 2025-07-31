import "server-only";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  ro: () => import("./ro.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "ro") =>
  dictionaries[locale]();
