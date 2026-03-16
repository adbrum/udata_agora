'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Toggle, Pill } from '@ama-pt/agora-design-system';
import { SiteMetrics } from '@/types/api';

interface CategoryToggleItem {
  id: string;
  label: string;
  href: string;
  count: number;
  leadingIcon: string | ((active: boolean) => string);
  leadingIconHover: string;
  className?: string;
}

interface CategoryTogglesProps {
  siteMetrics: SiteMetrics;
}

const buildItems = (siteMetrics: SiteMetrics): CategoryToggleItem[] => [
  {
    id: 'datasets',
    label: 'Conjunto de dados',
    href: '/pages/datasets',
    count: siteMetrics.datasets,
    leadingIcon: 'agora-line-layers-menu',
    leadingIconHover: 'agora-solid-layers-menu',
    className: 'w-full',
  },
  {
    id: 'apis',
    label: 'APIs',
    href: '/pages/dataservices',
    count: siteMetrics.dataservices ?? 0,
    leadingIcon: (active: boolean) =>
      active ? '/Icons/reduce_white.svg' : '/Icons/reduce.svg',
    leadingIconHover: '/Icons/reduce_white.svg',
    className: 'w-full agora-toggle agora-toggle-icon agora-toggle-icon-primary full-width has-icon',
  },
  {
    id: 'reutilizacoes',
    label: 'Reutilizações',
    href: '/pages/reuses',
    count: siteMetrics.reuses,
    leadingIcon: (active: boolean) =>
      active ? '/Icons/bar_char_white.svg' : '/Icons/bar_chart.svg',
    leadingIconHover: '/Icons/bar_char_white.svg',
    className: 'w-full agora-toggle agora-toggle-icon agora-toggle-icon-primary full-width has-icon',
  },
  {
    id: 'organizacoes',
    label: 'Organizações',
    href: '/pages/organizations',
    count: siteMetrics.organizations,
    leadingIcon: 'agora-line-buildings',
    leadingIconHover: 'agora-solid-buildings',
    className: 'w-full',
  },
];

const HREF_TO_ID: Record<string, string> = {
  '/pages/reuses': 'reutilizacoes',
  '/pages/datasets': 'datasets',
  '/pages/dataservices': 'apis',
  '/pages/organizations': 'organizacoes',
};

export const CategoryToggles = ({ siteMetrics }: CategoryTogglesProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const items = buildItems(siteMetrics);

  const activeId = HREF_TO_ID[pathname] || '';

  return (
    <div className="mb-64 pr-32 max-w-[592px] flex flex-col gap-16 mt-[32px]">
      <h2 className="font-bold text-xl text-neutral-900 mb-16">Tipo</h2>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const icon =
          typeof item.leadingIcon === 'function'
            ? item.leadingIcon(isActive)
            : item.leadingIcon;

        return (
          <Toggle
            key={item.id}
            id={item.id}
            name="category-toggle"
            value={item.id}
            appearance="icon"
            variant="primary"
            hasIcon
            leadingIcon={icon}
            leadingIconHover={item.leadingIconHover}
            checked={isActive}
            onChange={() => {
              router.push(item.href);
            }}
            iconOnly={false}
            fullWidth={true}
            className={item.className}
          >
            <div className="flex items-center gap-12 font-bold text-sm">
              <span
                className={
                  isActive
                    ? 'text-primary-600 font-bold'
                    : 'text-neutral-900 font-bold'
                }
              >
                {item.label}
              </span>
              <Pill
                variant="neutral"
                appearance="outline"
                circular={false}
                className="text-xs font-medium text-neutral-500 ml-16"
              >
                {item.count.toLocaleString('pt-PT')}
              </Pill>
            </div>
          </Toggle>
        );
      })}
    </div>
  );
};
