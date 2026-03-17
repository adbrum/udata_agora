"use client";

import React from "react";
import { Icon } from "@ama-pt/agora-design-system";

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
  const isCustomIcon = iconDefault.startsWith("/");

  return (
    <div
      role="link"
      tabIndex={0}
      className="header-card-custom cursor-pointer"
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
      <div className="header-card-custom__icon">
        {isCustomIcon ? (
          <img src={iconDefault} alt="" className="w-[16px] h-[16px]" />
        ) : (
          <>
            <span className="header-card-custom__icon-default">
              <Icon name={iconDefault} dimensions="xs" className="fill-white" />
            </span>
            <span className="header-card-custom__icon-hover">
              <Icon name={iconHover || iconDefault} dimensions="xs" className="fill-white" />
            </span>
          </>
        )}
      </div>
      <div className="header-card-custom__content">
        <span className="header-card-custom__title">{title}</span>
        <span className="header-card-custom__description">{description}</span>
      </div>
      <div className="header-card-custom__arrow">
        <Icon name="agora-line-arrow-right-circle" className="w-[24px] h-[24px] fill-primary-600" />
      </div>
    </div>
  );
};
