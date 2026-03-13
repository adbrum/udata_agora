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
        ...(hasNavigation && {
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            onLinkClick(e, href);
          },
        }),
        ...(!hasNavigation && {
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => onLinkClick(e, href),
        }),
      }}
    />
  );
};
