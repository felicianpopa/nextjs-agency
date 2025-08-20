"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/api/fetchData";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mainConfigurations } from "@/branding/configurations";
import { HotelsPageDict } from "@/dictionaries/dictionaries";
import { HotelsMapper, MappedHotel } from "@/data/HotelsMapper";
import CardComponent from "@/components/CardComponent";
import FavButton from "@/components/FavButton";

interface HotelsListProps {
  dict: HotelsPageDict;
  initialHotels: MappedHotel[];
}

export default function HotelsList({ dict, initialHotels }: HotelsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [limit, setLimit] = useState(mainConfigurations.hotelsPerPage);
  const [allHotels, setAllHotels] = useState<MappedHotel[]>(initialHotels);

  const selectedRate = searchParams.get("rate") || "";

  const {
    data: additionalHotels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotels", limit, selectedRate],
    queryFn: () => {
      let url = `http://localhost:5000/hotels?_start=0&_limit=${limit}`;
      if (selectedRate) {
        url += `&rate=${selectedRate}`;
      }
      return fetchData(url);
    },
  });

  // Update allHotels when we get additional data using HotelsMapper
  useEffect(() => {
    if (additionalHotels) {
      const mappedHotels = HotelsMapper.mapArray(additionalHotels);
      setAllHotels(mappedHotels);
    }
  }, [additionalHotels]);

  // Reset limit when filter changes
  useEffect(() => {
    setLimit(mainConfigurations.hotelsPerPage);
  }, [selectedRate]);

  const loadMoreHotels = () => {
    setLimit((prevLimit) => prevLimit + mainConfigurations.hotelsPerPage);
  };

  const handleStarFilter = (rate: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (rate) {
      params.set("rate", rate);
    } else {
      params.delete("rate");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="px-4">
      <h1 className="text-primary">{dict.pages.hotels.title}</h1>

      <div className="mb-4">
        Filter by rating
        <select
          onChange={(e) => handleStarFilter(e.target.value)}
          value={selectedRate}
          className="ml-3.5 px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Ratings</option>
          <option value="1">1 </option>
          <option value="2">2 </option>
          <option value="3">3 </option>
          <option value="4">4 </option>
          <option value="5">5 </option>
        </select>
      </div>

      {error && <p>Error loading hotels: {error.message}</p>}

      {allHotels && (
        <>
          <ul className="grid grid-cols-3 grid-rows-3 gap-4">
            {allHotels.map((hotel: MappedHotel, index: number) => {
              const hotelName =
                (hotel.details.find((d) => d.label === "name")
                  ?.value as string) || "Hotel";

              return (
                <li key={index}>
                  <CardComponent
                    image={hotel.image}
                    details={hotel.details}
                    dictionary={dict.general as Record<string, string>}
                    altText={hotelName}
                    footerSlot={<FavButton productId={hotel.productId} />}
                  />
                </li>
              );
            })}
          </ul>
          {isLoading && <p>{dict.general.loading}...</p>}
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreHotels}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? `${dict.general.loading}...`
                : dict.hotel.loadMoreHotels.replace(
                    "{{count}}",
                    mainConfigurations.hotelsPerPage.toString()
                  )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
