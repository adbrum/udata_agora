"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Avatar,
  Breadcrumb,
  Button,
  CardLinks,
  CardNoResults,
  Icon,
  Pill,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@ama-pt/agora-design-system";
import { Dataset, Reuse } from "@/types/api";
import { fetchMyDatasets, fetchMyReuses } from "@/services/api";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default function PublicProfileClient() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const isOwnProfile = user?.slug === slug;
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [reuses, setReuses] = useState<Reuse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dsResponse, reuseResponse] = await Promise.all([
          fetchMyDatasets(1, 100),
          fetchMyReuses(1, 100),
        ]);
        setDatasets(dsResponse.data || []);
        setReuses(reuseResponse.data || []);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch {
      return dateStr;
    }
  };

  const userName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : "";
  const initials = user
    ? `${user.first_name?.charAt(0).toUpperCase() ?? ""}${user.last_name?.charAt(0).toUpperCase() ?? ""}`
    : "U";

  return (
    <div className="container mx-auto">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Início", url: "/" },
            { label: userName || "Perfil", url: "#" },
          ]}
        />
      </div>

      <h1 className="admin-page__title mt-[64px] mb-[32px]">Perfil</h1>

      {/* Profile Card */}
      <div className="profile-card">
        <Avatar
          avatarType={user?.avatar_thumbnail ? "image" : "initials"}
          srcPath={
            (user?.avatar_thumbnail || initials) as unknown as undefined
          }
          alt={userName}
          className="profile-card__avatar"
        />

        <div className="profile-card__body">
          <div className="profile-card__info">
            {user?.organizations && user.organizations.length > 0 && (
              <p className="text-neutral-900 text-base font-light leading-7">
                {user.organizations[0].name}
              </p>
            )}
            <p className="text-neutral-900 text-xl font-semibold leading-8">
              {userName}
            </p>
            {user?.last_modified && (
              <p className="text-neutral-900 text-base leading-7">
                <span className="font-semibold">Última atualização:</span>{" "}
                {formatDate(user.last_modified)}
              </p>
            )}
          </div>

          <div className="profile-card__links">
            <Button
              appearance="link"
              variant="primary"
              hasIcon
              leadingIcon="agora-line-package"
              leadingIconHover="agora-solid-package"
            >
              0 Subscrições
            </Button>
            <Button
              appearance="link"
              variant="primary"
              hasIcon
              leadingIcon="agora-line-tag"
              leadingIconHover="agora-solid-tag"
            >
              0 Acompanhamentos
            </Button>
          </div>

          {isOwnProfile && (
            <div className="absolute top-[32px] right-[32px]">
              <Button
                variant="primary"
                appearance="solid"
                hasIcon={true}
                leadingIcon="agora-line-edit"
                leadingIconHover="agora-solid-edit"
                onClick={() => router.push("/pages/admin/profile")}
              >
                Editar o meu perfil
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Datasets Section */}
      <div className="mt-[48px]">
        <h2 className="font-medium text-neutral-900 text-base uppercase mb-24">
          {datasets.length} {datasets.length === 1 ? "Conjunto de dados" : "Conjuntos de dados"}
        </h2>

        {isLoading ? (
          <p className="text-neutral-900">A carregar...</p>
        ) : datasets.length === 0 ? (
          <CardNoResults
            position="center"
            icon={<Icon name="agora-line-file" className="w-[40px] h-[40px] text-primary-500 icon-xl" />}
            title="Sem conjuntos de dados"
            description="Este utilizador ainda não publicou conjuntos de dados."
            hasAnchor={false}
          />
        ) : (
          <Table
            paginationProps={{
              itemsPerPageLabel: "Linhas por página",
              itemsPerPage: 10,
              totalItems: datasets.length,
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
                <TableHeaderCell sortType="string">
                  Título do conjunto de dados
                </TableHeaderCell>
                <TableHeaderCell>Ficheiros</TableHeaderCell>
                <TableHeaderCell sortType="string">
                  Sigla da Entidade
                </TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell sortType="date">
                  Data de criação
                </TableHeaderCell>
                <TableHeaderCell sortType="date">
                  Data de alteração
                </TableHeaderCell>
                <TableHeaderCell>{""}</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell headerLabel="Título">
                    {dataset.title}
                  </TableCell>
                  <TableCell headerLabel="Ficheiros">
                    {dataset.resources?.length || 0}
                  </TableCell>
                  <TableCell headerLabel="Sigla da Entidade">
                    {dataset.organization?.acronym || dataset.organization?.name || "—"}
                  </TableCell>
                  <TableCell headerLabel="Estado">
                    <div className="flex items-center gap-8">
                      <span className="text-success-600">●</span>
                      <span>Público</span>
                    </div>
                  </TableCell>
                  <TableCell headerLabel="Data de criação">
                    {formatShortDate(dataset.created_at)}
                  </TableCell>
                  <TableCell headerLabel="Data de alteração">
                    {formatShortDate(dataset.last_modified || dataset.created_at)}
                  </TableCell>
                  <TableCell headerLabel="">
                    <Link
                      href={`/pages/datasets/${dataset.slug}`}
                      className="text-primary-600 underline"
                    >
                      Consultar
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Reuses Section */}
      <div className="mt-[48px]">
        <h2 className="font-medium text-neutral-900 text-base uppercase mb-24">
          {reuses.length} {reuses.length === 1 ? "Reutilização" : "Reutilizações"}
        </h2>

        {isLoading ? (
          <p className="text-neutral-900">A carregar...</p>
        ) : reuses.length === 0 ? (
          <CardNoResults
            position="center"
            icon={<img src="/Icons/bar_chart.svg" alt="" className="w-[40px] h-[40px]" />}
            title="Sem reutilizações"
            description="Este utilizador ainda não publicou reutilizações."
            hasAnchor={false}
          />
        ) : (
          <div className="grid grid-cols-2 agora-card-links-datasets-px0 gap-24">
            {reuses.map((reuse) => (
              <div key={reuse.id} className="h-full">
                <CardLinks
                  onClick={() => (window.location.href = `/pages/reuses/${reuse.slug}`)}
                  className="cursor-pointer text-neutral-900"
                  variant="transparent"
                  image={{
                    src: reuse.image_thumbnail || reuse.image || "/laptop.png",
                    alt: reuse.title,
                  }}
                  category={reuse.organization?.name || userName}
                  title={<div className="underline text-xl-bold">{reuse.title}</div>}
                  description={
                    reuse.description ? (
                      <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                        {reuse.description}
                      </p>
                    ) : undefined
                  }
                  date={
                    <span className="font-[300]">
                      Atualizado {formatDate(reuse.last_modified || reuse.created_at)}
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
                      children: reuse.metrics?.views?.toLocaleString("pt-PT") || "0",
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
        )}
      </div>
    </div>
  );
}
