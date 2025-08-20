/*
HOW TO USE THIS COMPONENT:
1. Import it: import CardComponent from './path/to/CardComponent'
2. Use it with props:
   <CardComponent 
     image="/path/to/image.jpg"
     details={[
       {label: "name", value: "Hotel Name"},
       {label: "price", value: "$100/night"}
     ]}
     dictionary={{name: "Name", price: "Price"}}
     altText="Hotel image"
   />
*/

// Import the Next.js Image component for optimized image display
import Image from "next/image";

/**
 * CardComponent - A reusable card that displays an image and details
 *
 * This component creates a card layout with:
 * - An image at the top (or placeholder if no image)
 * - A list of details below the image
 */
export default function CardComponent({
  image, // The image URL to display (can be null/undefined)
  details, // Array of objects with label and value properties
  dictionary, // Translation object for different languages
  altText = "Card image", // Fallback text for screen readers (accessibility)
  footerSlot,
}) {
  return (
    // MAIN CARD CONTAINER
    <div className="p-2 mb-2 border-2 rounded-lg card">
      {/* IMAGE SECTION - Shows either the actual image or a placeholder */}
      <div className="mb-3 card__header">
        {/* Check if an image URL was provided */}
        {image ? (
          // DISPLAY ACTUAL IMAGE
          // Next.js Image component provides automatic optimization
          <Image
            src={image} // The image source URL
            alt={altText} // Alt text for accessibility (screen readers)
            width={200} // Original width (used for optimization)
            height={150} // Original height (used for optimization)
            className="w-full h-32 object-cover rounded-md"
          />
        ) : (
          // DISPLAY PLACEHOLDER when no image is available
          // Creates a gray box with "No image available" text
          <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
            {/* Placeholder text - CUSTOMIZE THIS to change the message */}
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      <div className="card__body">
        {/* DETAILS SECTION - Shows all the information about the item */}
        {/* Loop through each detail item and display it */}
        {details.map((detail, detailIndex) => (
          // Each detail is displayed as a paragraph
          <p key={detailIndex}>
            {/* 
            LABEL (Bold text): 
            - First tries to find translation in dictionary
            - Falls back to original label if no translation found
            - Makes it bold with <strong> tag
          */}
            <strong>{dictionary?.[detail.label] || detail.label}:</strong>
            {/* VALUE: The actual information to display */}
            {detail.value}
          </p>
        ))}
      </div>
      <div className="card__footer">{footerSlot}</div>
    </div>
  );
}
