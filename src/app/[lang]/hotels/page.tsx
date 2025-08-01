import { getDictionary } from "@/dictionaries/dictionaries";

// Define the Hotel type based on the API response
interface Hotel {
  name: string;
  rate: string;
  price: number;
}

export default async function Hotels({
  params,
}: {
  params: Promise<{ lang: "en" | "ro" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const data = await fetch("http://localhost:5000/hotels");
  const hotels: Hotel[] = await data.json();

  return (
    <div className="px-4">
      <h1 className="text-primary">{dict.pages.hotels}</h1>
      <ul className="grid grid-cols-3 grid-rows-3 gap-4">
        {hotels.map((hotel: Hotel, index: number) => (
          <li key={index} className="p-2 mb-2 border-2 rounded-lg">
            <p>Name: {hotel.name}</p>
            <p>Rate: {hotel.rate} stars</p>
            <p>Price: ${hotel.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
