"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Breadcrumb,
  CardNoResults,
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
  Button,
} from "@ama-pt/agora-design-system";
import { fetchOrgReuses } from "@/services/api";
import { Reuse } from "@/types/api";
import { useActiveOrganization } from "@/hooks/useActiveOrganization";
import PublishDropdown from "@/components/admin/PublishDropdown";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

export default function OrgReusesClient() {
  const { activeOrg, isLoading: isOrgLoading } = useActiveOrganization();

  const [reuses, setReuses] = useState<Reuse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (!activeOrg) {
      setIsLoading(false);
      return;
    }
    async function loadReuses() {
      setIsLoading(true);
      try {
        const data = await fetchOrgReuses(activeOrg!.id);
        setReuses(data || []);
      } catch (error) {
        console.error("Error loading org reuses:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReuses();
  }, [activeOrg]);

  const totalPages = Math.ceil(reuses.length / itemsPerPage);
  const paginatedReuses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return reuses.slice(start, start + itemsPerPage);
  }, [reuses, currentPage, itemsPerPage]);

  if (isOrgLoading) return <p>A carregar...</p>;
  if (!activeOrg) {
    return (
      <div className="admin-page">
        <CardNoResults
          className="datasets-page__empty"
          position="center"
          icon={
            <Icon name="agora-line-edit" className="w-12 h-12 text-primary-500 icon-xl" />
          }
          title="Sem publicações"
          description="Não pertence a nenhuma organização."
          hasAnchor={false}
        />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Organização", url: "#" },
            { label: "Reutilizações", url: "/pages/admin/org/reuses" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Reutilizações</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {reuses.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="w-[60%]">
          <InputSearchBar hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o nome da reutilização"
            aria-label="Pesquisar reutilizações"
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
      </div>

      {isLoading ? (
        <p>A carregar...</p>
      ) : reuses.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell sortType="string" sortOrder="descending">
                  Título da reutilização
                </TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell sortType="date" sortOrder="none">
                  Criado em
                </TableHeaderCell>
                <TableHeaderCell sortType="numeric" sortOrder="descending">
                  Conjuntos de dados
                </TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReuses.map((reuse, index) => (
                <TableRow key={index}>
                  <TableCell headerLabel="Título">
                    <a
                      href={`/pages/reuses/${reuse.slug}`}
                      className="text-primary-600 underline"
                    >
                      {reuse.title}
                    </a>
                  </TableCell>
                  <TableCell headerLabel="Estado">
                    <Pill variant="success">Público</Pill>
                  </TableCell>
                  <TableCell headerLabel="Criado em">
                    {formatDate(reuse.created_at)}
                    <br />
                    <span className="text-sm text-neutral-500">
                      sobre{" "}
                      <span className="text-success-600">●</span>{" "}
                      {reuse.owner
                        ? `${reuse.owner.first_name} ${reuse.owner.last_name}`
                        : "—"}
                    </span>
                  </TableCell>
                  <TableCell headerLabel="Conjuntos de dados">
                    {reuse.datasets?.length ?? 0}
                  </TableCell>
                  <TableCell headerLabel="Ações">
                    <div className="flex gap-[8px]">
                      <a href={`/pages/reuses/${reuse.slug}`}>
                        <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                      </a>
                      <a href={`/pages/admin/org/reuses/edit?slug=${reuse.slug}`}>
                        <Icon name="agora-line-edit" className="w-[20px] h-[20px]" />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-[16px] py-[12px] border-t border-neutral-200">
            <div className="flex items-center gap-[8px]">
              <span className="text-sm text-neutral-600">Linhas por página</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-neutral-300 rounded px-[8px] py-[4px] text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-sm text-neutral-600">
                {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, reuses.length)} de {reuses.length}
              </span>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-[4px] text-primary-600 disabled:text-neutral-300" aria-label="Página anterior">
                <Icon name="agora-line-arrow-left" className="w-[20px] h-[20px]" />
              </button>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-[4px] text-primary-600 disabled:text-neutral-300" aria-label="Próxima página">
                <Icon name="agora-line-arrow-right" className="w-[20px] h-[20px]" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="datasets-page__body">
          <div className="datasets-page__content">
            <CardNoResults
              className="datasets-page__empty"
              position="center"
              icon={
                <Icon name="agora-line-edit" className="w-12 h-12 text-primary-500 icon-xl" />
              }
              title="Sem publicações"
              description="A organização ainda não publicou uma reutilização."
              hasAnchor={false}
              extraDescription={
                <div className="mt-24">
                  <Button
                    variant="primary"
                    appearance="outline"
                    onClick={() => window.location.href = '/pages/admin/org/reuses/new'}
                  >
                    Publique no portal
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
