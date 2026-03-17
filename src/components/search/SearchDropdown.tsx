"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputSearchBar } from "@ama-pt/agora-design-system";

type SearchType = "datasets" | "dataservices" | "reuses" | "organizations";

const SEARCH_OPTIONS: { type: SearchType; label: string; path: string }[] = [
  { type: "datasets", label: "conjuntos de dados", path: "/pages/datasets" },
  { type: "dataservices", label: "APIs", path: "/pages/dataservices" },
  { type: "reuses", label: "reutilizações", path: "/pages/reuses" },
  { type: "organizations", label: "organizações", path: "/pages/organizations" },
];

interface SearchDropdownProps {
  id: string;
  darkMode?: boolean;
  placeholder?: string;
  label?: string;
  hasVoiceActionButton?: boolean;
}

export default function SearchDropdown({
  id,
  darkMode = false,
  placeholder = "Pesquisar datasets, organizações, reutilizações...",
  label = "Pesquisar",
  hasVoiceActionButton = false,
}: SearchDropdownProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for input changes via native event on the wrapper
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === "INPUT") {
        const val = target.value;
        setQuery(val);
        setIsOpen(val.trim().length > 0);
        setActiveIndex(-1);
      }
    };

    wrapper.addEventListener("input", handleInput);
    return () => wrapper.removeEventListener("input", handleInput);
  }, []);

  const navigateToSearch = (type: SearchType) => {
    const q = query.trim();
    if (q) {
      const option = SEARCH_OPTIONS.find((o) => o.type === type);
      const path = option?.path || "/pages/datasets";
      router.push(`${path}?q=${encodeURIComponent(q)}`);
      setIsOpen(false);
      setQuery("");
      const input = wrapperRef.current?.querySelector("input");
      if (input) input.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" && query.trim()) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < SEARCH_OPTIONS.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : SEARCH_OPTIONS.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          navigateToSearch(SEARCH_OPTIONS[activeIndex].type);
        } else {
          navigateToSearch("datasets");
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleSearchActivate = () => {
    if (query.trim()) {
      navigateToSearch("datasets");
    }
  };

  return (
    <div ref={wrapperRef} className="relative" style={{ zIndex: 40 }}>
      <InputSearchBar
        label={label}
        placeholder={placeholder}
        id={id}
        onKeyDown={handleKeyDown}
        onSearchActivate={handleSearchActivate}
        onFocus={() => {
          const input = wrapperRef.current?.querySelector("input");
          if (input && input.value.trim()) setIsOpen(true);
        }}
        darkMode={darkMode}
        hasVoiceActionButton={hasVoiceActionButton}
        voiceActionAltText="Pesquisar por voz"
        searchActionAltText="Pesquisar"
        autoComplete="off"
      />

      {isOpen && query.trim() && (
        <div
          className="absolute w-full bg-white overflow-hidden"
          style={{
            zIndex: 9999,
            border: "1px solid #0C1932",
            borderTop: "1px solid #DCE1E8",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <ul className="list-none m-0 p-0" role="listbox">
            {SEARCH_OPTIONS.map((option, index) => (
              <li
                key={option.type}
                role="option"
                aria-selected={activeIndex === index}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  backgroundColor:
                    activeIndex === index ? "#F7F7FF" : "white",
                  borderTop: index > 0 ? "1px solid #DCE1E8" : "none",
                  fontSize: "14px",
                  color: "#2B363C",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
                onClick={() => navigateToSearch(option.type)}
              >
                Pesquisar{" "}
                <strong>&laquo;{query.trim()}&raquo;</strong>{" "}
                nos/nas <strong>{option.label}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
