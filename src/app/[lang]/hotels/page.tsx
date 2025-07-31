import { getDictionary } from "@/dictionaries/dictionaries";

export default async function Offers({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <h1>{dict.pages.hotels}</h1>;
}
