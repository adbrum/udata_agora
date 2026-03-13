"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Tabs,
  Tab,
  TabHeader,
  TabBody,
  CardLinks,
  Icon,
} from "@ama-pt/agora-design-system";
import { Organization, Dataset, Reuse, Discussion, APIResponse } from "@/types/api";
import { fetchOrgDatasets, fetchOrgReuses, fetchOrgDiscussions } from "@/services/api";

interface OrganizationTabsProps {
  organization: Organization;
}

export const OrganizationTabs: React.FC<OrganizationTabsProps> = ({ organization }) => {
  const router = useRouter();

  const [datasetsResponse, setDatasetsResponse] = useState<APIResponse<Dataset> | null>(null);
  const [datasetsPage, setDatasetsPage] = useState(1);
  const [reuses, setReuses] = useState<Reuse[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);
  const [isLoadingReuses, setIsLoadingReuses] = useState(true);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(true);

  useEffect(() => {
    async function loadDatasets() {
      setIsLoadingDatasets(true);
      try {
        const response = await fetchOrgDatasets(organization.slug, datasetsPage, 20);
        setDatasetsResponse(response);
      } catch (error) {
        console.error("Error loading organization datasets:", error);
      } finally {
        setIsLoadingDatasets(false);
      }
    }
    loadDatasets();
  }, [organization.slug, datasetsPage]);

  useEffect(() => {
    async function loadReuses() {
      try {
        const response = await fetchOrgReuses(organization.slug);
        setReuses(response);
      } catch (error) {
        console.error("Error loading organization reuses:", error);
      } finally {
        setIsLoadingReuses(false);
      }
    }

    async function loadDiscussions() {
      try {
        const response = await fetchOrgDiscussions(organization.slug);
        setDiscussions(response);
      } catch (error) {
        console.error("Error loading organization discussions:", error);
      } finally {
        setIsLoadingDiscussions(false);
      }
    }

    loadReuses();
    loadDiscussions();
  }, [organization.slug]);

  const datasets = datasetsResponse?.data || [];

  const renderTabBody = (content: React.ReactNode) => (
    <TabBody>
      <div className="relative">
        <div
          className="absolute inset-y-0 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-32 xl:-mx-64 bg-primary-100 border-t border-dashed border-primary-400 z-0"
          aria-hidden="true"
        />
        <div className="relative z-10 py-64">
          <div className="container mx-auto max-w-5xl">{content}</div>
        </div>
      </div>
    </TabBody>
  );

  return (
    <div className="mt-64">
      <Tabs>
        {/* Tab 1: Apresentação (Description) */}
        <Tab>
          <TabHeader>Apresentação</TabHeader>
          {renderTabBody(
            <div>
              <h2 className="text-sm text-neutral-500 mb-16">
                Descrição da organização
              </h2>
              <div className="prose max-w-none text-neutral-900">
                {organization.description ? (
                  <p className="text-m-light leading-relaxed whitespace-pre-line">
                    {organization.description}
                  </p>
                ) : (
                  <p className="text-neutral-500">
                    Esta organização não possui descrição.
                  </p>
                )}
              </div>
            </div>
          )}
        </Tab>

        {/* Tab 2: Conjuntos de dados */}
        <Tab>
          <TabHeader>
            Conjuntos de dados ({organization.metrics?.datasets || 0})
          </TabHeader>
          {renderTabBody(
            <>
              <h2 className="text-sm text-neutral-500 mb-16">
                Conjuntos de dados da organização
              </h2>
              {isLoadingDatasets ? (
                <div className="text-neutral-500">A carregar conjuntos de dados...</div>
              ) : datasets.length > 0 ? (
                <>
                  <div className="text-sm text-neutral-500 mb-16">
                    {datasetsResponse?.total || 0} conjuntos de dados
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets gap-16">
                    {datasets.map((dataset) => (
                      <div key={dataset.id} className="h-full">
                        <CardLinks
                          onClick={() => router.push(`/pages/datasets/${dataset.slug}`)}
                          className="cursor-pointer text-neutral-900"
                          variant="white"
                          image={{
                            src:
                              dataset.organization?.logo ||
                              "/images/placeholders/organization.png",
                            alt: dataset.organization?.name || "Organização sem logo",
                          }}
                          category={dataset.organization?.name}
                          title={dataset.title}
                          description={
                            <div className="flex flex-col gap-12">
                              <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                                {dataset.description}
                              </p>
                              <div className="flex items-center flex-wrap gap-[32px] text-xs mt-[16px] text-[#034AD8]">
                                <div
                                  className="flex items-center gap-8"
                                  title="Visualizações"
                                >
                                  <Icon name="agora-line-eye" aria-hidden="true" />
                                  <span>
                                    {dataset.metrics?.views
                                      ? dataset.metrics.views >= 1000
                                        ? `${(dataset.metrics.views / 1000).toFixed(0)} mil`
                                        : dataset.metrics.views
                                      : "0"}
                                  </span>
                                </div>
                                <div
                                  className="flex items-center gap-8"
                                  title="Downloads"
                                >
                                  <Icon name="agora-line-download" aria-hidden="true" />
                                  <span>
                                    {dataset.metrics?.downloads
                                      ? dataset.metrics.downloads >= 1000
                                        ? `${(dataset.metrics.downloads / 1000).toFixed(0)} mil`
                                        : dataset.metrics.downloads
                                      : "0"}
                                  </span>
                                </div>
                                <div
                                  className="flex items-center gap-8"
                                  title="Reutilizações"
                                >
                                  <Icon name="agora-line-refresh" aria-hidden="true" />
                                  <span>{dataset.metrics?.reuses || 0}</span>
                                </div>
                                <div
                                  className="flex items-center gap-8"
                                  title="Favoritos"
                                >
                                  <Icon name="agora-line-star" aria-hidden="true" />
                                  <span>{dataset.metrics?.followers || 0}</span>
                                </div>
                              </div>
                            </div>
                          }
                          date={
                            <span className="font-[300]">
                              {`Atualizado há ${formatDistanceToNow(new Date(dataset.last_modified), { locale: pt })}`}
                            </span>
                          }
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
                  {datasetsResponse && datasetsResponse.total > datasetsResponse.page_size && (
                    <div className="flex items-center justify-center gap-16 mt-32">
                      <button
                        className="px-16 py-8 text-sm font-medium text-primary-600 border border-primary-300 rounded hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={datasetsPage <= 1}
                        onClick={() => setDatasetsPage((p) => Math.max(1, p - 1))}
                      >
                        Anterior
                      </button>
                      <span className="text-sm text-neutral-700">
                        Página {datasetsPage} de{" "}
                        {Math.ceil(datasetsResponse.total / datasetsResponse.page_size)}
                      </span>
                      <button
                        className="px-16 py-8 text-sm font-medium text-primary-600 border border-primary-300 rounded hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={!datasetsResponse.next_page}
                        onClick={() => setDatasetsPage((p) => p + 1)}
                      >
                        Seguinte
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-neutral-500">
                  Esta organização não possui conjuntos de dados publicados.
                </div>
              )}
            </>
          )}
        </Tab>

        {/* Tab 3: Reutilizações */}
        <Tab>
          <TabHeader>
            Reutilizações ({organization.metrics?.reuses || 0})
          </TabHeader>
          {renderTabBody(
            <>
              <h2 className="text-sm text-neutral-500 mb-16">
                Reutilizações da organização
              </h2>
              {isLoadingReuses ? (
                <div className="text-neutral-500">A carregar reutilizações...</div>
              ) : reuses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets-px0 gap-32">
                  {reuses.map((reuse) => (
                    <div key={reuse.id} className="h-full">
                      <CardLinks
                        onClick={() => router.push(`/pages/reuses/${reuse.slug}`)}
                        className="cursor-pointer text-neutral-900"
                        variant="transparent"
                        image={{
                          src:
                            reuse.image_thumbnail ||
                            reuse.image ||
                            "/laptop.png",
                          alt: reuse.title,
                        }}
                        category={reuse.organization?.name || "Reutilização"}
                        title={
                          <div className="underline text-xl-bold">{reuse.title}</div>
                        }
                        description={
                          reuse.description ? (
                            <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                              {reuse.description}
                            </p>
                          ) : undefined
                        }
                        date={
                          <span className="font-[300]">
                            {`Atualizado ${format(new Date(reuse.last_modified || reuse.created_at), "dd MM yyyy", { locale: pt })}`}
                          </span>
                        }
                        links={[
                          {
                            href: "#",
                            hasIcon: true,
                            leadingIcon: "agora-line-eye",
                            leadingIconHover: "agora-solid-eye",
                            trailingIcon: "",
                            trailingIconHover: "",
                            trailingIconActive: "",
                            children:
                              reuse.metrics?.views?.toLocaleString("pt-PT") || "0",
                            title: "Visualizações",
                            onClick: (e: React.MouseEvent) => e.preventDefault(),
                            className: "text-[#034AD8]",
                          },
                          {
                            href: "#",
                            hasIcon: true,
                            leadingIcon: "agora-line-star",
                            leadingIconHover: "agora-solid-star",
                            trailingIcon: "",
                            trailingIconHover: "",
                            trailingIconActive: "",
                            children: reuse.metrics?.followers || 0,
                            title: "Favoritos",
                            onClick: (e: React.MouseEvent) => e.preventDefault(),
                            className: "text-[#034AD8]",
                          },
                        ]}
                        mainLink={
                          <Link href={`/pages/reuses/${reuse.slug}`}>
                            <span className="underline">{reuse.title}</span>
                          </Link>
                        }
                        blockedLink={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500">
                  Nenhuma reutilização associada a esta organização.
                </div>
              )}
            </>
          )}
        </Tab>

        {/* Tab 4: Discussões */}
        <Tab>
          <TabHeader>Discussões ({discussions.length})</TabHeader>
          {renderTabBody(
            <>
              <h2 className="text-sm text-neutral-500 mb-16">
                Discussões da organização
              </h2>
              {isLoadingDiscussions ? (
                <div className="text-neutral-500">A carregar discussões...</div>
              ) : discussions.length > 0 ? (
                <div className="flex flex-col gap-16">
                  {discussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="bg-white rounded-4 p-24 border border-neutral-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-m-semibold text-neutral-900">
                            {discussion.title}
                          </h4>
                          <p className="text-sm text-neutral-500 mt-4">
                            Por {discussion.user?.first_name}{" "}
                            {discussion.user?.last_name} ·{" "}
                            {formatDistanceToNow(new Date(discussion.created), {
                              locale: pt,
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {discussion.closed ? (
                          <span className="text-xs font-medium text-green-700 bg-green-100 px-8 py-4 rounded flex-shrink-0">
                            Fechada
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-8 py-4 rounded flex-shrink-0">
                            Aberta
                          </span>
                        )}
                      </div>
                      {discussion.discussion?.length > 0 && (
                        <p className="text-sm text-neutral-700 mt-8 line-clamp-2">
                          {discussion.discussion[0].content}
                        </p>
                      )}
                      {discussion.discussion?.length > 1 && (
                        <p className="text-xs text-neutral-500 mt-8">
                          {discussion.discussion.length} mensagens
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500">
                  Nenhuma discussão associada a esta organização.
                </div>
              )}
            </>
          )}
        </Tab>

        {/* Tab 5: Informações (Statistics, Members, Technical Info) */}
        <Tab>
          <TabHeader>Informações</TabHeader>
          {renderTabBody(
            <div className="flex flex-col gap-32">
              {/* Statistics Section */}
              <section>
                <h3 className="text-l-semibold text-neutral-900 font-bold mb-16">
                  Estatísticas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
                  <div className="bg-white rounded-4 p-24 border border-neutral-200">
                    <div className="text-sm text-neutral-500 mb-4">
                      Conjuntos de dados
                    </div>
                    <div className="text-l-semibold font-bold text-neutral-900">
                      {organization.metrics?.datasets || 0}
                    </div>
                  </div>
                  <div className="bg-white rounded-4 p-24 border border-neutral-200">
                    <div className="text-sm text-neutral-500 mb-4">Reutilizações</div>
                    <div className="text-l-semibold font-bold text-neutral-900">
                      {organization.metrics?.reuses || 0}
                    </div>
                  </div>
                  <div className="bg-white rounded-4 p-24 border border-neutral-200">
                    <div className="text-sm text-neutral-500 mb-4">Seguidores</div>
                    <div className="text-l-semibold font-bold text-neutral-900">
                      {organization.metrics?.followers || 0}
                    </div>
                  </div>
                  <div className="bg-white rounded-4 p-24 border border-neutral-200">
                    <div className="text-sm text-neutral-500 mb-4">Visualizações</div>
                    <div className="text-l-semibold font-bold text-neutral-900">
                      {organization.metrics?.views || 0}
                    </div>
                  </div>
                </div>
              </section>

              {/* Members Section */}
              {organization.members?.length > 0 && (
                <section>
                  <h3 className="text-l-semibold text-neutral-900 font-bold mb-16">
                    Membros
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                    {organization.members.map((member, index) => (
                      <div
                        key={member.user?.id || index}
                        className={`flex items-center gap-16 px-24 ${index % 3 !== 0 ? "border-l border-neutral-200" : ""}`}
                      >
                        <div className="flex-shrink-0">
                          {member.user?.avatar_thumbnail ? (
                            <img
                              src={member.user.avatar_thumbnail}
                              alt={`${member.user.first_name} ${member.user.last_name}`}
                              className="w-[48px] h-[48px] rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-[48px] h-[48px] rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-m-semibold">
                              {member.user?.first_name?.[0]}
                              {member.user?.last_name?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-m-semibold text-neutral-900 truncate">
                            {member.user?.first_name} {member.user?.last_name}
                          </p>
                          <span className="text-xs font-medium text-primary-600 bg-primary-100 px-8 py-2 rounded">
                            {member.role === "admin" ? "Administrador" : "Editor"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Information Section */}
              <section>
                <h3 className="text-l-semibold text-neutral-900 font-bold mb-16">
                  Informações técnicas
                </h3>
                <div className="bg-white rounded-4 p-24 border border-neutral-200">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                      <dt className="text-sm font-semibold text-neutral-500">
                        Última atualização
                      </dt>
                      <dd className="text-neutral-900 mt-2">
                        {organization.last_modified
                          ? format(new Date(organization.last_modified), "d 'de' MMMM 'de' yyyy", {
                              locale: pt,
                            })
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-neutral-500">
                        Identificador
                      </dt>
                      <dd className="text-neutral-900 mt-2 font-mono text-sm">
                        {organization.id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-neutral-500">
                        Data de criação
                      </dt>
                      <dd className="text-neutral-900 mt-2">
                        {organization.created_at
                          ? format(new Date(organization.created_at), "d 'de' MMMM 'de' yyyy", {
                              locale: pt,
                            })
                          : "—"}
                      </dd>
                    </div>
                    {organization.url && (
                      <div>
                        <dt className="text-sm font-semibold text-neutral-500">
                          Website
                        </dt>
                        <dd className="mt-2">
                          <a
                            href={organization.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline text-sm"
                          >
                            {organization.url}
                          </a>
                        </dd>
                      </div>
                    )}
                    {organization.business_number_id && (
                      <div>
                        <dt className="text-sm font-semibold text-neutral-500">
                          NIF / Identificação fiscal
                        </dt>
                        <dd className="text-neutral-900 mt-2">
                          {organization.business_number_id}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </section>
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};
