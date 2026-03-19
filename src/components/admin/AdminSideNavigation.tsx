"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarItem, Icon } from "@ama-pt/agora-design-system";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface NavChild {
  label: string;
  href: string;
  icon?: string;
  customIcon?: string;
}

interface NavGroup {
  key: "profile" | "organization" | "system";
  label: string;
  icon?: string;
  children: NavChild[];
}

const navGroups: NavGroup[] = [
  {
    key: "profile",
    label: "Meu perfil",
    icon: "agora-line-user",
    children: [
      {
        label: "Conjunto de dados",
        href: "/pages/admin/me/datasets",
        icon: "agora-line-layers-menu",
      },
      {
        label: "API",
        href: "/pages/admin/me/dataservices",
        customIcon: "/Icons/reduce_white.svg",
      },
      {
        label: "Reutilizações",
        href: "/pages/admin/me/reuses",
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
    ],
  },
  {
    key: "organization",
    label: "Organização",
    icon: "agora-line-user-group",
    children: [
      {
        label: "Conjunto de dados",
        href: "/pages/admin/org/datasets",
        icon: "agora-line-layers-menu",
      },
      {
        label: "API",
        href: "/pages/admin/org/dataservices",
        customIcon: "/Icons/reduce_white.svg",
      },
      {
        label: "Reutilizações",
        href: "/pages/admin/org/reuses",
        customIcon: "/Icons/bar_char_white.svg",
      },
      {
        label: "Discussões",
        href: "/pages/admin/org/discussions",
        icon: "agora-line-chat",
      },
      {
        label: "Membros",
        href: "/pages/admin/org/members",
        icon: "agora-line-user-group",
      },
      {
        label: "Harvesters",
        href: "/pages/admin/org/harvesters",
        icon: "agora-line-document",
      },
      {
        label: "Recursos comunitários",
        href: "/pages/admin/org/community-resources",
        icon: "agora-line-user-group",
      },
      {
        label: "Perfil",
        href: "/pages/admin/org/profile",
        icon: "agora-line-user",
      },
      {
        label: "Estatísticas",
        href: "/pages/admin/org/statistics",
        customIcon: "/Icons/graphic_circle.svg",
      },
    ],
  },
  {
    key: "system",
    label: "Sistema",
    icon: "agora-line-settings",
    children: [
      {
        label: "Conjunto de dados",
        href: "/pages/admin/system/datasets",
        icon: "agora-line-layers-menu",
      },
      {
        label: "API",
        href: "/pages/admin/system/dataservices",
        customIcon: "/Icons/reduce_white.svg",
      },
      {
        label: "Reutilizações",
        href: "/pages/admin/system/reuses",
        customIcon: "/Icons/bar_char_white.svg",
      },
      {
        label: "Organizações",
        href: "/pages/admin/system/organizations",
        icon: "agora-line-buildings",
      },
      {
        label: "Utilizadores",
        href: "/pages/admin/system/users",
        icon: "agora-line-user-group",
      },
      {
        label: "Harvesters",
        href: "/pages/admin/system/harvesters",
        icon: "agora-line-document",
      },
      {
        label: "Recursos comunitários",
        href: "/pages/admin/system/community-resources",
        icon: "agora-line-user-group",
      },
      {
        label: "Temas",
        href: "/pages/admin/system/topics",
        icon: "agora-line-bookmark-card",
      },
      {
        label: "Artigos",
        href: "/pages/admin/system/posts",
        icon: "agora-line-document",
      },
      {
        label: "Editorial",
        href: "/pages/admin/system/editorial",
        icon: "agora-line-edit",
      },
    ],
  },
];

export function AdminSideNavigation() {
  const pathname = usePathname();
  const { isAdmin, hasOrganization } = useAuth();

  const visibleGroups = useMemo(
    () =>
      navGroups.filter((group) => {
        // Organização e Sistema ocultos temporariamente
        if (group.key === "system") return false;
        if (group.key === "organization") return false;
        return true;
      }),
    [isAdmin, hasOrganization],
  );

  return (
    <nav className="admin-side-nav">
      <Sidebar variant="navigation" darkMode className="admin-sidebar-nav">
        {[
          <SidebarItem
            key="home"
            variant="navigation"
            darkMode
            className="admin-sidebar-nav__home-item"
            item={{
              children: (
                <Link href="/" className="admin-sidebar-nav__group-label">
                  <Icon
                    name="agora-line-home"
                    className="admin-sidebar-nav__group-icon"
                  />
                  Início
                </Link>
              ),
            }}
          />,
          ...visibleGroups.map((group) => {
          const hasActiveChild = group.children.some((child) =>
            pathname?.startsWith(child.href),
          );

          return (
            <SidebarItem
              key={group.label}
              variant="navigation"
              darkMode
              open={hasActiveChild}
              item={{
                children: (
                  <span className={`admin-sidebar-nav__group-label ${hasActiveChild ? "admin-sidebar-nav__group-label--active" : ""}`}>
                    {group.icon && (
                      <Icon
                        name={group.icon}
                        className="admin-sidebar-nav__group-icon"
                      />
                    )}
                    {group.label}
                  </span>
                ),
                hasIcon: true,
                collapsedIconTrailing: "agora-line-chevron-up",
                collapsedIconHoverTrailing: "agora-solid-chevron-up",
                expandedIconTrailing: "agora-line-chevron-down",
                expandedIconHoverTrailing: "agora-solid-chevron-down",
              }}
            >
              <ul className="admin-sidebar-nav__children">
                {group.children.map((child) => {
                  const isActive = pathname?.startsWith(child.href);
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={`admin-sidebar-nav__child-item ${
                          isActive
                            ? "admin-sidebar-nav__child-item--active"
                            : ""
                        }`}
                      >
                        {child.customIcon ? (
                          <Image
                            src={child.customIcon}
                            alt={child.label}
                            width={20}
                            height={20}
                            className="admin-sidebar-nav__child-icon"
                          />
                        ) : child.icon ? (
                          <Icon
                            name={child.icon}
                            className="admin-sidebar-nav__child-icon"
                          />
                        ) : null}
                        <span>{child.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SidebarItem>
          );
        }),
        ]}
      </Sidebar>
    </nav>
  );
}
