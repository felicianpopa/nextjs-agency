"use client";

import { useNavigation } from "./NavigationContext";

export default function NavigationLoader() {
  const { isLoading } = useNavigation();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center bg-[rgba(255,255,255,0.5)] ">
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
