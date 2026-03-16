"use client";

import React from "react";
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

  return (
    <div
      role="link"
      tabIndex={0}
      className="cursor-pointer"
      onClick={(e) => {
        if (hasNavigation) {
          e.preventDefault();
          e.stopPropagation();
          onLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, href);
        }
      }}
      onKeyDown={(e) => {
        if (hasNavigation && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, href);
        }
      }}
    >
      <CardGeneral
        isCardHorizontal={true}
        isBlockedLink={true}
        variant="neutral-100"
        iconDefault={iconDefault}
        iconHover={iconHover}
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
