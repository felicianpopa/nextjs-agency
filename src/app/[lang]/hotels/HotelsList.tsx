"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/api/fetchData";
import { useState, useEffect } from "react";
import { mainConfigurations } from "@/branding/configurations";
import { HotelsPageDict } from "@/dictionaries/dictionaries";
import { HotelsMapper, MappedHotel } from "@/data/HotelsMapper";
import CardComponent from "@/components/CardComponent";

interface HotelsListProps {
  dict: HotelsPageDict;
  initialHotels: MappedHotel[];
}

export default function HotelsList({ dict, initialHotels }: HotelsListProps) {
  const [limit, setLimit] = useState(mainConfigurations.hotelsPerPage);
  const [allHotels, setAllHotels] = useState<MappedHotel[]>(initialHotels);

  const {
    data: additionalHotels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotels", limit],
    queryFn: () =>
      fetchData(`http://localhost:5000/hotels?_start=0&_limit=${limit}`),
  });

  // Update allHotels when we get additional data using HotelsMapper
  useEffect(() => {
    if (additionalHotels && limit > mainConfigurations.hotelsPerPage) {
      const mappedHotels = HotelsMapper.mapArray(additionalHotels);
      setAllHotels(mappedHotels);
    }
  }, [additionalHotels, limit]);

  const loadMoreHotels = () => {
    setLimit((prevLimit) => prevLimit + mainConfigurations.hotelsPerPage);
  };

  return (
    <div className="px-4">
      <h1 className="text-primary">{dict.pages.hotels}</h1>
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
