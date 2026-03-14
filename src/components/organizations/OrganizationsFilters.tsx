'use client';

import React from 'react';
import { Sidebar, SidebarItem, Checkbox, InputSearch, Icon } from '@ama-pt/agora-design-system';
import { Organization, SiteMetrics } from '@/types/api';
import { CategoryToggles } from '@/components/CategoryToggles';

interface OrganizationsFiltersProps {
  siteMetrics: SiteMetrics;
  organizations: Organization[];
}

export const OrganizationsFilters = ({ siteMetrics, organizations }: OrganizationsFiltersProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredOrgs = searchQuery.trim()
    ? organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : organizations;

  return (
    <div className="h-full organizations-filters">
      <CategoryToggles siteMetrics={siteMetrics} />

      <h2 className="font-bold text-xl text-neutral-900 mt-64 mb-32">Filtros</h2>

      <Sidebar variant="filter" className="font-bold">
        <SidebarItem
          variant="filter"
          open={true}
          item={{
            children: <span className="font-bold">Organização</span>,
            hasIcon: true,
            collapsedIconTrailing: 'agora-line-minus-circle',
            collapsedIconHoverTrailing: 'agora-solid-minus-circle',
            expandedIconTrailing: 'agora-line-plus-circle',
            expandedIconHoverTrailing: 'agora-solid-plus-circle'
          }}
        >
          <div className="mt-16">
            {organizations.length > 10 && (
              <div className="mb-4 mt-8 relative">
                <InputSearch
                  label="Pesquisar organização"
                  hideLabel
                  placeholder="Pesquisar organização"
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
            <div className="flex flex-col gap-12 mt-16 pb-16 max-h-[400px] overflow-y-auto">
              {filteredOrgs.map((org) => (
                <Checkbox
                  key={org.id}
                  label={org.name}
                  value={org.id}
                  className="font-bold"
                />
              ))}
              {filteredOrgs.length === 0 && (
                <span className="text-sm text-neutral-500">
                  Nenhuma organização encontrada.
                </span>
              )}
            </div>
          </div>
        </SidebarItem>
      </Sidebar>
    </div>
  );
};
