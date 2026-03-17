"use client";

import React, { useRef, useEffect } from "react";
import { CardGeneral } from "@ama-pt/agora-design-system";

interface HeaderCardProps {
  iconDefault: string;
  iconHover?: string;
  title: string;
  description: string;
  href: string;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const HeaderCard = ({
  iconDefault,
  iconHover,
  title,
  description,
  href,
  onLinkClick,
}: HeaderCardProps) => {
  const hasNavigation = href !== "#";
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Make internal anchors non-focusable (single tab per card)
    el.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", "-1"));
  }, []);

  // Use the same icon for all 3 states so there's never a wrong icon
  const icon = iconHover || iconDefault;

  return (
    <div
      ref={wrapperRef}
      className="cursor-pointer"
      onClick={(e) => {
        if (hasNavigation) {
          e.preventDefault();
          e.stopPropagation();
          onLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, href);
        }
      }}
    >
      <CardGeneral
        isCardHorizontal={true}
        isBlockedLink={true}
        variant="neutral-100"
        iconDefault={icon}
        iconHover={icon}
        titleText={title}
        descriptionText={description}
        anchor={{
          href,
          children: "",
          hasIcon: true,
          trailingIcon: "agora-line-arrow-right-circle",
          trailingIconHover: "agora-solid-arrow-right-circle",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (hasNavigation) {
              onLinkClick(e, href);
            }
          },
        }}
      />
    </div>
  );
};
