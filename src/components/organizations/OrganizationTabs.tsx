"use client";

import React, { useEffect, useRef, useState } from "react";
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
  CardNoResults,
  CardFrame,
  Avatar,
  Icon,
  SearchPagination,
  StatusCard,
  Button,
  InputSearchBar,
  InputText,
  InputTextArea,
  DropdownSection,
  DropdownOption,
  usePopupContext,
} from "@ama-pt/agora-design-system";
import IsolatedSelect from "@/components/admin/IsolatedSelect";
import EditDiscussionPopup from "@/components/discussions/EditDiscussionPopup";
import DeleteDiscussionPopup from "@/components/discussions/DeleteDiscussionPopup";
import {
  Organization,
  Dataset,
  Dataservice,
  Reuse,
  Discussion,
  DiscussionCreatePayload,
  APIResponse,
} from "@/types/api";
import {
  fetchOrgDatasets,
  fetchOrgDataservices,
  fetchOrgReuses,
  fetchOrgDiscussions,
  createDiscussion,
  replyToDiscussion,
} from "@/services/api";
import { useAuth } from "@/context/AuthContext";


interface OrganizationTabsProps {
  organization: Organization;
}

export const OrganizationTabs: React.FC<OrganizationTabsProps> = ({ organization }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { show, hide } = usePopupContext();

  const [datasetsResponse, setDatasetsResponse] = useState<APIResponse<Dataset> | null>(null);
  const [datasetsPage, setDatasetsPage] = useState(1);
  const [dataservicesResponse, setDataservicesResponse] =
    useState<APIResponse<Dataservice> | null>(null);
  const [dataservicesPage, setDataservicesPage] = useState(1);
  const [reuses, setReuses] = useState<Reuse[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discussionCount, setDiscussionCount] = useState(0);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscTitle, setNewDiscTitle] = useState("");
  const [newDiscMessage, setNewDiscMessage] = useState("");
  const selectedIdentityRef = useRef("");
  const [isSubmittingDiscussion, setIsSubmittingDiscussion] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const replyIdentityRef = useRef("");
  const [isReplying, setIsReplying] = useState(false);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);
  const [isLoadingDataservices, setIsLoadingDataservices] = useState(true);
  const [isLoadingReuses, setIsLoadingReuses] = useState(true);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(true);

  useEffect(() => {
    async function loadDatasets() {
      if (!datasetsResponse) setIsLoadingDatasets(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization.slug, datasetsPage]);

  useEffect(() => {
    async function loadDataservices() {
      if (!dataservicesResponse) setIsLoadingDataservices(true);
      try {
        const response = await fetchOrgDataservices(
          organization.id,
          dataservicesPage,
          20
        );
        setDataservicesResponse(response);
      } catch (error) {
        console.error("Error loading organization dataservices:", error);
      } finally {
        setIsLoadingDataservices(false);
      }
    }
    loadDataservices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization.id, dataservicesPage]);

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
    loadReuses();
  }, [organization.slug]);

  useEffect(() => {
    async function loadDiscussions() {
      try {
        const response = await fetchOrgDiscussions(organization.id);
        setDiscussions(response.data);
        setDiscussionCount(response.total);
      } catch (error) {
        console.error("Error loading organization discussions:", error);
      } finally {
        setIsLoadingDiscussions(false);
      }
    }
    loadDiscussions();
  }, [organization.id]);

  const handleCreateDiscussion = async () => {
    if (!newDiscTitle.trim() || !newDiscMessage.trim()) return;
    setIsSubmittingDiscussion(true);
    try {
      const payload: DiscussionCreatePayload = {
        title: newDiscTitle.trim(),
        comment: newDiscMessage.trim(),
        subject: {
          class: "Organization",
          id: organization.id,
        },
        ...(selectedIdentityRef.current && selectedIdentityRef.current !== "user"
          ? { organization: selectedIdentityRef.current } : {}),
      };
      const created = await createDiscussion(payload);
      if (created) {
        setDiscussions((prev) => [created, ...prev]);
        setDiscussionCount((prev) => prev + 1);
        setNewDiscTitle("");
        setNewDiscMessage("");
        setShowNewDiscussion(false);
      }
    } catch (error) {
      console.error("Error creating discussion:", error);
    } finally {
      setIsSubmittingDiscussion(false);
    }
  };

  const datasets = datasetsResponse?.data || [];
  const dataservices = dataservicesResponse?.data || [];

  const renderTabBody = (content: React.ReactNode) => (
    <TabBody>
      <div className="relative">
        <div
          className="absolute inset-y-0 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-32 xl:-mx-64 bg-primary-100 border-t border-dashed border-primary-400 z-0"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="container mx-auto max-w-5xl">{content}</div>
        </div>
      </div>
    </TabBody>
  );

  const renderPagination = (
    currentPage: number,
    total: number,
    pageSize: number,
    _hasNext: boolean,
    onPageChange: (page: number) => void
  ) => {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;
    return (
      <div className="mt-32 flex justify-center">
        <SearchPagination
          totalPages={totalPages}
          onChange={(page: number) => onPageChange(page + 1)}
          label="Paginação"
          nextPageAriaLabel="Próxima página"
          previousPageAriaLabel="Página anterior"
          boundaryCount={1}
          siblingCount={1}
        />
      </div>
    );
  };

  return (
    <div className="mt-64">
      <Tabs>
        {/* Tab 1: Apresentação */}
        <Tab>
          <TabHeader>Apresentação</TabHeader>
          {renderTabBody(
            <div className="bg-white rounded-8 p-32">
              <h2 className="text-l-bold text-neutral-900 mb-24">
                Descrição da organização
              </h2>
              {organization.description ? (
                <div
                  className="prose max-w-[75ch] text-neutral-900 text-m-light leading-relaxed [&_a]:underline [&_a]:text-primary-600"
                  dangerouslySetInnerHTML={{ __html: organization.description }}
                />
              ) : (
                <p className="text-neutral-500">
                  Esta organização não possui descrição.
                </p>
              )}
            </div>
          )}
        </Tab>

        {/* Tab 2: Conjuntos de dados */}
        <Tab>
          <TabHeader>
            Conjuntos de dados ({organization.metrics?.datasets || 0})
          </TabHeader>
          {renderTabBody(
            <div>
              <h3 className="font-medium text-neutral-900 text-base mb-24">
                {datasetsResponse?.total || 0} {(datasetsResponse?.total || 0) === 1 ? "CONJUNTO DE DADOS" : "CONJUNTOS DE DADOS"}
              </h3>
              {!isLoadingDatasets && datasets.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets gap-32">
                    {datasets.map((dataset) => (
                      <div key={dataset.id} className="h-full">
                        <CardLinks
                          onClick={() =>
                            router.push(`/pages/datasets/${dataset.slug}`)
                          }
                          className="cursor-pointer text-neutral-900"
                          variant="white"
                          image={{
                            src:
                              dataset.organization?.logo ||
                              "/images/placeholders/organization.png",
                            alt:
                              dataset.organization?.name || "Organização sem logo",
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
                                  <Icon
                                    name="agora-line-eye"
                                    aria-hidden="true"
                                  />
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
                                  <Icon
                                    name="agora-line-download"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {dataset.metrics?.resources_downloads
                                      ? dataset.metrics.resources_downloads >= 1000
                                        ? `${(dataset.metrics.resources_downloads / 1000).toFixed(0)} mil`
                                        : dataset.metrics.resources_downloads
                                      : "0"}
                                  </span>
                                </div>
                                <div
                                  className="flex items-center gap-8"
                                  title="Reutilizações"
                                >
                                  <img src="/Icons/bar_chart.svg" alt="" aria-hidden="true" />
                                  <span>{dataset.metrics?.reuses || 0}</span>
                                </div>
                                <div
                                  className="flex items-center gap-8"
                                  title="Favoritos"
                                >
                                  <Icon
                                    name="agora-line-star"
                                    aria-hidden="true"
                                  />
                                  <span>{dataset.metrics?.followers || 0}</span>
                                </div>
                              </div>
                            </div>
                          }
                          date={
                            <span className="font-[300]">
                              {dataset.last_modified && !isNaN(new Date(dataset.last_modified).getTime())
                                ? `Atualizado há ${formatDistanceToNow(new Date(dataset.last_modified), { locale: pt })}`
                                : "Data indisponível"}
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
                  {datasetsResponse &&
                    renderPagination(
                      datasetsPage,
                      datasetsResponse.total,
                      datasetsResponse.page_size,
                      !!datasetsResponse.next_page,
                      setDatasetsPage
                    )}
                </>
              ) : (
                <CardNoResults
                  position="center"
                  icon={<Icon name="agora-line-file" className="w-[40px] h-[40px] text-primary-500 icon-xl" />}
                  title="Sem conjuntos de dados"
                  description="Esta organização não possui conjuntos de dados publicados."
                  hasAnchor={false}
                />
              )}
            </div>
          )}
        </Tab>

        {/* Tab 3: API */}
        <Tab>
          <TabHeader>
            API ({organization.metrics?.dataservices || 0})
          </TabHeader>
          {renderTabBody(
            <div>
              <h3 className="font-medium text-neutral-900 text-base mb-16">
                {dataservicesResponse?.total || 0} {(dataservicesResponse?.total || 0) === 1 ? "API" : "APIs"}
              </h3>
              {!isLoadingDataservices && dataservices.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets gap-16">
                    {dataservices.map((ds) => (
                      <div key={ds.id} className="h-full">
                        <CardLinks
                          className="cursor-pointer text-neutral-900"
                          variant="white"
                          image={{
                            src:
                              ds.organization?.logo ||
                              "/images/placeholders/organization.png",
                            alt: ds.organization?.name || "Organização sem logo",
                          }}
                          category={ds.organization?.name}
                          title={
                            <div className="flex items-center gap-8">
                              <Icon
                                name="agora-line-code"
                                className="text-primary-600"
                                aria-hidden="true"
                              />
                              <span>{ds.title}</span>
                            </div>
                          }
                          description={
                            <div className="flex flex-col gap-12">
                              <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                                {ds.description}
                              </p>
                              {ds.format && (
                                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-8 py-2 rounded w-fit">
                                  {ds.format}
                                </span>
                              )}
                              <div className="flex items-center flex-wrap gap-[32px] text-xs mt-[8px] text-[#034AD8]">
                                <div
                                  className="flex items-center gap-8"
                                  title="Visualizações"
                                >
                                  <Icon
                                    name="agora-line-eye"
                                    aria-hidden="true"
                                  />
                                  <span>{ds.metrics?.views || 0}</span>
                                </div>
                                <div
                                  className="flex items-center gap-8"
                                  title="Seguidores"
                                >
                                  <Icon
                                    name="agora-line-star"
                                    aria-hidden="true"
                                  />
                                  <span>{ds.metrics?.followers || 0}</span>
                                </div>
                              </div>
                            </div>
                          }
                          date={
                            <span className="font-[300]">
                              {ds.last_modified && !isNaN(new Date(ds.last_modified).getTime())
                                ? `Atualizado há ${formatDistanceToNow(new Date(ds.last_modified), { locale: pt })}`
                                : "Data indisponível"}
                            </span>
                          }
                          mainLink={
                            ds.base_api_url ? (
                              <a
                                href={ds.base_api_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className="underline">{ds.title}</span>
                              </a>
                            ) : (
                              <span>{ds.title}</span>
                            )
                          }
                          blockedLink={true}
                        />
                      </div>
                    ))}
                  </div>
                  {dataservicesResponse &&
                    renderPagination(
                      dataservicesPage,
                      dataservicesResponse.total,
                      dataservicesResponse.page_size,
                      !!dataservicesResponse.next_page,
                      setDataservicesPage
                    )}
                </>
              ) : (
                <CardNoResults
                  position="center"
                  icon={<Icon name="agora-line-file" className="w-[40px] h-[40px] text-primary-500 icon-xl" />}
                  title="Sem APIs"
                  description="Esta organização não possui APIs publicadas."
                  hasAnchor={false}
                />
              )}
            </div>
          )}
        </Tab>

        {/* Tab 4: Reutilizações */}
        <Tab>
          <TabHeader>
            Reutilizações ({organization.metrics?.reuses || 0})
          </TabHeader>
          {renderTabBody(
            <div>
              <h3 className="font-medium text-neutral-900 text-base mb-16">
                {reuses.length} {reuses.length === 1 ? "REUTILIZAÇÃO" : "REUTILIZAÇÕES"}
              </h3>
              {!isLoadingReuses && reuses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 agora-card-links-datasets-px0 gap-32">
                  {reuses.map((reuse) => (
                    <div key={reuse.id} className="h-full">
                      <CardLinks
                        onClick={() =>
                          router.push(`/pages/reuses/${reuse.slug}`)
                        }
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
                          <div className="underline text-xl-bold">
                            {reuse.title}
                          </div>
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
                              reuse.metrics?.views?.toLocaleString("pt-PT") ||
                              "0",
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
                <CardNoResults
                  position="center"
                  icon={<Icon name="agora-line-file" className="w-[40px] h-[40px] text-primary-500 icon-xl" />}
                  title="Sem reutilizações"
                  description="Nenhuma reutilização associada a esta organização."
                  hasAnchor={false}
                />
              )}
            </div>
          )}
        </Tab>

        {/* Tab 5: Discussões */}
        <Tab>
          <TabHeader>Discussões ({discussionCount})</TabHeader>
          {renderTabBody(
            <div>
              <div className="mb-24">
                <StatusCard
                  type="info"
                  description={
                    <>
                      A sua questão é sobre outro tema que não esta organização?{" "}
                      <a
                        href="https://dados.gov.pt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 underline font-semibold"
                      >
                        Visite o nosso fórum{" "}
                        <Icon
                          name="agora-line-external-link"
                          className="w-4 h-4 inline"
                        />
                      </a>
                    </>
                  }
                />
              </div>
              <div className="flex items-center justify-between mb-24">
                <h3 className="font-medium text-neutral-900 text-base">
                  {discussionCount}{" "}
                  {discussionCount === 1 ? "DISCUSSÃO" : "DISCUSSÕES"}
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
                    Iniciar nova discussão
                  </Button>
                </div>
              </div>
              {showNewDiscussion && (
                <div className="bg-white rounded-8 p-32 mb-24">
                  <div className="flex justify-between items-center mb-16">
                    <h3 className="font-bold text-neutral-900 text-base">
                      Nova discussão
                    </h3>
                    <Button
                      variant="primary"
                      appearance="outline"
                      hasIcon
                      leadingIcon="agora-line-x"
                      leadingIconHover="agora-solid-x"
                      onClick={() => setShowNewDiscussion(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                  <p className="text-sm text-neutral-900 mb-16">
                    Os campos marcados com um asterisco (
                    <span className="text-red-500">*</span>) são obrigatórios.
                  </p>
                  {user?.organizations && user.organizations.length > 0 && (
                    <div className="mb-24">
                      <span className="block text-sm font-medium text-neutral-900 mb-8">
                        Escolha a identidade com a qual deseja publicar esta
                        mensagem.
                      </span>
                      <IsolatedSelect
                        label=""
                        hideLabel
                        placeholder="Para pesquisar..."
                        id="discussion-identity-org"
                        onChangeRef={selectedIdentityRef}
                        searchable
                        searchInputPlaceholder="Para pesquisar..."
                        searchNoResultsText="Sem resultados"
                      >
                        <DropdownSection name="identity">
                          <DropdownOption value="user">
                            {user.first_name} {user.last_name} (utilizador)
                          </DropdownOption>
                          {user.organizations.map((org) => (
                            <DropdownOption key={org.id} value={org.id}>
                              {org.name}
                            </DropdownOption>
                          ))}
                        </DropdownSection>
                      </IsolatedSelect>
                    </div>
                  )}
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
                    <Button
                      variant="primary"
                      appearance="solid"
                      onClick={handleCreateDiscussion}
                      disabled={
                        isSubmittingDiscussion ||
                        !newDiscTitle.trim() ||
                        !newDiscMessage.trim()
                      }
                    >
                      {isSubmittingDiscussion ? "A enviar..." : "Enviar"}
                    </Button>
                  </div>
                </div>
              )}
              {!isLoadingDiscussions && discussionCount === 0 ? (
                <CardNoResults
                  position="center"
                  icon={
                    <Icon
                      name="agora-line-chat"
                      className="w-[40px] h-[40px] text-primary-500 icon-xl"
                    />
                  }
                  title="Sem discussões"
                  description="Ainda não existem discussões sobre esta organização."
                  hasAnchor={false}
                />
              ) : (
                <div className="flex flex-col gap-32">
                  {discussions.map((disc) => (
                    <div key={disc.id} className="bg-white rounded-8 p-32">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-900 text-base">
                            {disc.title}
                          </h4>
                          <p className="text-sm text-neutral-900 mt-4">
                            <span className="text-primary-600 font-medium">
                              {disc.user.first_name} {disc.user.last_name}
                            </span>
                            {" — Publicado em "}
                            {format(
                              new Date(disc.created),
                              "d 'de' MMMM 'de' yyyy",
                              { locale: pt }
                            )}
                          </p>
                        </div>
                        <div className="flex gap-8">
                          <Button
                            variant="primary"
                            appearance="outline"
                            hasIcon
                            iconOnly
                            leadingIcon="agora-line-edit"
                            leadingIconHover="agora-solid-edit"
                            aria-label="Editar discussão"
                            onClick={() => show(
                              <EditDiscussionPopup discussion={disc} commentIndex={0} onUpdated={(updated) => setDiscussions((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))} />,
                              { title: "Editar a mensagem", closeAriaLabel: "Fechar", dimensions: "m" }
                            )}
                          >
                            {" "}
                          </Button>
                          <Button
                            variant="danger"
                            appearance="solid"
                            hasIcon
                            iconOnly
                            leadingIcon="agora-line-trash"
                            leadingIconHover="agora-solid-trash"
                            aria-label="Eliminar discussão"
                            onClick={() => show(
                              <DeleteDiscussionPopup discussion={disc} commentIndex={0} onDeleted={() => { setDiscussions((prev) => prev.filter((d) => d.id !== disc.id)); setDiscussionCount((prev) => prev - 1); }} />,
                              { title: "Tem certeza de que deseja eliminar esta discussão?", closeAriaLabel: "Fechar", dimensions: "m" }
                            )}
                          >
                            {" "}
                          </Button>
                        </div>
                      </div>
                      {disc.discussion.length > 0 && (
                        <p className="text-neutral-900 text-sm mt-16 mb-16">
                          {disc.discussion[0].content}
                        </p>
                      )}
                      {disc.discussion.length > 1 && (
                        <div className="mt-16 space-y-16 border-t border-neutral-200 pt-16">
                          {disc.discussion.slice(1).map((msg, idx) => (
                            <div
                              key={idx}
                              className="border-l-2 border-primary-600"
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className="flex justify-between items-start">
                                <p className="text-sm text-neutral-900">
                                  <span className="text-primary-600 font-medium">
                                    {msg.posted_by.first_name}{" "}
                                    {msg.posted_by.last_name}
                                  </span>
                                  {" — "}
                                  {format(
                                    new Date(msg.posted_on),
                                    "d 'de' MMMM 'de' yyyy",
                                    { locale: pt }
                                  )}
                                </p>
                                <div className="flex gap-8">
                                  <Button
                                    variant="primary"
                                    appearance="outline"
                                    hasIcon
                                    iconOnly
                                    leadingIcon="agora-line-edit"
                                    leadingIconHover="agora-solid-edit"
                                    aria-label="Editar comentário"
                                    onClick={() => show(
                                      <EditDiscussionPopup discussion={disc} commentIndex={idx + 1} onUpdated={(updated) => setDiscussions((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))} />,
                                      { title: "Editar a mensagem", closeAriaLabel: "Fechar", dimensions: "m" }
                                    )}
                                  >
                                    {" "}
                                  </Button>
                                  <Button
                                    variant="danger"
                                    appearance="solid"
                                    hasIcon
                                    iconOnly
                                    leadingIcon="agora-line-trash"
                                    leadingIconHover="agora-solid-trash"
                                    aria-label="Eliminar comentário"
                                    onClick={() => show(
                                      <DeleteDiscussionPopup discussion={disc} commentIndex={idx + 1} onDeleted={() => setDiscussions((prev) => prev.map((d) => d.id === disc.id ? { ...d, discussion: d.discussion.filter((_, i) => i !== idx + 1) } : d))} />,
                                      { title: "Tem certeza de que deseja apagar esta mensagem?", closeAriaLabel: "Fechar", dimensions: "m" }
                                    )}
                                  >
                                    {" "}
                                  </Button>
                                </div>
                              </div>
                              <p className="text-neutral-900 text-sm mt-4">
                                {msg.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      {replyingTo === disc.id ? (
                        <div className="mt-48 border-t border-neutral-200 pt-32">
                          <div className="flex justify-between items-center mb-24">
                            <h4 className="font-bold text-neutral-900 text-sm uppercase">
                              Responder
                            </h4>
                            <Button
                              variant="primary"
                              appearance="outline"
                              hasIcon
                              leadingIcon="agora-line-x"
                              leadingIconHover="agora-solid-x"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyMessage("");
                              }}
                            >
                              Fechar
                            </Button>
                          </div>
                          {user?.organizations &&
                            user.organizations.length > 0 && (
                              <div className="mb-16">
                                <span className="block text-sm font-medium text-neutral-900 mb-8">
                                  Escolha a identidade com a qual deseja
                                  publicar esta mensagem.
                                </span>
                                <IsolatedSelect
                                  label=""
                                  hideLabel
                                  placeholder="Para pesquisar..."
                                  id={`reply-identity-${disc.id}`}
                                  onChangeRef={replyIdentityRef}
                                  searchable
                                  searchInputPlaceholder="Para pesquisar..."
                                  searchNoResultsText="Sem resultados"
                                >
                                  <DropdownSection name="identity">
                                    <DropdownOption value="user">
                                      {user.first_name} {user.last_name}{" "}
                                      (utilizador)
                                    </DropdownOption>
                                    {user.organizations.map((org) => (
                                      <DropdownOption
                                        key={org.id}
                                        value={org.id}
                                      >
                                        {org.name}
                                      </DropdownOption>
                                    ))}
                                  </DropdownSection>
                                </IsolatedSelect>
                              </div>
                            )}
                          <div className="mb-16">
                            <InputTextArea
                              label="Sua mensagem"
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              rows={3}
                              placeholder="Por favor, mantenha a cordialidade e a postura construtiva. Evite compartilhar informações pessoais."
                            />
                          </div>
                          <div className="flex justify-end gap-16">
                            <Button
                              variant="primary"
                              appearance="outline"
                              disabled={isReplying || !replyMessage.trim()}
                              onClick={async () => {
                                setIsReplying(true);
                                const org =
                                  replyIdentityRef.current &&
                                  replyIdentityRef.current !== "user"
                                    ? replyIdentityRef.current
                                    : undefined;
                                const updated = await replyToDiscussion(
                                  disc.id,
                                  replyMessage.trim(),
                                  { organization: org, close: true }
                                );
                                if (updated) {
                                  setDiscussions((prev) =>
                                    prev.map((d) =>
                                      d.id === updated.id ? updated : d
                                    )
                                  );
                                  setReplyingTo(null);
                                  setReplyMessage("");
                                }
                                setIsReplying(false);
                              }}
                            >
                              Responder e fechar
                            </Button>
                            <Button
                              variant="primary"
                              appearance="solid"
                              disabled={isReplying || !replyMessage.trim()}
                              onClick={async () => {
                                setIsReplying(true);
                                const org =
                                  replyIdentityRef.current &&
                                  replyIdentityRef.current !== "user"
                                    ? replyIdentityRef.current
                                    : undefined;
                                const updated = await replyToDiscussion(
                                  disc.id,
                                  replyMessage.trim(),
                                  { organization: org }
                                );
                                if (updated) {
                                  setDiscussions((prev) =>
                                    prev.map((d) =>
                                      d.id === updated.id ? updated : d
                                    )
                                  );
                                  setReplyingTo(null);
                                  setReplyMessage("");
                                }
                                setIsReplying(false);
                              }}
                            >
                              Responder
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex justify-end"
                          style={{ marginTop: "32px" }}
                        >
                          <Button
                            variant="primary"
                            appearance="outline"
                            onClick={() => {
                              setReplyingTo(disc.id);
                              setReplyMessage("");
                            }}
                          >
                            Responder
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Tab>

        {/* Tab 6: Informações (Statistics, Members, Technical Info) */}
        <Tab>
          <TabHeader>Informações</TabHeader>
          {renderTabBody(
            <div className="bg-white rounded-8 p-32">
              {/* Statistics Section */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-16">
                  Estatísticas
                </h3>
                <div className="flex gap-24 pb-48">
                  <div className="flex-1">
                    <CardFrame label={String(organization.metrics?.datasets || 0)}>
                      <p className="text-neutral-700 text-base">Conjuntos de dados</p>
                    </CardFrame>
                  </div>
                  <div className="flex-1">
                    <CardFrame label={String(organization.metrics?.dataservices || 0)}>
                      <p className="text-neutral-700 text-base">API</p>
                    </CardFrame>
                  </div>
                  <div className="flex-1">
                    <CardFrame label={String(organization.metrics?.reuses || 0)}>
                      <p className="text-neutral-700 text-base">Reutilizações</p>
                    </CardFrame>
                  </div>
                  <div className="flex-1">
                    <CardFrame label={String(organization.metrics?.followers || 0)}>
                      <p className="text-neutral-700 text-base">Seguidores</p>
                    </CardFrame>
                  </div>
                </div>
              </div>

              {/* Members Section */}
              {organization.members?.length > 0 && (
                <div style={{ marginTop: "64px" }}>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-16">
                    Membros
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                    {organization.members.map((member, index) => (
                      <div
                        key={member.user?.id || index}
                        className="flex items-center gap-16"
                      >
                        <div className="flex-shrink-0">
                          <Avatar
                            avatarType={member.user?.avatar_thumbnail ? "image" : "initials"}
                            srcPath={
                              (member.user?.avatar_thumbnail ||
                                `${(member.user?.first_name || "")[0] || ""}${(member.user?.last_name || "")[0] || ""}`.toUpperCase()) as unknown as undefined
                            }
                            alt={`${member.user?.first_name} ${member.user?.last_name}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">
                            {member.user?.first_name} {member.user?.last_name}
                          </p>
                          <span className="text-xs font-medium text-primary-600 mt-4 block">
                            {member.role === "admin"
                              ? "Administrador"
                              : "Editor"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Information Section */}
              <div className="mt-32">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-16">
                  Informações técnicas
                </h3>
                <div className="grid grid-cols-3 gap-24">
                  <div>
                    <p className="font-bold text-sm mb-8">Última atualização</p>
                    <span className="text-sm">
                      {organization.last_modified
                        ? format(
                            new Date(organization.last_modified),
                            "d 'de' MMMM 'de' yyyy",
                            { locale: pt }
                          )
                        : "—"}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-8">Identificador</p>
                    <span className="text-sm">{organization.id}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-8">Data de criação</p>
                    <span className="text-sm">
                      {organization.created_at
                        ? format(
                            new Date(organization.created_at),
                            "d 'de' MMMM 'de' yyyy",
                            { locale: pt }
                          )
                        : "—"}
                    </span>
                  </div>
                  {organization.url && (
                    <div>
                      <p className="font-bold text-sm mb-8">Website</p>
                      <a
                        href={organization.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        {organization.url}
                      </a>
                    </div>
                  )}
                  {organization.business_number_id && (
                    <div>
                      <p className="font-bold text-sm mb-8">
                        NIF / Identificação fiscal
                      </p>
                      <span className="text-sm">
                        {organization.business_number_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};
