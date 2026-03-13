"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@ama-pt/agora-design-system";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    label: "APIS",
    href: "/pages/admin/dataservices/new",
    icon: "agora-line-link",
  },
  {
    label: "Conjunto de dados",
    href: "/pages/admin/datasetsadmin",
    icon: "agora-line-file",
  },
  {
    label: "Reutilizações",
    href: "/pages/admin/reuses",
    icon: "agora-line-external-link",
  },
  {
    label: "Recursos comunitários",
    href: "/pages/admin/community-resources",
    icon: "agora-line-building",
  },
  {
    label: "Perfil",
    href: "/pages/admin/profile",
    icon: "agora-line-user",
  },
  {
    label: "Estatísticas",
    href: "/pages/admin/statistics",
    icon: "agora-line-eye",
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
              <Icon name={item.icon} className="admin-side-nav__icon" />
              <span className="admin-side-nav__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
