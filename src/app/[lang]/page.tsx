import { getDictionary } from "@/dictionaries/dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <h1>{dict.pages.homepage}</h1>;
}
