"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/api/fetchData";
import { useState, useEffect } from "react";
import { mainConfigurations } from "@/branding/configurations";
import { OffersPageDict } from "@/dictionaries/dictionaries";
import { OffersMapper, MappedOffer } from "@/data/OffersMapper";
import CardComponent from "@/components/CardComponent";

interface OffersListProps {
  dict: OffersPageDict;
  initialOffers: MappedOffer[];
}

export default function OffersList({ dict, initialOffers }: OffersListProps) {
  const [limit, setLimit] = useState(mainConfigurations.offersPerPage);
  const [allOffers, setAllOffers] = useState<MappedOffer[]>(initialOffers);

  const {
    data: additionalOffers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["offers", limit],
    queryFn: () =>
      fetchData(`http://localhost:5000/offers?_start=0&_limit=${limit}`),
  });

  // Update allOffers when we get additional data using OffersMapper
  useEffect(() => {
    if (additionalOffers && limit > mainConfigurations.offersPerPage) {
      const mappedOffers = OffersMapper.mapArray(additionalOffers);
      setAllOffers(mappedOffers);
    }
  }, [additionalOffers, limit]);

  const loadMoreOffers = () => {
    setLimit((prevLimit) => prevLimit + mainConfigurations.offersPerPage);
  };

  return (
    <div className="px-4">
      <h1 className="text-primary">{dict.pages.offers.title}</h1>
      {error && <p>Error loading offers: {error.message}</p>}

      {allOffers && (
        <>
          <ul className="grid grid-cols-2 grid-rows-2 gap-4">
            {allOffers.map((offer: MappedOffer, index: number) => {
              const offerName =
                (offer.details.find((d) => d.label === "name")
                  ?.value as string) || "Offer";

              return (
                <li key={index}>
                  <CardComponent
                    details={offer.details}
                    dictionary={dict.general as Record<string, string>}
                    altText={offerName}
                  />
                </li>
              );
            })}
          </ul>
          {isLoading && <p>{dict.general.loading}...</p>}
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreOffers}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? `${dict.general.loading}...`
                : dict.offer.loadMoreOffers.replace(
                    "{{count}}",
                    mainConfigurations.offersPerPage.toString()
                  )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
