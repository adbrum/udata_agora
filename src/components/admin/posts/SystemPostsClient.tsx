"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  CardNoResults,
  Icon,
  InputSearchBar,
  InputSelect,
  DropdownSection,
  DropdownOption,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@ama-pt/agora-design-system";
import StatusDot from "@/components/admin/StatusDot";
import PublishDropdown from "@/components/admin/PublishDropdown";
import { fetchPosts } from "@/services/api";
import { Post } from "@/types/api";

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

export default function SystemPostsClient() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchPosts(currentPage, pageSize);
      let data = response.data || [];
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        data = data.filter((p) => p.name.toLowerCase().includes(q));
      }
      if (typeFilter) {
        data = data.filter((p) => {
          if (typeFilter === "news") return p.kind !== "page";
          if (typeFilter === "page") return p.kind === "page";
          return true;
        });
      }
      setPosts(data);
      setTotalItems(searchQuery.trim() || typeFilter ? data.length : response.total || 0);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, typeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 400);
  };

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            { label: "Artigos", url: "/pages/admin/system/posts" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Artigos</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {totalItems} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="admin-search-wrapper">
          <InputSearchBar
            hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o título do artigo"
            aria-label="Pesquisar artigos"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearch(e.target.value);
            }}
          />
        </div>
        <InputSelect
          label=""
          hideLabel
          placeholder="Todos"
          id="filter-type"
          onChange={(options) => {
            setTypeFilter(
              options.length > 0 ? (options[0].value as string) : ""
            );
            setCurrentPage(1);
          }}
        >
          <DropdownSection name="type">
            <DropdownOption value="">Todos</DropdownOption>
            <DropdownOption value="news">Notícias</DropdownOption>
            <DropdownOption value="page">Página</DropdownOption>
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

      {isLoading ? (
        <p className="text-neutral-700 text-sm">A carregar...</p>
      ) : posts.length > 0 ? (
        <Table
          paginationProps={{
            itemsPerPageLabel: "Linhas por página",
            itemsPerPage: pageSize,
            totalItems: totalItems,
            availablePageSizes: [5, 10, 20],
            currentPage: currentPage,
            buttonDropdownAriaLabel: "Selecionar linhas por página",
            dropdownListAriaLabel: "Opções de linhas por página",
            prevButtonAriaLabel: "Página anterior",
            nextButtonAriaLabel: "Próxima página",
            onPageChange: (page: number) => setCurrentPage(page),
            onPageSizeChange: (size: number) => {
              setPageSize(size);
              setCurrentPage(1);
            },
          }}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Título</TableHeaderCell>
              <TableHeaderCell>Tipo</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell>Criado em</TableHeaderCell>
              <TableHeaderCell>Atualizado em</TableHeaderCell>
              <TableHeaderCell>Ação</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell headerLabel="Título">
                  <a
                    href={`/pages/posts/${post.slug}`}
                    className="text-primary-600 underline"
                  >
                    {post.name}
                  </a>
                </TableCell>
                <TableCell headerLabel="Tipo">
                  {post.kind === "page" ? "Página" : "Notícias"}
                </TableCell>
                <TableCell headerLabel="Estado">
                  <StatusDot variant={post.published ? "success" : "warning"}>
                    {post.published ? "Publicado" : "Rascunho"}
                  </StatusDot>
                </TableCell>
                <TableCell headerLabel="Criado em">
                  {formatDate(post.created_at)}
                </TableCell>
                <TableCell headerLabel="Atualizado em">
                  {formatDate(post.last_modified)}
                </TableCell>
                <TableCell headerLabel="Ação">
                  <div className="flex gap-[8px]">
                    <a href={`/pages/posts/${post.slug}`}>
                      <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                    </a>
                    <a href={`/pages/admin/posts/${post.id}`}>
                      <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <CardNoResults
          position="center"
          icon={
            <Icon
              name="agora-line-edit"
              className="w-12 h-12 text-primary-500 icon-xl"
            />
          }
          title="Sem artigos"
          description="Nenhum artigo encontrado."
          hasAnchor={false}
        />
      )}
    </div>
  );
}
