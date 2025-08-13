import { getDictionary } from "@/dictionaries/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.pages.profile.title,
    description: dict.pages.profile.description,
  };
}

export default async function Profile({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <h1>{dict.pages.profile.title}</h1>;
}
