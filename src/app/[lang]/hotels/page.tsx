import { getDictionary } from "@/dictionaries/dictionaries";
import { fetchData } from "@/api/fetchData";
import { mainConfigurations } from "@/branding/configurations";
import { HotelsMapper } from "@/data/HotelsMapper";
import { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import HotelsList from "./HotelsList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.pages.hotels,
    description: dict.metadata.description,
  };
}

export default async function Hotels({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Fetch initial 5 hotels on the server for SSR
  const rawInitialHotels = await fetchData(
    `http://localhost:5000/hotels?_start=0&_limit=${mainConfigurations.hotelsPerPage}`
  );

  const initialHotels = HotelsMapper.mapArray(rawInitialHotels);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["hotels", mainConfigurations.hotelsPerPage],
    queryFn: () =>
      fetchData(
        `http://localhost:5000/hotels?_start=0&_limit=${mainConfigurations.hotelsPerPage}`
      ),
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HotelsList dict={dict} initialHotels={initialHotels} />
    </HydrationBoundary>
  );
}
