export interface CardComponentProps {
  image?: string | null; // Optional - The image URL to display (can be null/undefined)
  details: Array<{
    label: string;
    value: string | number;
  }>; // Required - Array of objects with label and value properties
  dictionary: Record<string, string>; // Required - Translation object for different languages
  altText?: string; // Optional - Fallback text for screen readers (accessibility)
  footerSlot?: React.ReactNode; // Optional - Footer content to display at the bottom of the card
}

declare const CardComponent: React.FC<CardComponentProps>;
export default CardComponent;
