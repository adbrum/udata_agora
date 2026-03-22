'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Breadcrumb,
  Button,
  Icon,
  Pill,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
  CardArticle,
  CardLinks,
  CardNoResults,
  SearchPagination,
  StatusCard,
  InputSearchBar,
  InputText,
  InputTextArea,
} from '@ama-pt/agora-design-system';
import { Reuse, Dataset, Discussion } from '@/types/api';
import { fetchDataset, fetchReuse, fetchDiscussions } from '@/services/api';

import { format, formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ReuseDetailClientProps {
  slug: string;
}

export default function ReuseDetailClient({ slug }: ReuseDetailClientProps) {
  const router = useRouter();
  const [reuse, setReuse] = useState<Reuse | null>(null);
  const [isLoadingReuse, setIsLoadingReuse] = useState(true);
  const [fullDatasets, setFullDatasets] = useState<Dataset[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discussionCount, setDiscussionCount] = useState(0);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscTitle, setNewDiscTitle] = useState('');
  const [newDiscMessage, setNewDiscMessage] = useState('');

  useEffect(() => {
    async function loadReuse() {
      try {
        const data = await fetchReuse(slug);
        setReuse(data);
      } catch (error) {
        console.error("Error loading reuse:", error);
      } finally {
        setIsLoadingReuse(false);
      }
    }
    loadReuse();
  }, [slug]);
  const [datasetsPage, setDatasetsPage] = useState(1);
  const datasetsPageSize = 6;

  const datasetRefs = reuse?.datasets || [];

  useEffect(() => {
    if (!reuse || datasetRefs.length === 0) {
      setIsLoadingDatasets(false);
      return;
    }

    async function loadDatasets() {
      try {
        const slugs = datasetRefs.map((d) =>
          d.uri.split('/').filter(Boolean).pop() || d.id
        );
        const results = await Promise.all(
          slugs.map((s) => fetchDataset(s).catch(() => null))
        );
        setFullDatasets(results.filter((d): d is Dataset => d !== null));
      } catch {
        setFullDatasets([]);
      } finally {
        setIsLoadingDatasets(false);
      }
    }

    loadDatasets();
  }, [reuse]);

  useEffect(() => {
    if (!reuse) return;
    async function loadDiscussions() {
      try {
        const response = await fetchDiscussions(reuse!.id);
        setDiscussions(response.data || []);
        setDiscussionCount(response.total || 0);
      } catch (error) {
        console.error("Error loading discussions:", error);
      }
    }
    loadDiscussions();
  }, [reuse]);

  if (isLoadingReuse) {
    return <p className="text-neutral-900 text-base p-32">A carregar...</p>;
  }

  if (!reuse) {
    return <p className="text-neutral-900 text-base p-32">Reutilização não encontrada.</p>;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateString;
    }
  };

  const totalDatasetsPages = Math.ceil(fullDatasets.length / datasetsPageSize);
  const paginatedDatasets = fullDatasets.slice(
    (datasetsPage - 1) * datasetsPageSize,
    datasetsPage * datasetsPageSize
  );

  const renderDatasetsPagination = () => {
    if (totalDatasetsPages <= 1) return null;
    return (
      <div className="mt-32 flex justify-center">
        <SearchPagination
          totalPages={totalDatasetsPages}
          onChange={(page: number) => setDatasetsPage(page + 1)}
          label="Paginação"
          nextPageAriaLabel="Próxima página"
          previousPageAriaLabel="Página anterior"
          boundaryCount={1}
          siblingCount={1}
        />
      </div>
    );
  };

  const renderTabBody = (content: React.ReactNode) => (
    <TabBody>
      <div className="relative">
        <div
          className="absolute inset-y-0 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-32 xl:-mx-64 bg-neutral-50 z-0"
          aria-hidden="true"
        />
        <div className="relative z-10 ">
          <div className="container mx-auto">{content}</div>
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
          <div className="mb-24">
            <div className="mb-24">
              <Breadcrumb
                darkMode={false}
                items={[
                  { label: 'Home', url: '/' },
                  { label: 'Reutilizações', url: '/pages/reuses' },
                  {
                    label: reuse.title,
                    url: `/pages/reuses/${reuse.slug || reuse.id}`,
                  },
                ]}
              />
            </div>
            <div className="flex justify-end">
              <div className="flex flex-wrap items-center gap-16">
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
                  trailingIconHover="agora-line-external-link"
                  onClick={() => window.open(reuse.url, '_blank')}
                >
                  Veja reutilização
                </Button>
              </div>
            </div>
          </div>

          {/* Owner line */}
          {reuse.owner && (
            <p className="admin-edit-info__activity">
              <Icon name="agora-line-user" className="admin-edit-info__clock-icon" />
              {" Criado por: "}
              <Link
                href={`/pages/users/${reuse.owner.slug}`}
                className="text-primary-600 underline"
              >
                {reuse.owner.first_name} {reuse.owner.last_name}
              </Link>
            </p>
          )}

          {/* Hero Content */}
          <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32 mt-6 mb-24">
            {/* Image Column */}
            <div className="xl:col-span-8">
              <div className=" w-full">
                <img
                  src={reuse.image || '/laptop.png'}
                  alt={reuse.title}
                  className="w-full rounded-[4px]"
                  style={{ height: '308px', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Card Column */}
            <div className="xl:col-span-4 card-article-3_2">
              <CardArticle
                className="bg-[#F2F6FF]! border-none shadow-none [&_.container-body]:p-32 [&_.container-body]:flex [&_.container-body]:flex-col"
                title={reuse.title}
                subtitle={
                  <div className="flex flex-col gap-24 mb-16">
                    {reuse.organization?.logo ? (
                      <div className="w-fit h-[48px] card-article-3_2-img py-8 rounded-8 border-2 border-primary-300 flex items-center justify-center">
                        <img
                          src={reuse.organization.logo}
                          alt={reuse.organization.name}
                        />
                      </div>
                    ) : (
                      <div className="w-[160px] h-[56px] bg-white rounded-8 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                        {reuse.organization?.name || 'Sem organização'}
                      </div>
                    )}
                    {reuse.organization && (
                      <Link
                        href={`/pages/organizations/${reuse.organization.slug}`}
                        className="text-sm font-medium underline text-primary-600 hover:text-primary-800"
                      >
                        {reuse.organization.name}
                      </Link>
                    )}
                  </div>
                }
              >
                <div className="flex flex-col gap-24 h-full">
                  <div className="flex items-center flex-wrap gap-16 text-[15px]">
                    <span className="font-semibold text-neutral-900">
                      {reuse.type || 'Aplicação'}
                    </span>
                    <div className="flex items-center gap-8">
                      <Icon
                        name="agora-line-eye"
                        className="w-20 h-20 fill-[var(--color-neutral-900)]"
                      />
                      <span className="text-neutral-900">
                        {reuse.metrics?.views
                          ? reuse.metrics.views >= 1000
                            ? (reuse.metrics.views / 1000).toFixed(0) + ' mil'
                            : reuse.metrics.views
                          : '0'}
                      </span>
                    </div>
                    <div className="flex items-center gap-8">
                      <Icon
                        name="agora-line-calendar"
                        className="w-20 h-20 fill-[var(--color-neutral-900)]"
                      />
                      <span className="text-neutral-900">{datasetRefs.length}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-24">
                    <a
                      href={reuse.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#034AD8] text-lg hover:underline inline-flex items-center gap-8"
                    >
                      Veja reutilização
                      <Icon
                        name="agora-line-external-link"
                        className="w-24 h-24 fill-[#034AD8]"
                      />
                    </a>
                  </div>
                </div>
              </CardArticle>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
          <Tabs>
            <Tab>
              <TabHeader>Descrição</TabHeader>
              {renderTabBody(
                <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32 mt-6">
                  {/* Main Content */}
                  <div className="xl:col-span-8 max-w-ch">
                    <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
                      <h2 className="text-l-bold text-neutral-900 mb-32">Descrição</h2>
                      <div
                        className="mb-32 text-neutral-900 [&_a]:underline [&_a]:text-primary-600"
                        dangerouslySetInnerHTML={{ __html: reuse.description }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Metadata */}
                  <aside className="xl:col-span-4 xl:block md:pt-64 flex flex-col gap-16">
                    <div className="bg-white p-32 rounded-4">
                      <h3 className="text-sm font-bold tracking-wider mb-8">Tipo</h3>
                      <p className="font-medium text-neutral-900">
                        {reuse.type || 'Aplicação'}
                      </p>
                    </div>

                    {reuse.tags && reuse.tags.length > 0 && (
                      <div className="bg-white p-32 rounded-4">
                        <h3 className="text-sm font-bold tracking-wider mb-8">Tags</h3>
                        <div className="flex flex-col items-start gap-8">
                          {reuse.tags.map((tag) => (
                            <Pill
                              key={tag}
                              appearance="solid"
                              variant="primary"
                              className="bg-primary-100 text-primary-700 h-auto py-4 px-8 text-xs font-semibold"
                            >
                              {tag}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-white p-32 rounded-4">
                      <h3 className="text-sm font-bold tracking-wider mb-8">
                        Última atualização
                      </h3>
                      <p className="font-medium text-neutral-900">
                        {formatDate(reuse.last_modified)}
                      </p>
                    </div>

                    <div className="bg-white p-32 rounded-4">
                      <h3 className="text-sm font-bold tracking-wider mb-8">
                        Data de criação
                      </h3>
                      <p className="font-medium text-neutral-900">
                        {formatDate(reuse.created_at)}
                      </p>
                    </div>

                    <div className="bg-white p-32 rounded-4">
                      <h3 className="text-sm font-bold tracking-wider mb-8">Vistas</h3>
                      <div className="text-2xl text-neutral-900 mb-8">
                        {reuse.metrics?.views
                          ? reuse.metrics.views >= 1000
                            ? (reuse.metrics.views / 1000).toLocaleString('pt-PT') + ' mil'
                            : reuse.metrics.views.toLocaleString('pt-PT')
                          : '0'}
                      </div>
                    </div>
                  </aside>
                </div>
              )}
            </Tab>
            <Tab>
              <TabHeader>Discussões ({discussionCount})</TabHeader>
              {renderTabBody(
                <div>
                  <div className="mb-24">
                    <StatusCard
                      type="info"
                      description={
                        <>
                          Sua pergunta é sobre algo diferente de reutilização?{" "}
                          <a
                            href="https://dados.gov.pt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 underline font-semibold"
                          >
                            Visite nosso fórum. <Icon name="agora-line-external-link" className="w-4 h-4 inline" />
                          </a>
                        </>
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between mb-24">
                    <h3 className="font-medium text-neutral-900 text-base">
                      {discussionCount} {discussionCount === 1 ? "DISCUSSÃO" : "DISCUSSÕES"}
                    </h3>
                    <div className="flex items-center gap-24">
                      <InputSearchBar
                        hasVoiceActionButton={false}
                        placeholder="Pesquisar"
                        aria-label="Pesquisar discussões"
                      />
                      <Button
                        variant="primary"
                        appearance="outline"
                        hasIcon={true}
                        leadingIcon="agora-line-plus-circle"
                        leadingIconHover="agora-solid-plus-circle"
                        onClick={() => setShowNewDiscussion(!showNewDiscussion)}
                      >
                        Iniciar uma nova discussão
                      </Button>
                    </div>
                  </div>
                  {showNewDiscussion && (
                    <div className="bg-white rounded-8 p-32 mb-24">
                      <div className="flex justify-between items-center mb-16">
                        <h3 className="font-bold text-neutral-900 text-base">Nova discussão</h3>
                        <Button variant="primary" appearance="link" onClick={() => setShowNewDiscussion(false)}>
                          Fechar
                        </Button>
                      </div>
                      <p className="text-sm text-neutral-900 mb-16">
                        Os campos marcados com um asterisco (<span className="text-red-500">*</span>) são obrigatórios.
                      </p>
                      <div className="mb-24">
                        <InputText
                          label="Título *"
                          value={newDiscTitle}
                          onChange={(e) => setNewDiscTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-24">
                        <InputTextArea
                          label="A sua mensagem *"
                          value={newDiscMessage}
                          onChange={(e) => setNewDiscMessage(e.target.value)}
                          rows={4}
                          placeholder="Por favor, mantenha a cordialidade e uma postura construtiva. Evite partilhar informações pessoais."
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button variant="primary" appearance="solid">Enviar</Button>
                      </div>
                    </div>
                  )}
                  {discussionCount === 0 ? (
                    <CardNoResults
                      position="center"
                      icon={
                        <Icon name="agora-line-chat" className="w-[40px] h-[40px] text-primary-500 icon-xl" />
                      }
                      title="Ainda não há discussão."
                      description=""
                      hasAnchor={false}
                    />
                  ) : (
                    <div className="space-y-16">
                      {discussions.map((disc) => (
                        <div key={disc.id} className="bg-white rounded-8 p-32">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-neutral-900 text-base">{disc.title}</h4>
                              <p className="text-sm text-neutral-900 mt-4">
                                <span className="text-primary-600 font-medium">
                                  {disc.user.first_name} {disc.user.last_name}
                                </span>
                                {' — Publicado em '}
                                {format(new Date(disc.created), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                              </p>
                            </div>
                          </div>
                          {disc.discussion.length > 0 && (
                            <p className="text-neutral-900 text-sm mt-16">{disc.discussion[0].content}</p>
                          )}
                          {disc.discussion.length > 1 && (
                            <div className="mt-16 space-y-16 border-t border-neutral-200 pt-16">
                              {disc.discussion.slice(1).map((msg, idx) => (
                                <div key={idx} className="border-l-2 border-primary-600" style={{ paddingLeft: "24px" }}>
                                  <p className="text-sm text-neutral-900">
                                    <span className="text-primary-600 font-medium">
                                      {msg.posted_by.first_name} {msg.posted_by.last_name}
                                    </span>
                                    {' — '}
                                    {format(new Date(msg.posted_on), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                                  </p>
                                  <p className="text-neutral-900 text-sm mt-4">{msg.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex justify-end" style={{ marginTop: "32px" }}>
                            <Button variant="primary" appearance="outline">Responder</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </section>

      {/* Associated Datasets */}
      {datasetRefs.length > 0 && (
        <section className="bg-white py-64">
          <div className="container mx-auto md:gap-32 xl:gap-64 bg-white">
            <h2 className="text-xl font-bold text-[#000032] mb-32">
              {datasetRefs.length} conjunto{datasetRefs.length !== 1 ? 's' : ''} de dados
              associado{datasetRefs.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-x-[32px]">
              <div className="xl:col-span-5 xl:block p-32 pl-0"></div>
              <div className="xl:col-span-7">
              {!isLoadingDatasets && fullDatasets.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 agora-card-links-datasets-px0 gap-32">
                    {paginatedDatasets.map((dataset) => (
                      <div key={dataset.id} className="h-full">
                        <CardLinks
                          onClick={() => router.push(`/pages/datasets/${dataset.slug}`)}
                          className="cursor-pointer text-neutral-900"
                          variant="transparent"
                          category={dataset.organization?.name || ''}
                          title={
                            <div className="underline text-xl-bold">{dataset.title}</div>
                          }
                          description={
                            <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                              {dataset.description}
                            </p>
                          }
                          date={
                            <span className="font-[300]">
                              {`Atualizado há ${formatDistanceToNow(new Date(dataset.last_modified), { locale: pt })}`}
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
                              trailingIconActive: '',
                              children: dataset.metrics?.views
                                ? dataset.metrics.views >= 1000000
                                  ? `${(dataset.metrics.views / 1000000).toFixed(1)} M`
                                  : dataset.metrics.views >= 1000
                                    ? `${(dataset.metrics.views / 1000).toFixed(0)} mil`
                                    : dataset.metrics.views
                                : '0',
                              title: 'Visualizações',
                              onClick: (e: React.MouseEvent) => e.preventDefault(),
                              className: 'text-[#034AD8]',
                            },
                            {
                              href: '#',
                              hasIcon: true,
                              leadingIcon: 'agora-line-download',
                              leadingIconHover: 'agora-solid-download',
                              trailingIcon: '',
                              trailingIconHover: '',
                              trailingIconActive: '',
                              children: dataset.metrics?.resources_downloads
                                ? dataset.metrics.resources_downloads >= 1000000
                                  ? `${(dataset.metrics.resources_downloads / 1000000).toFixed(1)} M`
                                  : dataset.metrics.resources_downloads >= 1000
                                    ? `${(dataset.metrics.resources_downloads / 1000).toFixed(0)} mil`
                                    : dataset.metrics.resources_downloads
                                : '0',
                              title: 'Downloads',
                              onClick: (e: React.MouseEvent) => e.preventDefault(),
                              className: 'text-[#034AD8]',
                            },
                            {
                              href: '#',
                              hasIcon: false,
                              children: (
                                <span className="flex items-center gap-8">
                                  <img src="/Icons/bar_chart.svg" alt="" aria-hidden="true" className="w-[24px] h-[24px]" />
                                  <span>{dataset.metrics?.reuses || 0}</span>
                                </span>
                              ),
                              title: 'Reutilizações',
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
                              trailingIconActive: '',
                              children: dataset.metrics?.followers || 0,
                              title: 'Favoritos',
                              onClick: (e: React.MouseEvent) => e.preventDefault(),
                              className: 'text-[#034AD8]',
                            },
                          ]}
                          mainLink={
                            <Link href={`/pages/datasets/${dataset.slug}`}>
                              <span className="underline">{dataset.title}</span>
                            </Link>
                          }
                          blockedLink={true}
                        />
                      </div>
                    ))}
                  </div>
                  {renderDatasetsPagination()}
                </>
              ) : (
                <div className="text-neutral-900">
                  Não foi possível carregar os conjuntos de dados associados.
                </div>
              )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
