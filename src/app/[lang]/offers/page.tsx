import { getDictionary } from "@/dictionaries/dictionaries";
import { fetchData } from "@/api/fetchData";
import { mainConfigurations } from "@/branding/configurations";
import { OffersMapper } from "@/data/OffersMapper";
import { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import OffersList from "./OffersList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.pages.offers.title,
    description: dict.pages.offers.description,
  };
}

export default async function Offers({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Fetch initial offers on the server for SSR
  const rawInitialOffers = await fetchData(
    `http://localhost:5000/offers?_start=0&_limit=${mainConfigurations.offersPerPage}`
  );

  const initialOffers = OffersMapper.mapArray(rawInitialOffers);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["offers", mainConfigurations.offersPerPage],
    queryFn: () =>
      fetchData(
        `http://localhost:5000/offers?_start=0&_limit=${mainConfigurations.offersPerPage}`
      ),
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OffersList dict={dict} initialOffers={initialOffers} />
    </HydrationBoundary>
  );
}
