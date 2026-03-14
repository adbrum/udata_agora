'use client';

import React from 'react';
import { Sidebar, SidebarItem, Checkbox, InputSearch, Icon } from '@ama-pt/agora-design-system';
import { SiteMetrics } from '@/types/api';
import { CategoryToggles } from '@/components/CategoryToggles';

interface OrganizationsFiltersProps {
  siteMetrics: SiteMetrics;
}

export const OrganizationsFilters = ({ siteMetrics }: OrganizationsFiltersProps) => {
  const [searchQueries, setSearchQueries] = React.useState<Record<string, string>>({});

  const handleSearchChange = (groupName: string, value: string) => {
    setSearchQueries((prev) => ({
      ...prev,
      [groupName]: value,
    }));
  };

  const filterGroups = [
    { name: 'Organização', type: 'static' }
  ];

  return (
    <div className="h-full organizations-filters">
      <CategoryToggles siteMetrics={siteMetrics} />

      <h2 className="font-bold text-xl text-neutral-900 mt-64 mb-32">Filtros</h2>

      <Sidebar variant="filter" className="font-bold">
        {filterGroups.map((group, index) => {
          return (
            <SidebarItem
              key={index}
              variant="filter"
              item={{
                children: <span className="font-bold">{group.name}</span>,
                hasIcon: true,
                collapsedIconTrailing: 'agora-line-minus-circle',
                collapsedIconHoverTrailing: 'agora-solid-minus-circle',
                expandedIconTrailing: 'agora-line-plus-circle',
                expandedIconHoverTrailing: 'agora-solid-plus-circle'
              }}
            >
              <div className="mt-16">
                <div className="mb-4 mt-8 relative">
                  <InputSearch
                    label="Pesquisar"
                    hideLabel
                    placeholder="Pesquisar"
                    value={searchQueries[group.name] || ''}
                    onChange={(e) => handleSearchChange(group.name, e.target.value)}
                  />
                  <Icon
                    name="agora-solid-search"
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-primary-500 w-20 h-20 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-12 mt-16 pb-16">
                  <Checkbox label="Opção 1" value="opt1" className="font-bold" />
                  <Checkbox label="Opção 2" value="opt2" className="font-bold" />
                </div>
              </div>
            </SidebarItem>
          );
        })}
      </Sidebar>
    </div>
  );
};
