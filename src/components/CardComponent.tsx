import Image from "next/image";

interface Detail {
  label: string;
  value: string | number;
}

interface CardComponentProps {
  image?: string;
  details: Detail[];
  dictionary?: Record<string, string>;
  altText?: string;
}

export default function CardComponent({
  image,
  details,
  dictionary,
  altText = "Card image",
}: CardComponentProps) {
  return (
    <div className="p-2 mb-2 border-2 rounded-lg">
      {/* Image section */}
      <div className="mb-3">
        {image ? (
          <Image
            src={`/${image.replace("public/", "")}`}
            alt={altText}
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

      {/* Details section */}
      {details.map((detail, detailIndex) => (
        <p key={detailIndex}>
          {dictionary?.[detail.label] || detail.label}: {detail.value}
        </p>
      ))}
    </div>
  );
}
