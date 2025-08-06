import "server-only";

// Reusable dictionary types
export interface Dictionary {
  navigation: {
    homepage: string;
    offers: string;
    hotels: string;
    profile: string;
  };
  pages: {
    homepage: string;
    offers: string;
    hotels: string;
    profile: string;
  };
  general: {
    loading: string;
    load: string;
    name: string;
    rate: string;
    price: string;
    stars: string;
  };
  hotel: {
    moreHotels: string;
    loadMoreHotels: string;
  };
  metadata: {
    title: string;
    description: string;
  };
}

// Partial dictionary types for specific components
export type GeneralDict = Pick<Dictionary, "general">;
export type PagesDict = Pick<Dictionary, "pages">;
export type HotelDict = Pick<Dictionary, "hotel">;
export type NavigationDict = Pick<Dictionary, "navigation">;

// Combined common dictionaries
export type CommonDict = Pick<Dictionary, "pages" | "general">;
export type HotelsPageDict = Pick<Dictionary, "pages" | "general" | "hotel">;

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  ro: () => import("./ro.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "ro"): Promise<Dictionary> =>
  dictionaries[locale]();
