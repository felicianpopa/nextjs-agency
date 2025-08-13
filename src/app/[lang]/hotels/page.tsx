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
  searchParams,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const dict = await getDictionary(lang);

  // Get the rate filter from URL parameters
  const selectedRate = (resolvedSearchParams.rate as string) || "";

  // Build the initial fetch URL based on URL parameters
  let initialUrl = `http://localhost:5000/hotels?_start=0&_limit=${mainConfigurations.hotelsPerPage}`;
  if (selectedRate) {
    initialUrl += `&rate=${selectedRate}`;
  }

  // Fetch initial hotels on the server for SSR (respecting URL parameters)
  const rawInitialHotels = await fetchData(initialUrl);

  const initialHotels = HotelsMapper.mapArray(rawInitialHotels);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["hotels", mainConfigurations.hotelsPerPage, selectedRate],
    queryFn: () => fetchData(initialUrl),
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HotelsList dict={dict} initialHotels={initialHotels} />
    </HydrationBoundary>
  );
}
