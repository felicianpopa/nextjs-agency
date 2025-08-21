"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchData } from "@/api/fetchData";
import { HotelsPageDict } from "@/dictionaries/dictionaries";
import { HotelsMapper, MappedHotel } from "@/data/HotelsMapper";
import CardComponent from "@/components/CardComponent";
import FavButton from "@/components/FavButton";

interface FavouritesListProps {
  dict: HotelsPageDict;
}

export default function FavouritesList({ dict }: FavouritesListProps) {
  const [listStatus, setListStatus] = useState("Getting user data");
  const { isSignedIn, isLoaded, user } = useUser();
  const [favList, setFavList] = useState<MappedHotel[]>([]);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        setListStatus("Got user data");
      } else {
        setListStatus(
          "Please log in in order to be able to show the favourites list"
        );
      }
    }
  }, [isSignedIn, isLoaded]);
  useEffect(() => {
    const fetchFavoriteHotels = async () => {
      if (user?.publicMetadata?.favorites && isSignedIn) {
        try {
          setListStatus("Loading your favorite hotels...");
          const favHotelsList = user.publicMetadata.favorites as number[];

          // Fallback: Make individual requests for each ID (using Promise.all for parallel execution)
          const hotelPromises = favHotelsList.map((id) =>
            fetchData(`http://localhost:5000/hotels/${id}`)
          );

          const rawFavoriteHotels = await Promise.all(hotelPromises);
          // Map the raw hotel data using HotelsMapper
          const favoriteHotels = HotelsMapper.mapArray(rawFavoriteHotels);

          setFavList(favoriteHotels);
          setListStatus(
            favoriteHotels.length > 0
              ? "Your favorite hotels"
              : "No favorite hotels found"
          );
        } catch (error) {
          console.error("Error fetching favorite hotels:", error);
          setListStatus("Error loading favorite hotels");
        }
      }
    };

    fetchFavoriteHotels();
  }, [user, isSignedIn]);
  return (
    <div className="px-4">
      <h1 className="text-primary">Your Favorite Hotels</h1>
      <h2>{listStatus}</h2>

      {favList.length > 0 && (
        <ul className="grid grid-cols-3 grid-rows-3 gap-4">
          {favList.map((hotel: MappedHotel, index: number) => {
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
      )}
    </div>
  );
}
