"use client";

import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
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
import PublishDropdown from "@/components/admin/PublishDropdown";

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
  const articles = mockArticles;

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Artigos", url: "/pages/admin/system/posts" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Artigos</h1>
        <div className="flex items-center gap-[16px]">
          <PublishDropdown />
        </div>
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {articles.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="w-[60%]">
          <InputSearchBar hasVoiceActionButton={false}
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
          appearance="outline"
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
