"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/api/fetchData";
import { useState, useEffect } from "react";
import Image from "next/image";
import { mainConfigurations } from "@/branding/configurations";
import { HotelsPageDict } from "@/dictionaries/dictionaries";
import { HotelsMapper, MappedHotel } from "@/data/HotelsMapper";

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
                <li key={index} className="p-2 mb-2 border-2 rounded-lg">
                  <div className="mb-3">
                    {hotel.image ? (
                      <Image
                        src={`/${hotel.image.replace("public/", "")}`}
                        alt={hotelName}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Loop through details array */}
                  {hotel.details.map((detail, detailIndex) => {
                    return (
                      <p key={detailIndex}>
                        {(dict.general as Record<string, string>)[
                          detail.label
                        ] || detail.label}
                        : {detail.value}
                      </p>
                    );
                  })}
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
