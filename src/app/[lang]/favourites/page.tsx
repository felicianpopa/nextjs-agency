import { getDictionary } from "@/dictionaries/dictionaries";
import { Metadata } from "next";
import FavouritesList from "./FavouritesList";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Favorite Hotels",
    description: "View your favorite hotels",
  };
}

export default async function Favourites({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <FavouritesList dict={dict} />
    </>
  );
}
