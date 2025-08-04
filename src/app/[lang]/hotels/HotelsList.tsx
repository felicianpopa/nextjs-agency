"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/api/fetchData";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Hotel {
  name: string;
  rate: string;
  price: number;
  image?: string;
}

interface HotelsListProps {
  dict: {
    pages: {
      hotels: string;
    };
    hotel: {
      name: string;
      rate: string;
      price: string;
      stars: string;
    };
  };
  initialHotels: Hotel[];
}

export default function HotelsList({ dict, initialHotels }: HotelsListProps) {
  const [limit, setLimit] = useState(5);
  const [allHotels, setAllHotels] = useState<Hotel[]>(initialHotels);

  const {
    data: additionalHotels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotels", limit],
    queryFn: () =>
      fetchData(`http://localhost:5000/hotels?_start=0&_limit=${limit}`),
  });

  // Update allHotels when we get additional data
  useEffect(() => {
    if (additionalHotels && limit > 5) {
      setAllHotels(additionalHotels);
    }
  }, [additionalHotels, limit]);

  const loadMoreHotels = () => {
    setLimit((prevLimit) => prevLimit + 5);
  };

  return (
    <div className="px-4">
      <h1 className="text-primary">{dict.pages.hotels}</h1>
      {error && <p>Error loading hotels: {error.message}</p>}

      {allHotels && (
        <>
          <ul className="grid grid-cols-3 grid-rows-3 gap-4">
            {allHotels.map((hotel: Hotel, index: number) => (
              <li key={index} className="p-2 mb-2 border-2 rounded-lg">
                <div className="mb-3">
                  {hotel.image ? (
                    <Image
                      src={`/${hotel.image.replace("public/", "")}`}
                      alt={hotel.name}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                <p>
                  {dict.hotel.name}: {hotel.name}
                </p>
                <p>
                  {dict.hotel.rate}: {hotel.rate} {dict.hotel.stars}
                </p>
                <p>
                  {dict.hotel.price}: ${hotel.price}
                </p>
              </li>
            ))}
          </ul>
          {isLoading && <p>Loading hotels...</p>}
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreHotels}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Load 5 More Hotels"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
