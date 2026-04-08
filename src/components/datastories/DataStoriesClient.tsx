'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CardLinks, InputSearch, ToggleGroup, Toggle } from '@ama-pt/agora-design-system';
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
    slug: 'territorios-inteligentes/pressao-turistica-em-portugal',
    title: 'Territórios Inteligentes: Pressão turística em Portugal',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    organization: { name: 'Territórios Inteligentes' },
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
  const [searchQuery, setSearchQuery] = React.useState('');


  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 datastories">
      <main className="flex-grow bg-white">
        <PageBanner
          title="Data Stories"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          breadcrumbItems={[
            { label: 'Home', url: '/' },
            { label: 'Data Stories', url: '/pages/datastories' }
          ]}
          subtitle={
            <p className="text-primary-100 max-w-[592px]">
              Pesquise através de {total} data stories em dados.gov.pt
            </p>
          }
        />

        {/* Search Section */}
        <div className="container mx-auto pt-32 pb-16 px-4">
          <div className="max-w-[592px]">
            <InputSearch
              label="Pesquisar"
              placeholder="Pesquisar data stories, temas..."
              id="datastories-search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            <div className="mt-8 text-s-regular text-neutral-900">
              Exemplos: &quot;serviços públicos&quot;, &quot;turismo&quot;, &quot;territórios&quot;
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
          {/* Results count + Sort — full width, aligned with grid */}
          <div className="grid md:grid-cols-3 xl:grid-cols-12 grid-filters gap-x-[32px]">
            <div className="xl:col-span-5 flex flex-row items-end gap-24 pl-0 py-16">
              <span className="text-neutral-900 text-l-regular whitespace-nowrap">
                {total} Resultados
              </span>
            </div>
            <div className="xl:col-span-7 flex items-center justify-end py-16">
              <ToggleGroup
                multiple={false}
                value="recentes"
                onChange={() => {}}
              >
                <Toggle value="recentes">Mais recentes</Toggle>
                <Toggle value="visualizados">Mais visualizados</Toggle>
              </ToggleGroup>
            </div>
          </div>
          <div className="divider-neutral-200 mb-24" />

          <div>
            <div className="col-span-full">
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
                          leadingIcon: 'agora-line-layers-menu',
                          leadingIconHover: 'agora-solid-layers-menu',
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
              <div className="pb-64 mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalItems={total}
                  pageSize={pageSize}
                  baseUrl="/pages/datastories"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
