'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Sidebar, SidebarItem, CheckboxGroup, Checkbox } from '@ama-pt/agora-design-system';
import { fetchOrganizations } from '@/services/api';
import { Organization } from '@/types/api';

export const DatasetsFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadOrganizations() {
      try {
        const response = await fetchOrganizations(1, 100);
        setOrganizations(response.data);
      } catch (error) {
        console.error('Failed to load organizations for filters', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrganizations();
  }, []);

  const handleOrganizationChange = (orgId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const currentOrg = current.get('org_id');

    if (currentOrg === orgId) {
      current.delete('org_id');
    } else {
      current.set('org_id', orgId);
    }

    // Reset page to 1 on filter change
    current.set('page', '1');

    const search = current.toString();
    const query = search ? `?${search}` : '';

    // Force full page reload to ensure filters are applied correctly bypassing any router cache issues
    window.location.href = `${pathname}${query}`;
  };

  const filterGroups = [
    { name: 'Organização', type: 'dynamic', data: organizations },
    { name: 'Tipo de organização', type: 'static' },
    { name: 'Palavras-chave', type: 'static' },
    { name: 'Formatos', type: 'static' },
    { name: 'Licenças', type: 'static' },
    { name: 'Plano', type: 'static' },
    { name: 'Cobertura espacial', type: 'static' },
    { name: 'Granularidade espacial', type: 'static' },
    { name: 'Rótulo de dados', type: 'static' },
  ];

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="font-bold text-xl text-neutral-900 pb-64">Filtros</h2>
      </div>

      <Sidebar variant="filter">
        {filterGroups.map((group, index) => (
          <SidebarItem
            key={index}
            variant="filter"
            item={{
              children: group.name,
              hasIcon: true,
              collapsedIconLeading: 'agora-line-minus-circle',
              collapsedIconHoverLeading: 'agora-solid-minus-circle',
              expandedIconLeading: 'agora-line-plus-circle',
              expandedIconHoverLeading: 'agora-solid-plus-circle'
            }}
          >
            <div className="px-6 py-4 bg-white border-t border-neutral-100 max-h-60 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {group.name === 'Organização' ? (
                  isLoading ? (
                    <p className="text-sm text-neutral-500">A carregar...</p>
                  ) : (
                    organizations.map((org) => (
                      <Checkbox
                        key={org.id}
                        label={org.name}
                        value={org.id}
                        name="org_id"
                        checked={searchParams.get('org_id') === org.id}
                        onChange={() => handleOrganizationChange(org.id)}
                      />
                    ))
                  )
                ) : (
                  <>
                    <Checkbox label="Opção 1" value="opt1" />
                    <Checkbox label="Opção 2" value="opt2" />
                  </>
                )}
              </div>
            </div>
          </SidebarItem>
        ))}
      </Sidebar>
    </div>
  );
};
