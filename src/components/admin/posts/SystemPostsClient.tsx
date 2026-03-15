"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Icon,
  InputSelect,
  InputSearchBar,
  DropdownSection,
  DropdownOption,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Pill,
} from "@ama-pt/agora-design-system";

interface MockArticle {
  title: string;
  slug: string;
  status: string;
  statusVariant: "success" | "warning";
  createdAt: string;
  updatedAt: string;
}

const mockArticles: MockArticle[] = [
  {
    title: "Nome Artigo",
    slug: "nome-artigo-1",
    status: "Rascunho",
    statusVariant: "warning",
    createdAt: "16 de janeiro de 2026",
    updatedAt: "16 de janeiro de 2026",
  },
  {
    title: "Nome Artigo",
    slug: "nome-artigo-2",
    status: "Rascunho",
    statusVariant: "warning",
    createdAt: "16 de janeiro de 2026",
    updatedAt: "16 de janeiro de 2026",
  },
  {
    title:
      "Municípios reforçam competências em dados abertos com apoio da ENTI",
    slug: "municipios-reforcam-competencias",
    status: "Publicado em 5 de novembro de 2025",
    statusVariant: "success",
    createdAt: "5 de novembro de 2025",
    updatedAt: "28 de novembro de 2025",
  },
  {
    title:
      "AMA IP dá lugar à ARTE IP, continuando focada em impulsionar o crescimento da Comunidade e Ecossistema de Dados Abertos em Portugal",
    slug: "ama-ip-da-lugar-arte-ip-publicado",
    status: "Publicado em 31 de outubro de 2025",
    statusVariant: "success",
    createdAt: "31 de outubro de 2025",
    updatedAt: "31 de outubro de 2025",
  },
  {
    title:
      "AMA IP dá lugar à ARTE IP, continuando focada em impulsionar o crescimento da Comunidade e Ecossistema de Dados Abertos em Portugal",
    slug: "ama-ip-da-lugar-arte-ip-rascunho",
    status: "Rascunho",
    statusVariant: "warning",
    createdAt: "31 de outubro de 2025",
    updatedAt: "31 de outubro de 2025",
  },
  {
    title:
      "AMA promove workshop para apoiar municípios na publicação de dados abertos",
    slug: "ama-promove-workshop",
    status: "Publicado em 14 de julho de 2025",
    statusVariant: "success",
    createdAt: "14 de julho de 2025",
    updatedAt: "17 de outubro de 2025",
  },
  {
    title:
      "E-REDES reforça compromisso com a inovação e a transparência através do seu Portal Open Data",
    slug: "e-redes-reforca-compromisso",
    status: "Publicado em 8 de maio de 2025",
    statusVariant: "success",
    createdAt: "8 de maio de 2025",
    updatedAt: "8 de maio de 2025",
  },
];

export default function SystemPostsClient() {
  const router = useRouter();
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const publishDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const articles = mockArticles;

  const publishRoutes: Record<string, string> = {
    dataset: "/pages/admin/me/datasets/new",
    reuse: "/pages/admin/me/reuses/new",
    harvester: "/pages/admin/harvesters/new",
    api: "/pages/admin/dataservices/new",
    article: "/pages/admin/system/posts/new",
    organization: "/pages/admin/organizations/new",
  };

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Artigos", url: "/pages/admin/system/posts" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Artigos</h1>
        <div className="flex items-center gap-[16px]">
          <div
            className="relative inline-block publish-dropdown-wrapper"
            ref={publishDropdownWrapperRef}
          >
            <Button
              variant="primary"
              hasIcon={true}
              trailingIcon={
                showPublishDropdown
                  ? "agora-line-arrow-up"
                  : "agora-line-arrow-down"
              }
              trailingIconHover={
                showPublishDropdown
                  ? "agora-solid-arrow-up"
                  : "agora-solid-arrow-down"
              }
              className="px-24 py-16 rounded-8 h-auto relative z-10"
              onClick={() => setShowPublishDropdown((v) => !v)}
            >
              <span className="text-lg font-medium">
                Publicar <span className="font-bold">dados.gov</span>
              </span>
            </Button>
            <Dropdown
              type="text"
              showDropdown={showPublishDropdown}
              onHide={() => setShowPublishDropdown(false)}
              hideSectionNames={true}
              optionsVisible={6}
              onChange={(options) => {
                if (options.length > 0) {
                  const route = publishRoutes[options[0].value as string];
                  if (route) router.push(route);
                }
              }}
              style={{
                width: "max-content",
                minWidth: "100%",
              }}
            >
              <DropdownSection name="publish" label="">
                <DropdownOption value="dataset">Um conjunto de dados</DropdownOption>
                <DropdownOption value="reuse">Uma reutilização</DropdownOption>
                <DropdownOption value="harvester">Um harvester</DropdownOption>
                <DropdownOption value="api">Uma API</DropdownOption>
                <DropdownOption value="article">Um artigo</DropdownOption>
              <DropdownOption value="organization">Uma organização</DropdownOption>
              </DropdownSection>
            </Dropdown>
          </div>
        </div>
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {articles.length} resultados
      </p>

      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar
            label="Pesquisar"
            placeholder="Pesquise o título do artigo"
            aria-label="Pesquisar artigos"
          />
        </div>
        <InputSelect
          label=""
          hideLabel
          placeholder="Filtrar por estado"
          id="filter-status"
        >
          <DropdownSection name="status">
            <DropdownOption value="public">Público</DropdownOption>
            <DropdownOption value="archived">Arquivo</DropdownOption>
            <DropdownOption value="draft">Rascunho</DropdownOption>
            <DropdownOption value="deleted">Excluído</DropdownOption>
          </DropdownSection>
        </InputSelect>
        <Button
          variant="primary"
          hasIcon={true}
          leadingIcon="agora-line-plus-circle"
          leadingIconHover="agora-solid-plus-circle"
          onClick={() => router.push("/pages/admin/system/posts/new")}
        >
          Criar um artigo
        </Button>
      </div>

      <Table
        paginationProps={{
          itemsPerPageLabel: "Linhas por página",
          itemsPerPage: 10,
          totalItems: articles.length,
          availablePageSizes: [5, 10, 20],
          currentPage: 1,
          buttonDropdownAriaLabel: "Selecionar linhas por página",
          dropdownListAriaLabel: "Opções de linhas por página",
          prevButtonAriaLabel: "Página anterior",
          nextButtonAriaLabel: "Próxima página",
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHeaderCell sortType="string" sortOrder="descending">
              Título
            </TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Criado em
            </TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Atualizado em
            </TableHeaderCell>
            <TableHeaderCell>Ação</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow key={index}>
              <TableCell headerLabel="Título">
                <a
                  href={`/pages/admin/system/posts/${article.slug}`}
                  className="text-primary-600 underline"
                >
                  {article.title}
                </a>
              </TableCell>
              <TableCell headerLabel="Status">
                <Pill variant={article.statusVariant}>
                  {article.status.toUpperCase()}
                </Pill>
              </TableCell>
              <TableCell headerLabel="Criado em">{article.createdAt}</TableCell>
              <TableCell headerLabel="Atualizado em">
                {article.updatedAt}
              </TableCell>
              <TableCell headerLabel="Ação">
                <div className="flex gap-[8px]">
                  <a href={`/pages/admin/system/posts/${article.slug}`}>
                    <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                  </a>
                  <a
                    href={`/pages/admin/system/posts/edit?slug=${article.slug}`}
                  >
                    <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
