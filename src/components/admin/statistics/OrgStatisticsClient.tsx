"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  CardFrame,
  CardNoResults,
  Icon,
} from "@ama-pt/agora-design-system";
import { fetchOrgMetrics } from "@/services/api";
import { OrganizationMetrics } from "@/types/api";
import { useActiveOrganization } from "@/hooks/useActiveOrganization";

export default function OrgStatisticsClient() {
  const { activeOrg, isLoading: isOrgLoading } = useActiveOrganization();

  const [metrics, setMetrics] = useState<OrganizationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeOrg) {
      setIsLoading(false);
      return;
    }
    async function loadMetrics() {
      setIsLoading(true);
      try {
        const data = await fetchOrgMetrics(activeOrg!.id);
        setMetrics(data);
      } catch (error) {
        console.error("Error loading org metrics:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, [activeOrg]);

  if (isOrgLoading || isLoading) return <p>A carregar...</p>;
  if (!activeOrg) {
    return (
      <div className="admin-page">
        <CardNoResults
          className="datasets-page__empty"
          position="center"
          icon={
            <Icon name="agora-line-buildings" className="datasets-page__empty-icon" />
          }
          description="Não pertence a nenhuma organização."
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
            { label: "Estatísticas", url: "/pages/admin/org/statistics" },
          ]}
        />
      </div>

      <h1 className="admin-page__title mt-[64px] mb-[16px]">
        Estatísticas da organização
      </h1>

      <p className="text-neutral-700 text-sm leading-relaxed mb-[24px]">
        {activeOrg.name}
      </p>

      {metrics && (
        <div className="flex flex-wrap gap-[24px] mt-[24px]">
          <div className="flex-1 min-w-[200px]">
            <CardFrame label={String(metrics.datasets)}>
              <p className="text-neutral-700 text-base">Conjuntos de dados</p>
            </CardFrame>
          </div>
          <div className="flex-1 min-w-[200px]">
            <CardFrame label={String(metrics.dataservices)}>
              <p className="text-neutral-700 text-base">API</p>
            </CardFrame>
          </div>
          <div className="flex-1 min-w-[200px]">
            <CardFrame label={String(metrics.reuses)}>
              <p className="text-neutral-700 text-base">Reutilizações</p>
            </CardFrame>
          </div>
          <div className="flex-1 min-w-[200px]">
            <CardFrame label={String(metrics.followers)}>
              <p className="text-neutral-700 text-base">Seguidores</p>
            </CardFrame>
          </div>
          <div className="flex-1 min-w-[200px]">
            <CardFrame label={String(metrics.members)}>
              <p className="text-neutral-700 text-base">Membros</p>
            </CardFrame>
          </div>
          <div className="flex-1 min-w-[200px]">
            <CardFrame label={String(metrics.views)}>
              <p className="text-neutral-700 text-base">Visualizações</p>
            </CardFrame>
          </div>
        </div>
      )}
    </div>
  );
}
