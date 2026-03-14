'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, SidebarItem, Checkbox, InputSearch, Icon } from '@ama-pt/agora-design-system';
import { OrgBadges, SiteMetrics } from '@/types/api';
import { CategoryToggles } from '@/components/CategoryToggles';

interface OrganizationsFiltersProps {
  siteMetrics: SiteMetrics;
  orgBadges: OrgBadges;
}

export const OrganizationsFilters = ({ siteMetrics, orgBadges }: OrganizationsFiltersProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const activeBadge = params.get('badge') || '';

  const entries = Object.entries(orgBadges);

  const filteredEntries = searchQuery.trim()
    ? entries.filter(([, label]) =>
        label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  const handleBadgeChange = (kind: string, checked: boolean) => {
    const newParams = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : ''
    );
    if (checked) {
      newParams.set('badge', kind);
    } else {
      newParams.delete('badge');
    }
    newParams.set('page', '1');
    const qs = newParams.toString();
    router.replace(`/pages/organizations${qs ? `?${qs}` : ''}`, { scroll: false });
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
            children: <span className="font-bold">Organização</span>,
            hasIcon: true,
            collapsedIconTrailing: 'agora-line-minus-circle',
            collapsedIconHoverTrailing: 'agora-solid-minus-circle',
            expandedIconTrailing: 'agora-line-plus-circle',
            expandedIconHoverTrailing: 'agora-solid-plus-circle'
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
            <div className="flex flex-col gap-12 mt-16 pb-16">
              {filteredEntries.map(([kind, label]) => (
                <Checkbox
                  key={kind}
                  value={kind}
                  checked={activeBadge === kind}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleBadgeChange(kind, e.target.checked)
                  }
                  className="font-bold"
                >
                  {label}
                </Checkbox>
              ))}
              {filteredEntries.length === 0 && (
                <span className="text-sm text-neutral-500">
                  Nenhum badge encontrado.
                </span>
              )}
            </div>
          </div>
        </SidebarItem>
      </Sidebar>
    </div>
  );
};
