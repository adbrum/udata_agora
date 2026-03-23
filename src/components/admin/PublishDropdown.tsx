"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon } from "@ama-pt/agora-design-system";

const PUBLISH_ITEMS = [
  {
    icon: "agora-line-layers-menu",
    label: "Um conjunto de dados",
    href: "/pages/admin/me/datasets/new",
  },
  {
    icon: null,
    customIcon: "/Icons/bar_chart.svg",
    label: "Uma reutilização",
    href: "/pages/admin/me/reuses/new",
  },
  { icon: "agora-line-award", label: "Um harvester", href: "/pages/admin/harvesters/new" },
  {
    icon: "agora-line-buildings",
    label: "Uma organização",
    href: "/pages/admin/organizations/new",
  },
];

interface PublishDropdownProps {
  darkMode?: boolean;
}

export default function PublishDropdown({ darkMode = false }: PublishDropdownProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="relative inline-block publish-dropdown-wrapper" ref={wrapperRef}>
      <Button
        variant="primary"
        darkMode={darkMode}
        hasIcon={true}
        trailingIcon={showDropdown ? "agora-line-chevron-up" : "agora-line-chevron-down"}
        trailingIconHover={showDropdown ? "agora-solid-chevron-up" : "agora-solid-chevron-down"}
        className="px-24 py-16 h-auto relative z-10"
        onClick={() => setShowDropdown((v) => !v)}
      >
        <span className="text-lg font-medium">
          Publicar <span className="font-bold">dados.gov</span>
        </span>
      </Button>
      {showDropdown && (
        <div className="publish-custom-dropdown">
          {PUBLISH_ITEMS.map((item, index) => (
            <button
              key={index}
              className="publish-custom-dropdown__item"
              onClick={() => {
                setShowDropdown(false);
                router.push(item.href);
              }}
            >
              {item.icon ? (
                <Icon name={item.icon} className="w-[24px] h-[24px] text-primary-600" />
              ) : (
                <img
                  src={item.customIcon!}
                  alt=""
                  className="w-[24px] h-[24px]"
                  aria-hidden="true"
                />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
