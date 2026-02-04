'use client';

import React from 'react';
import { Sidebar, SidebarItem } from '@ama-pt/agora-design-system';

export const DatasetsFilters = () => {
  const filterGroups = [
    'Organização',
    'Tipo de organização',
    'Palavras-chave',
    'Formatos',
    'Licenças',
    'Plano',
    'Cobertura espacial',
    'Granularidade espacial',
    'Rótulo de dados',
  ];

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="font-bold text-xl text-neutral-900">Filtros</h2>
      </div>

      <Sidebar variant="filter">
        {filterGroups.map((group, index) => (
          <SidebarItem
            key={index}
            variant="filter"
            item={{
              children: group,
              onClick: () => console.log('Toggle group', group),
              collapsedIconTrailing: 'agora-line-plus-circle',
              expandedIconTrailing: 'agora-line-minus-circle',
              appearance: 'text',
              className: '!justify-between !w-full !text-left !px-0', // Force left align and spread icon
            }}
          >
            <div className="p-4 text-sm text-neutral-600 bg-white border-t border-neutral-100">
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary-600" />
                <span>Opção 1</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary-600" />
                <span>Opção 2</span>
              </label>
            </div>
          </SidebarItem>
        ))}
      </Sidebar>
    </div>
  );
};
