'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CardLinks, InputSearchBar, Button, InputSelect, DropdownSection, DropdownOption, } from '@ama-pt/agora-design-system';
import PageBanner from '@/components/PageBanner';
import { Pagination } from '@/components/Pagination';

// Dummy data for Data Stories
const dummyDataStories = [
  {
    id: '1',
    slug: 'servicos-publicos/o-canal-presencial',
    title: 'Serviços Públicos: o canal presencial',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    organization: { name: 'Serviços Públicos' },
    image: '/laptop.png',
    created_at: '2024-03-11T12:00:00Z',
    metrics: { views: 1250, reuses: 45, followers: 12 },
    datasets: [1, 2, 3]
  },
  {
    id: '2',
    slug: 'datastory-2',
    title: 'Consectetur adipiscing elit',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    organization: { name: 'Ministério da Educação' },
    image: '/laptop.png',
    created_at: '2024-03-10T12:00:00Z',
    metrics: { views: 890, reuses: 23, followers: 8 },
    datasets: [1, 2]
  }
];

interface DataStoriesClientProps {
  currentPage: number;
}

export default function DataStoriesClient({ currentPage }: DataStoriesClientProps) {
  const router = useRouter();
  const total = 48; // Dummy total to show pagination
  const pageSize = 12;

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 datastories ">
      <main className="flex-grow bg-white">
        <PageBanner
          title="Data Stories"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'Data Stories', url: '/pages/datastories' }
          ]}
        >
          <InputSearchBar
            label="O que procura nas data stories?"
            placeholder="Pesquisar data stories, temas..."
            id="datastories-search"
            hasVoiceActionButton={false}
            voiceActionAltText="Pesquisar por voz"
            searchActionAltText="Pesquisar"
            darkMode={true}
          />

          <div className="mt-[32px] text-white">
            <span>Conteúdo atualizado a 11.3.2024</span>
          </div>
        </PageBanner>

        <div className="container mx-auto md:gap-32 xl:gap-64">
          <div className="pt-32 pb-64">
            <div className="grid md:grid-cols-2 xl:grid-cols-12 gap-32 mb-16 items-center mt-[12px]">
              <span className="text-neutral-900 font-medium text-base xl:col-span-7 mt-[32px]">
                {total} Resultados
              </span>
              <div className="w-full md:w-auto xl:col-span-5 flex items-end gap-16 justify-end">
                <Button
                  variant="primary"
                  appearance="link"
                  hasIcon={true}
                  trailingIcon="agora-line-settings"
                  trailingIconHover="agora-solid-settings"
                >
                  Filtrar
                </Button>
                <div className="flex-grow max-w-[240px]">
                  <InputSelect
                    label="Ordenar por :"
                    id="sort-datastories"
                    defaultValue="recentes"
                    className="selectReuse"
                  >
                    <DropdownSection name="order">
                      <DropdownOption value="recentes">Mais recentes</DropdownOption>
                      <DropdownOption value="visualizados">Mais visualizados</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                </div>
              </div>
            </div>

            <div className="divider-neutral-200 mt-[14px] mb-24" />

            <div className="grid grid-cols-2 agora-card-links-datasets-px0 gap-32">
              {dummyDataStories.map((story) => (
                <div key={story.id} className="h-full">
                  <CardLinks
                    onClick={() => router.push(`/pages/datastories/${story.slug}`)}
                    className="cursor-pointer text-neutral-900"
                    variant="transparent"
                    image={{
                      src: story.image,
                      alt: story.title,
                    }}
                    category={story.organization.name}
                    title={<div className="underline text-xl-bold">{story.title}</div>}
                    description={
                      <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                        {story.description}
                      </p>
                    }
                    date={
                      <span className="font-[300]">
                        Publicado em 11 de março de 2024
                      </span>
                    }
                    links={[
                      {
                        href: '#',
                        hasIcon: true,
                        leadingIcon: 'agora-line-eye',
                        leadingIconHover: 'agora-solid-eye',
                        trailingIcon: '',
                        trailingIconHover: '',
                        children: story.metrics.views.toLocaleString('pt-PT'),
                        title: 'Visualizações',
                        onClick: (e: React.MouseEvent) => e.preventDefault(),
                        className: 'text-[#034AD8]',
                      },
                      {
                        href: '#',
                        hasIcon: true,
                        leadingIcon: 'agora-line-calendar',
                        leadingIconHover: 'agora-solid-calendar',
                        trailingIcon: '',
                        trailingIconHover: '',
                        children: `${story.datasets.length}`,
                        title: 'Datasets',
                        onClick: (e: React.MouseEvent) => e.preventDefault(),
                        className: 'text-[#034AD8]',
                      },
                      {
                        href: '#',
                        hasIcon: true,
                        leadingIcon: 'agora-line-star',
                        leadingIconHover: 'agora-solid-star',
                        trailingIcon: '',
                        trailingIconHover: '',
                        children: story.metrics.followers,
                        title: 'Favoritos',
                        onClick: (e: React.MouseEvent) => e.preventDefault(),
                        className: 'text-[#034AD8]',
                      },
                    ]}
                    mainLink={
                      <Link href={`/pages/datastories/${story.slug}`}>
                        <span className="underline">{story.title}</span>
                      </Link>
                    }
                    blockedLink={true}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-64 flex justify-center pb-12">
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                pageSize={pageSize}
                baseUrl="/pages/datastories"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
