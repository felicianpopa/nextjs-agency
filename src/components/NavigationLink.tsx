"use client";

import Link from "next/link";
import { useNavigation } from "./NavigationContext";
import { ReactNode } from "react";

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function NavigationLink({
  href,
  children,
  className,
  onClick,
}: NavigationLinkProps) {
  const { startLoading } = useNavigation();

  const handleClick = () => {
    startLoading();
    onClick?.();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
