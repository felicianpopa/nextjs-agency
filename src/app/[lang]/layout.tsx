import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getDictionary } from "@/dictionaries/dictionaries";
import Providers from "../providers";
import { ClerkProvider } from "@clerk/nextjs";

import Header from "@/components/Header";
import NavigationLoader from "@/components/NavigationLoader";
import { NavigationProvider } from "@/components/NavigationContext";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ro" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "ro" }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <Providers>
            <NavigationProvider>
              <NavigationLoader />
              <main>
                <Header lang={lang} dict={dict} />
                {children}
              </main>
            </NavigationProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
