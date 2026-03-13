"use client";

import React, { useState } from "react";
import { Icon } from "@ama-pt/agora-design-system";
import SearchDropdown from "@/components/search/SearchDropdown";

export function AdminHeader() {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("Português");

  const languages = [
    { value: "pt", label: "Português" },
    { value: "en", label: "Inglês" },
    { value: "es", label: "Espanhol" },
    { value: "fr", label: "Francês" },
  ];

  const handleLangSelect = (lang: { value: string; label: string }) => {
    setSelectedLang(lang.label);
    setLangOpen(false);
  };

  return (
    <header className="admin-header">
      <div className="admin-header__content">
        {/* Right-aligned options */}
        <div className="admin-header__options">
          {/* Language selector */}
          <div className="admin-header__lang-wrapper">
            <button
              className="admin-header__option"
              onClick={() => setLangOpen(!langOpen)}
              aria-expanded={langOpen}
              aria-label="Selecionar idioma"
            >
              <span className="admin-header__option-label">{selectedLang}</span>
              <span className="admin-header__option-icon" style={{ fill: "#BBB8FF" }}>
                <Icon
                  name={langOpen ? "agora-line-arrow-up" : "agora-line-arrow-down"}
                  className="admin-header__lang-icon"
                />
              </span>
            </button>
            {langOpen && (
              <div className="admin-header__lang-dropdown">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    className={`admin-header__lang-item ${
                      lang.label === selectedLang
                        ? "admin-header__lang-item--active"
                        : ""
                    }`}
                    onClick={() => handleLangSelect(lang)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="admin-header__search">
            <SearchDropdown
              id="admin-header-search"
              placeholder="Pesquisar"
              label="Pesquisar"
            />
          </div>

          {/* User avatar */}
          <div className="admin-header__avatar-wrapper">
            <div className="admin-header__avatar">
              <span className="admin-header__avatar-initials">DM</span>
            </div>
            <span className="admin-header__notification" />
          </div>
        </div>
      </div>
    </header>
  );
}
