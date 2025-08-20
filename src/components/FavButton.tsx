"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function FavButton({ productId }: { productId: number }) {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const favorites = (user?.publicMetadata?.favorites as number[]) || [];
  const isFav = favorites.includes(productId);

  const handleClick = async () => {
    if (!isLoaded || !user || isLoading) return;

    setIsLoading(true);
    try {
      const action = isFav ? "remove" : "add";

      const response = await fetch("/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, action }),
      });

      if (response.ok) {
        // Force refresh user data to update public metadata
        await user.reload();
      } else {
        console.error("Failed to update favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`cursor-pointer ${isLoading ? "opacity-50" : ""}`}
      onClick={handleClick}
      disabled={isLoading || !isLoaded}
    >
      {isFav ? (
        <HeartIconSolid className="w-6 h-6 text-red-500" />
      ) : (
        <HeartIcon className="w-6 h-6 hover:text-red-500" />
      )}
    </button>
  );
}
