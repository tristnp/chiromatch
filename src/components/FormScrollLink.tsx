"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type FormScrollLinkProps = {
  children: ReactNode;
  className?: string;
  homeChildren?: ReactNode;
  providerChildren?: ReactNode;
};

function getFormHrefForPath(pathname: string | null) {
  if (!pathname || pathname === "/") {
    return "#match-form";
  }

  if (pathname === "/auto-accident-chiropractor") {
    return "#service-form";
  }

  if (pathname === "/for-chiropractors") {
    return "#provider-application";
  }

  if (pathname.startsWith("/chiropractor-after-car-accident/") || pathname.startsWith("/whiplash-chiropractor/")) {
    return "#match-form";
  }

  return "/#match-form";
}

export function FormScrollLink({ children, className, homeChildren, providerChildren }: FormScrollLinkProps) {
  const pathname = usePathname();
  const content =
    pathname === "/" && homeChildren
      ? homeChildren
      : pathname === "/for-chiropractors" && providerChildren
        ? providerChildren
        : children;

  return (
    <Link className={className} href={getFormHrefForPath(pathname)}>
      {content}
    </Link>
  );
}
