"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  CardNoResults,
  Icon,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Pill,
  Button,
} from "@ama-pt/agora-design-system";
import { fetchMyCommunityResources } from "@/services/api";
import { CommunityResource } from "@/types/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PublishDropdown from "@/components/admin/PublishDropdown";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

export default function CommunityResourcesClient() {
  const { displayName } = useCurrentUser();

  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      setIsLoading(true);
      try {
        const response = await fetchMyCommunityResources(1, 9999);
        setResources(response.data || []);
      } catch (error) {
        console.error("Error loading community resources:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadResources();
  }, []);

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: displayName || "...", url: "#" },
            { label: "Recursos comunitários", url: "/pages/admin/community-resources" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Recursos comunitários</h1>
        <PublishDropdown />
      </div>


      {!isLoading && resources.length > 0 ? (
        <Table
          paginationProps={{
            itemsPerPageLabel: "Linhas por página",
            itemsPerPage: 5,
            totalItems: resources.length,
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
              <TableHeaderCell>Formato</TableHeaderCell>
              <TableHeaderCell>Dataset</TableHeaderCell>
              <TableHeaderCell sortType="date" sortOrder="none">
                Criado em
              </TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource, index) => (
              <TableRow key={index}>
                <TableCell headerLabel="Título">
                  <span className="text-neutral-900">{resource.title}</span>
                </TableCell>
                <TableCell headerLabel="Formato">
                  <Pill variant="neutral">{resource.format || "—"}</Pill>
                </TableCell>
                <TableCell headerLabel="Dataset">
                  {resource.dataset ? (
                    <a
                      href={`/pages/datasets/${resource.dataset.id}`}
                      className="text-primary-600 underline"
                    >
                      {resource.dataset.title}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell headerLabel="Criado em">
                  {formatDate(resource.created_at)}
                  <br />
                  <span className="text-sm text-neutral-500">
                    por{" "}
                    {resource.owner
                      ? `${resource.owner.first_name} ${resource.owner.last_name}`
                      : "—"}
                  </span>
                </TableCell>
                <TableCell headerLabel="Ações">
                  <div className="flex gap-[8px]">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="datasets-page__body">
          <div className="datasets-page__content">
            <CardNoResults
              className="datasets-page__empty"
              position="center"
              icon={
                <Icon name="agora-line-user-group" className="w-12 h-12 text-primary-500 icon-xl" />
              }
              title="Sem publicações"
              description="Ainda não publicou um recurso comunitário."
              hasAnchor={false}
              extraDescription={
                <div className="mt-24">
                  <Button
                    variant="primary"
                    appearance="outline"
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
