"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Tabs, Tab, TabHeader, TabBody, CardLinks, Icon } from "@ama-pt/agora-design-system";
import { Organization, Dataset, Reuse, Discussion } from "@/types/api";
import { fetchOrgDatasets, fetchOrgReuses, fetchOrgDiscussions } from "@/services/api";

interface OrganizationTabsProps {
  organization: Organization;
}

export const OrganizationTabs: React.FC<OrganizationTabsProps> = ({ organization }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [reuses, setReuses] = useState<Reuse[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);
  const [isLoadingReuses, setIsLoadingReuses] = useState(true);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(true);

  useEffect(() => {
    async function loadDatasets() {
      try {
        const response = await fetchOrgDatasets(organization.slug);
        setDatasets(response.data);
      } catch (error) {
        console.error("Error loading organization datasets:", error);
      } finally {
        setIsLoadingDatasets(false);
      }
    }

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

    loadDatasets();
    loadReuses();
    loadDiscussions();
  }, [organization.slug]);

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
        <Tab>
          <TabHeader>Ficheiros ({organization.metrics?.datasets || 0})</TabHeader>
          {renderTabBody(
            isLoadingDatasets ? (
              <div className="text-neutral-500">A carregar conjuntos de dados...</div>
            ) : datasets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets gap-16">
                {datasets.map((dataset) => (
                  <div key={dataset.id} className="h-full">
                    <CardLinks
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
                            <div className="flex items-center gap-8" title="Visualizações">
                              <Icon name="agora-line-eye" aria-hidden="true" />
                              <span>{dataset.metrics?.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-8" title="Reutilizações">
                              <Icon name="agora-line-refresh" aria-hidden="true" />
                              <span>{dataset.metrics?.reuses || 0}</span>
                            </div>
                            <div className="flex items-center gap-8" title="Favoritos">
                              <Icon name="agora-line-star" aria-hidden="true" />
                              <span>{dataset.metrics?.followers || 0}</span>
                            </div>
                          </div>
                        </div>
                      }
                      date={
                        <span className="font-[300]">{`Atualizado há ${formatDistanceToNow(new Date(dataset.last_modified), { locale: pt })}`}</span>
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
            ) : (
              <div className="text-neutral-500">
                Esta organização não possui conjuntos de dados publicados.
              </div>
            )
          )}
        </Tab>
        <Tab>
          <TabHeader>
            Reutilizações e APIs ({organization.metrics?.reuses || 0})
          </TabHeader>
          {renderTabBody(
            isLoadingReuses ? (
              <div className="text-neutral-500">A carregar reutilizações...</div>
            ) : reuses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {reuses.map((reuse) => (
                  <div key={reuse.id} className="h-full">
                    <CardLinks
                      className="cursor-pointer text-neutral-900"
                      variant="white"
                      image={{
                        src:
                          reuse.image_thumbnail ||
                          reuse.image ||
                          "/images/placeholders/organization.png",
                        alt: reuse.title,
                      }}
                      category={reuse.organization?.name}
                      title={reuse.title}
                      description={
                        <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                          {reuse.description}
                        </p>
                      }
                      date={
                        <span className="font-[300]">{`Atualizado há ${formatDistanceToNow(new Date(reuse.last_modified), { locale: pt })}`}</span>
                      }
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
            )
          )}
        </Tab>
        <Tab>
          <TabHeader>Discussões ({discussions.length})</TabHeader>
          {renderTabBody(
            isLoadingDiscussions ? (
              <div className="text-neutral-500">A carregar discussões...</div>
            ) : discussions.length > 0 ? (
              <div className="flex flex-col gap-16">
                {discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className="bg-white rounded-4 p-24 border border-neutral-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-m-semibold text-neutral-900">
                          {discussion.title}
                        </h4>
                        <p className="text-sm text-neutral-500 mt-4">
                          Por {discussion.user?.first_name} {discussion.user?.last_name}{" "}
                          · {formatDistanceToNow(new Date(discussion.created), { locale: pt, addSuffix: true })}
                        </p>
                      </div>
                      {discussion.closed ? (
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-8 py-4 rounded">
                          Fechada
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-blue-700 bg-blue-100 px-8 py-4 rounded">
                          Aberta
                        </span>
                      )}
                    </div>
                    {discussion.discussion?.length > 0 && (
                      <p className="text-sm text-neutral-700 mt-8 line-clamp-2">
                        {discussion.discussion[0].content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-500">
                Nenhuma discussão associada a esta organização.
              </div>
            )
          )}
        </Tab>
        <Tab>
          <TabHeader>Recursos comunitários</TabHeader>
          {renderTabBody(
            <div className="flex flex-col gap-16">
              <h4 className="text-l-semibold text-neutral-900 font-bold">
                Resumo da Organização
              </h4>
              <p className="text-neutral-700">
                {organization.description || "Sem descrição detalhada disponível."}
              </p>
              <div className="grid grid-cols-2 gap-32 mt-16">
                <div>
                  <span className="text-sm font-semibold text-neutral-500 block">ID</span>
                  <span className="text-neutral-900">{organization.id}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-neutral-500 block">Slug</span>
                  <span className="text-neutral-900">{organization.slug}</span>
                </div>
              </div>
            </div>
          )}
        </Tab>
        <Tab>
          <TabHeader>Informação</TabHeader>
          {renderTabBody(
            <div className="flex flex-col gap-16">
              <h4 className="text-l-semibold text-neutral-900 font-bold">
                Resumo da Organização
              </h4>
              <p className="text-neutral-700">
                {organization.description || "Sem descrição detalhada disponível."}
              </p>
              <div className="grid grid-cols-2 gap-32 mt-16">
                <div>
                  <span className="text-sm font-semibold text-neutral-500 block">ID</span>
                  <span className="text-neutral-900">{organization.id}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-neutral-500 block">Slug</span>
                  <span className="text-neutral-900">{organization.slug}</span>
                </div>
              </div>
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};
