"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@ama-pt/agora-design-system";

interface NavItem {
  label: string;
  href: string;
  icon?: string;
  customIcon?: string;
}

const navItems: NavItem[] = [
  {
    label: "APIS",
    href: "/pages/admin/dataservices/new",
    customIcon: "/Icons/reduce.svg",
  },
  {
    label: "Conjunto de dados",
    href: "/pages/admin/me/datasets",
    icon: "agora-line-layers-menu",
  },
  {
    label: "Reutilizações",
    href: "/pages/admin/reuses",
    customIcon: "/Icons/bar_char_white.svg",
  },
  {
    label: "Recursos comunitários",
    href: "/pages/admin/community-resources",
    icon: "agora-line-user-group",
  },
  {
    label: "Perfil",
    href: "/pages/admin/profile",
    icon: "agora-line-user",
  },
  {
    label: "Estatísticas",
    href: "/pages/admin/statistics",
    customIcon: "/Icons/graphic_circle.svg",
  },
  {
    label: "dados.gov",
    href: "/",
    icon: "agora-line-plane",
  },
];

export function AdminSideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="admin-side-nav">
      <div className="admin-side-nav__items">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-side-nav__item ${isActive ? "admin-side-nav__item--active" : ""}`}
            >
              {item.customIcon ? (
                <Image
                  src={item.customIcon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="admin-side-nav__icon"
                />
              ) : (
                <Icon name={item.icon!} className="admin-side-nav__icon" />
              )}
              <span className="admin-side-nav__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
