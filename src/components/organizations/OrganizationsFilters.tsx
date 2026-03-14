"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarItem, InputSearch, Icon, Pill } from "@ama-pt/agora-design-system";
import { OrgBadges, OrganizationFilters, SiteMetrics } from "@/types/api";
import { CategoryToggles } from "@/components/CategoryToggles";

interface OrganizationsFiltersProps {
  siteMetrics: SiteMetrics;
  orgBadges: OrgBadges;
  orgBadgeCounts: Record<string, number>;
  initialFilters: OrganizationFilters;
}

const BADGE_LABELS_PT: Record<string, string> = {
  association: "Associação",
  certified: "Certificado",
  company: "Empresa",
  "local-authority": "Autoridade Local",
  "public-service": "Serviço Público",
};

export const OrganizationsFilters = ({
  siteMetrics,
  orgBadges,
  orgBadgeCounts,
  initialFilters,
}: OrganizationsFiltersProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const activeBadge = initialFilters.badge || "";

  const entries = Object.keys(orgBadges).map((kind) => ({
    kind,
    label: BADGE_LABELS_PT[kind] || orgBadges[kind],
    count: orgBadgeCounts[kind] ?? 0,
  }));

  const filteredEntries = searchQuery.trim()
    ? entries.filter((entry) => entry.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : entries;

  const handleBadgeClick = (kind: string) => {
    const newParams = new URLSearchParams();
    if (initialFilters.q) newParams.set("q", initialFilters.q);
    if (initialFilters.sort) newParams.set("sort", initialFilters.sort);
    if (activeBadge === kind) {
      newParams.delete("badge");
    } else {
      newParams.set("badge", kind);
    }
    newParams.set("page", "1");
    const qs = newParams.toString();
    router.replace(`/pages/organizations${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return (
    <div className="h-full organizations-filters">
      <CategoryToggles siteMetrics={siteMetrics} />

      <h2 className="font-bold text-xl text-neutral-900 mt-64 mb-32">Filtros</h2>

      <Sidebar variant="filter" className="font-bold">
        <SidebarItem
          variant="filter"
          open={true}
          item={{
            children: <span className="font-bold">Tipo de Organização</span>,
            hasIcon: true,
            collapsedIconTrailing: "agora-line-minus-circle",
            collapsedIconHoverTrailing: "agora-solid-minus-circle",
            expandedIconTrailing: "agora-line-plus-circle",
            expandedIconHoverTrailing: "agora-solid-plus-circle",
          }}
        >
          <div className="mt-16">
            {entries.length > 10 && (
              <div className="mb-4 mt-8 relative">
                <InputSearch
                  label="Pesquisar badge"
                  hideLabel
                  placeholder="Pesquisar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Icon
                  name="agora-solid-search"
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-primary-500 w-20 h-20 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            )}
            <div className="flex flex-col gap-8 mt-16 pb-16">
              {filteredEntries.map((entry) => (
                <button
                  key={entry.kind}
                  type="button"
                  onClick={() => handleBadgeClick(entry.kind)}
                  className={`flex items-center justify-between w-full px-12 py-8 rounded-8 text-sm transition-colors cursor-pointer ${
                    activeBadge === entry.kind
                      ? "bg-primary-100 text-primary-700 font-bold"
                      : "text-neutral-900 font-bold hover:bg-neutral-100"
                  }`}
                >
                  <span>{entry.label}</span>
                  <Pill
                    variant="neutral"
                    appearance="outline"
                    circular={false}
                    className="text-xs font-medium text-neutral-500 ml-8"
                  >
                    {entry.count.toLocaleString("pt-PT")}
                  </Pill>
                </button>
              ))}
              {filteredEntries.length === 0 && (
                <span className="text-sm text-neutral-500">Nenhum badge encontrado.</span>
              )}
            </div>
          </div>
        </SidebarItem>
      </Sidebar>
    </div>
  );
};
