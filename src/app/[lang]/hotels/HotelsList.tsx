"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/api/fetchData";
import { useState } from "react";

interface Hotel {
  name: string;
  rate: string;
  price: number;
}

interface HotelsListProps {
  dict: {
    pages: {
      hotels: string;
    };
  };
}

export default function HotelsList({ dict }: HotelsListProps) {
  const [limit, setLimit] = useState(5);

  const {
    data: hotels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotels", limit],
    queryFn: () =>
      fetchData(`http://localhost:5000/hotels?_start=0&_limit=${limit}`),
  });

  const loadMoreHotels = () => {
    setLimit((prevLimit) => prevLimit + 5);
  };

  return (
    <div className="px-4">
      <h1 className="text-primary">{dict.pages.hotels}</h1>
      {isLoading && <p>Loading hotels...</p>}
      {error && <p>Error loading hotels: {error.message}</p>}
      {hotels && (
        <>
          <ul className="grid grid-cols-3 grid-rows-3 gap-4">
            {hotels.map((hotel: Hotel, index: number) => (
              <li key={index} className="p-2 mb-2 border-2 rounded-lg">
                <p>Name: {hotel.name}</p>
                <p>Rate: {hotel.rate} stars</p>
                <p>Price: ${hotel.price}</p>
              </li>
            ))}
          </ul>
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
