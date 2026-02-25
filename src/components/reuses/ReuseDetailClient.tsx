'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb, Button, Icon, Tag, Pill, Tabs, Tab, TabHeader, TabBody, CardGeneral } from '@ama-pt/agora-design-system';
import { Reuse, Dataset } from '@/types/api';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ReuseDetailClientProps {
  reuse: Reuse;
}

export default function ReuseDetailClient({ reuse }: ReuseDetailClientProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: pt });
    } catch (e) {
      return dateString;
    }
  };

  const renderTabBody = (content: React.ReactNode) => (
    <TabBody>
      <div className="relative">
        <div
          className="absolute inset-y-0 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-32 xl:-mx-64 bg-neutral-50 z-0"
          aria-hidden="true"
        />
        <div className="relative z-10 py-32 sm:py-64">
          <div className="container mx-auto">
            {content}
          </div>
        </div>
      </div>
    </TabBody>
  );

  return (
    <div className="flex flex-col font-sans text-neutral-900 bg-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-white text-neutral-900 pt-24 pb-48 sm:pb-64">
        <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
          {/* Breadcrumbs & Actions */}
          <div className="flex justify-between items-center gap-16 mb-32">
            <Breadcrumb
              darkMode={false}
              items={[
                { label: 'Bem-vindo', url: '/' },
                { label: 'Reutilizações', url: '/pages/reuses' },
                { label: reuse.title, url: `/pages/reuses/${reuse.slug || reuse.id}` }
              ]}
            />
            <div className="flex flex-wrap items-center gap-32 sm:gap-16">
              <Button
                variant="primary"
                appearance="outline"
                darkMode={false}
                hasIcon={true}
                leadingIcon="agora-line-star"
                leadingIconHover="agora-solid-star"
              >
                Adicionar aos favoritos
              </Button>
              <Button
                variant="primary"
                hasIcon={true}
                trailingIcon="agora-line-external-link"
                onClick={() => window.open(reuse.url, '_blank')}
              >
                Veja reutilização
              </Button>
              <Button
                variant="primary"
                appearance="outline"
                darkMode={false}
                hasIcon={true}
                leadingIcon="agora-line-flag"
                aria-label="Reportar"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32">
            {/* Image Column */}
            <div className="xl:col-span-8 xl:block md:pt-64">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200">
                <img
                  src={reuse.image || '/laptop.png'}
                  alt={reuse.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Sidebar Card Column */}
            <div className="xl:col-span-4 md:pt-64 ">
              <div className="h-full bg-white text-neutral-900 rounded-lg p-32 flex flex-col gap-24 border border-neutral-200 shadow-sm">
                {reuse.organization?.logo ? (
                  <div className="w-fit px-12 py-6 bg-primary-50 rounded-8 border border-primary-200 flex items-center justify-center">
                    <img
                      src={reuse.organization.logo}
                      alt={reuse.organization.name}
                      className="h-24 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-120 h-40 bg-neutral-100 rounded-8 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                    LOGOIPSUM
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-8">
                    Tempo
                  </div>
                  <h1 className="text-2xl-bold leading-tight mb-16">
                    {reuse.title}
                  </h1>
                  <div className="flex items-center flex-wrap gap-16 text-sm">
                    <span className="font-medium">{reuse.type || 'Aplicação'}</span>
                    <div className="flex items-center gap-4 text-neutral-500">
                      <Icon name="agora-line-eye" className="w-16 h-16" />
                      <span>{reuse.metrics?.views ? (reuse.metrics.views >= 1000 ? (reuse.metrics.views / 1000).toFixed(0) + ' mil' : reuse.metrics.views) : '0'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-neutral-500">
                      <Icon name="agora-line-chart-bar" className="w-16 h-16" />
                      <span>217</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <a
                    href={reuse.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-700 font-bold hover:underline inline-flex items-center gap-8"
                  >
                    Veja reutilização
                    <Icon name="agora-line-external-link" className="w-16 h-16" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
          <Tabs>
            <Tab>
              <TabHeader>Descrição</TabHeader>
              {renderTabBody(
                <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32">
                  {/* Sidebar Metadata */}
                  <aside className="xl:col-span-8 xl:block md:pt-64 flex flex-col gap-24">
                    <div className="bg-white p-24 rounded-lg border border-neutral-200">
                      <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Temático</h3>
                      <p className="font-medium text-neutral-900">Política e vida pública</p>
                    </div>

                    <div className="bg-white p-24 rounded-lg border border-neutral-200">
                      <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Tipo</h3>
                      <p className="font-medium text-neutral-900">{reuse.type || 'Aplicação'}</p>
                    </div>

                    <div className="bg-white p-24 rounded-lg border border-neutral-200">
                      <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Tags</h3>
                      <div className="flex flex-wrap gap-8">
                        {(reuse.tags || ['mapeamento', 'dataconnexions-6', 'eleição', 'noivado', 'demonstração de impacto', 'percorrer']).map(tag => (
                          <Pill key={tag} appearance="solid" variant="primary" className="bg-primary-100 text-primary-700 h-auto py-4 px-8 text-xs font-semibold">
                            {tag}
                          </Pill>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-24 rounded-lg border border-neutral-200">
                      <div className="mb-24">
                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Última atualização</h3>
                        <p className="font-medium text-neutral-900">{formatDate(reuse.last_modified)}</p>
                      </div>
                      <div className="mb-0">
                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Data de criação</h3>
                        <p className="font-medium text-neutral-900">{formatDate(reuse.created_at)}</p>
                      </div>
                    </div>

                    <div className="bg-white p-24 rounded-lg border border-neutral-200">
                      <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-8">Vistas</h3>
                      <div className="text-2xl font-bold text-neutral-900 mb-8">
                        {reuse.metrics?.views ? (reuse.metrics.views / 1000).toLocaleString('pt-PT') + ' mil' : '1,68 mil'}
                      </div>
                      <Pill variant="success" appearance="outline" className="mb-8 h-auto">+31,25mil em janeiro de 2026</Pill>
                      <div className="text-xs text-neutral-400">desde julho de 2022</div>
                    </div>
                  </aside>

                  {/* Main Content */}
                  <div className="xl:col-span-4 md:pt-64 ">
                    <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
                      <h2 className="text-2xl-bold text-neutral-900 mb-24">Descrição</h2>
                      <div className="whitespace-pre-wrap mb-32">
                        {reuse.description}
                      </div>

                      {/* Featured image in content */}
                      <div className="my-32 rounded-lg overflow-hidden border border-neutral-200">
                        <img
                          src="/womanlibrary.png"
                          alt="Conteúdo da reutilização"
                          className="w-full h-auto"
                        />
                      </div>

                      <p>
                        2015 marca o início de um período de alta densidade eleitoral ( em média, 1 eleição a cada 8 meses até 2017 ).
                      </p>
                      <p className="font-bold">
                        O sete panneaux-election.fr destina-se a ativistas políticos e cidadãos responsáveis pela afixação de cartazes eleitorais para seus candidatos em locais oficiais.
                      </p>
                      <p>
                        Os cartazes eleitorais, uma operação logística essencial durante uma campanha política, representam um investimento significativo de tempo e recursos para os ativistas. Com o panneaux-election.fr , os ativistas economizam recursos e seu trabalho é simplificado ; eles podem, assim, se concentrar no que mais importa: seu engajamento e a defesa de suas ideias.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Tab>
            <Tab>
              <TabHeader>Discussões (1)</TabHeader>
              {renderTabBody(
                <div className="text-neutral-500 italic">Nenhuma discussão iniciada ainda.</div>
              )}
            </Tab>
          </Tabs>
        </div>
      </section>

      {/* Bottom Sections */}
      <section className="bg-neutral-50 py-64">
        <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
          {/* Associated Datasets */}
          <div className="mb-80">
            <h2 className="text-xl font-bold text-[#000032] mb-32">
              5 conjuntos de dados associados
            </h2>
            <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32">
              <div className="xl:col-span-8 xl:col-start-5 flex flex-col pt-0">
                {[
                  {
                    org: 'Agência Portuguesa do Ambiente',
                    updated: 'Actualizado há 3 dias',
                    title: 'Qualidade da Água',
                    desc: 'Relatório sobre a qualidade da água em rios e lagos, com dados de vários pontos de monitorização.',
                    meta: 'Metadados 50%',
                    views: '2 M',
                    downloads: '150 mil',
                    chart: '180',
                    stars: '412',
                  },
                  {
                    org: 'Instituto de Conservação da Natureza',
                    updated: 'Actualizado há 1 mês',
                    title: 'Biodiversidade em Portugal',
                    desc: 'Dados sobre espécies em perigo e áreas protegidas no território nacional.',
                    meta: 'Metadados 55%',
                    views: '3.5 M',
                    downloads: '400 mil',
                    chart: '220',
                    stars: '350',
                  },
                  {
                    org: 'Instituto Nacional de Estatística',
                    updated: 'Actualizado há 5 dias',
                    title: 'Censo Populacional',
                    desc: 'Dados detalhados sobre a população, incluindo idade, género e localização geográfica.',
                    meta: 'Metadados 40%',
                    views: '4 M',
                    downloads: '600 mil',
                    chart: '250',
                    stars: '512',
                  },
                  {
                    org: 'Direção-Geral de Energia e Geologia',
                    updated: 'Actualizado há 2 semanas',
                    title: 'Análise do Setor Energético',
                    desc: 'Relato sobre a evolução do consumo e produção de energia em Portugal.',
                    meta: 'Metadados 60%',
                    views: '6 M',
                    downloads: '800 mil',
                    chart: '300',
                    stars: '250',
                  },
                  {
                    org: 'Banco de Portugal',
                    updated: 'Actualizado há 15 dias',
                    title: 'Relatório Económico Trimestral',
                    desc: 'Análise das principais variáveis económicas, incluindo PIB e inflação, com dados comparativos.',
                    meta: 'Metadados 30%',
                    views: '6 M',
                    downloads: '1 M',
                    chart: '350',
                    stars: '600',
                  }
                ].map((dataset, i) => (
                  <div key={i} className={`pb-32 ${i !== 0 ? 'border-t border-[#E1E4EA] pt-32' : ''}`}>
                    <div className="dataset-reuse-card-wrapper h-full [&>div]:h-full [&>div]:min-h-[260px]">
                      <CardGeneral
                        isCardHorizontal={true}
                        variant="white"
                        image={{
                          src: '/Logos/logo-ipsum.svg',
                          alt: `Logo - ${dataset.org}`,
                        }}
                        subtitleText={''}
                        titleText={(
                          <div className="flex flex-col gap-12 font-sans mb-16">
                            <div className="flex flex-col gap-8 text-sm text-neutral-600">
                              <span>{dataset.org}</span>
                              <span>{dataset.updated}</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#000032] border-b-[3px] border-[#000032] inline-block w-fit pb-2">
                              {dataset.title}
                            </h3>
                          </div>
                        ) as unknown as string}
                        descriptionText={(
                          <div className="flex flex-col gap-16 h-full justify-between">
                            <div>
                              <p className="text-[15px] text-neutral-800 leading-relaxed max-w-2xl line-clamp-2 min-h-[48px]">
                                {dataset.desc}
                              </p>
                              <span className="text-[15px] text-neutral-800 block mt-8">{dataset.meta}</span>
                            </div>
                            <div className="flex items-center gap-24 mt-8 text-[15px] font-medium text-primary-600">
                              <div className="flex items-center gap-8">
                                <Icon name="agora-line-eye" className="w-[18px] h-[18px]" />
                                {dataset.views}
                              </div>
                              <div className="flex items-center gap-8">
                                <Icon name="agora-line-calendar-days" className="w-[18px] h-[18px]" />
                                {dataset.downloads}
                              </div>
                              <div className="flex items-center gap-8">
                                <Icon name="agora-line-chart-bar" className="w-[18px] h-[18px]" />
                                {dataset.chart}
                              </div>
                              <div className="flex items-center gap-8">
                                <Icon name="agora-line-star" className="w-[18px] h-[18px]" />
                                {dataset.stars}
                              </div>
                            </div>
                          </div>
                        ) as unknown as string}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      </section >
    </div >
  );
}
