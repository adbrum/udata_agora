'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Icon, Breadcrumb, Pill, ProgressBar } from '@ama-pt/agora-design-system';
import { Dataset } from '@/types/api';
import { fetchDataset, followEntity, unfollowEntity } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useActiveOrganization } from '@/hooks/useActiveOrganization';

import { DatasetTabs } from '@/components/datasets/DatasetTabs';

interface DatasetDetailClientProps {
  slug: string;
}

const DESCRIPTION_MAX_LENGTH = 400;

function DescriptionWithReadMore({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > DESCRIPTION_MAX_LENGTH;
  const displayText = !expanded && needsTruncation
    ? text.slice(0, DESCRIPTION_MAX_LENGTH) + "..."
    : text;

  return (
    <div className="prose max-w-none text-neutral-700 text-lg leading-relaxed mb-12">
      <p className="text-neutral-900 text-m-light mb-[24px]">{displayText}</p>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-8 text-primary-600 cursor-pointer hover:underline"
        >
          {expanded ? "Ler menos" : "Leia mais"}
          {expanded ? (
            <Icon name="agora-line-arrow-up-circle" className="w-24 h-24" />
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-m fill-[var(--color-primary-600)] w-32 h-32"
              aria-hidden="true"
              role="img"
            >
              <path d="M11.2929 8.70711C10.9024 8.31658 10.9024 7.68342 11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071C10.9024 16.3166 10.9024 15.6834 11.2929 15.2929L13.5858 13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H13.5858L11.2929 8.70711Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

function formatMetricValue(value: number | undefined): string {
  if (!value || value === 0) return '0';
  if (value >= 1_000_000) {
    return (value / 1_000_000).toLocaleString('pt-PT', { maximumFractionDigits: 1 }) + ' M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toLocaleString('pt-PT', { maximumFractionDigits: 1 }) + ' mil';
  }
  return value.toLocaleString('pt-PT');
}

const QUALITY_CRITERIA: [keyof NonNullable<Dataset['quality']>, string][] = [
  ['dataset_description_quality', 'Descrição'],
  ['has_resources', 'Recursos'],
  ['license', 'Licença'],
  ['update_frequency', 'Frequência'],
  ['temporal_coverage', 'Cobertura temporal'],
  ['spatial', 'Cobertura espacial'],
  ['has_open_format', 'Formato aberto'],
  ['resources_documentation', 'Documentação'],
  ['all_resources_available', 'Recursos disponíveis'],
];

function calculateQualityScore(quality?: Dataset['quality']): number {
  if (!quality) return 0;
  if (quality.score > 0) return Math.round(quality.score * 100);
  const met = QUALITY_CRITERIA.filter(([key]) => quality[key] === true).length;
  return Math.round((met / QUALITY_CRITERIA.length) * 100);
}

function getQualityDetails(quality?: Dataset['quality']): string[] {
  if (!quality) return [];
  return QUALITY_CRITERIA.filter(([key]) => quality[key] === true).map(([, label]) => label);
}

function getQualityMissing(quality?: Dataset['quality']): string[] {
  if (!quality) return QUALITY_CRITERIA.map(([, label]) => label);
  return QUALITY_CRITERIA.filter(([key]) => quality[key] !== true).map(([, label]) => label);
}

export default function DatasetDetailClient({ slug }: DatasetDetailClientProps) {
  const { user, isAdmin } = useAuth();
  const { organizations } = useActiveOrganization();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    async function loadDataset() {
      try {
        const data = await fetchDataset(slug);
        setDataset(data);
      } catch (error) {
        console.error("Error loading dataset:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDataset();
  }, [slug]);

  const handleToggleFavorite = async () => {
    if (!dataset || isTogglingFavorite) return;
    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        const success = await unfollowEntity('datasets', dataset.id);
        if (success) setIsFavorite(false);
      } else {
        const result = await followEntity('datasets', dataset.id);
        if (result) setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!dataset) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-neutral-500">Conjunto de dados não encontrado.</p>
      </div>
    );
  }

  const qualityScore = calculateQualityScore(dataset.quality);
  const qualityDetails = getQualityDetails(dataset.quality);
  const qualityMissing = getQualityMissing(dataset.quality);

  return (
    <div className="flex flex-col font-sans text-neutral-900 bg-white min-h-screen overflow-x-hidden">
      <main className="flex-grow container mx-auto px-4 pt-[64px]">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mb-[24px]">
          <Breadcrumb
            items={[
              { label: 'Home', url: '/' },
              { label: 'Conjuntos de dados', url: '/pages/datasets' },
              { label: dataset.title, url: `/pages/datasets/${dataset.slug}` }
            ]}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-[16px] mb-[24px]">
          {dataset.private && <Pill variant="warning">Rascunho</Pill>}
          {dataset.archived && <Pill variant="neutral">Arquivado</Pill>}
          <Button
            variant="primary"
            appearance={isFavorite ? 'solid' : 'outline'}
            hasIcon={true}
            leadingIcon={isFavorite ? 'agora-solid-star' : 'agora-line-star'}
            leadingIconHover="agora-solid-star"
            className="flex-shrink-0"
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          </Button>
          {(isAdmin ||
            (user && dataset.owner?.id === user.id) ||
            (dataset.organization &&
              organizations.some((org) => org.id === dataset.organization?.id))) && (
            <Link href={`/pages/admin/me/datasets/edit?id=${dataset.id}`}>
              <Button
                variant="primary"
                hasIcon={true}
                leadingIcon="agora-line-edit"
                leadingIconHover="agora-solid-edit"
              >
                Editar
              </Button>
            </Link>
          )}
        </div>


        <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32 mb-[24px]">
          {/* Main Content Column */}
          <div className="xl:col-span-6 xl:block">
            <div className="flex flex-col gap-4">
              <h1 className="text-xl-bold text-primary-900 leading-tight mb-24">
                {dataset.title}
              </h1>
            </div>

            {/* Description */}
            <DescriptionWithReadMore text={dataset.description} />

          </div>

          {/* Sidebar */}
          <div className="xl:col-span-6">
            <div className="flex flex-col h-fit">
              <div className="flex flex-col gap-16 bg-[#F2F6FF] rounded-4 p-32 mb-16">
                {dataset.organization?.logo ? (
                  <div className="w-fit h-[48px] card-article-3_2-img py-8 rounded-8 border-2 border-primary-300 flex items-center justify-center">
                    <img
                      src={dataset.organization.logo}
                      alt={dataset.organization.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-fit px-12 py-6 bg-neutral-100 rounded-8 border border-neutral-200 flex items-center justify-center text-neutral-400">
                    <Icon name="agora-line-building" className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-16">
                  <div className="text-neutral-900 text-m-light mb-[8px]">
                    {dataset.organization ? (
                      <Link
                        href={`/pages/organizations/${dataset.organization.slug}`}
                        className="hover:underline"
                      >
                        {dataset.organization.name}
                      </Link>
                    ) : (
                      'Organização Desconhecida'
                    )}
                  </div>
                  <div className="text-neutral-900 text-sm mb-[16px]">
                    <span className="text-m-semibold">Última atualização:</span>{' '}
                    {new Date(dataset.last_modified).toLocaleDateString('pt-PT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  {dataset.license && (
                    <div className="text-sm">
                      <a
                        href={dataset.license_url || `https://dados.gov.pt/pt/licenses/${dataset.license}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 underline"
                      >
                        <span className="text-m-semibold">Licença:</span>{' '}
                        {dataset.license}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-16 mb-16">
                <div className="bg-[#F2F6FF] rounded-4 p-32">
                  <div className="text-sm mb-[8px]">Vistas</div>
                  <div className="text-l-semibold font-bold text-neutral-900 mb-[8px]">
                    {formatMetricValue(dataset.metrics?.views)}
                  </div>
                </div>
                <div className="bg-[#F2F6FF] rounded-4 p-32">
                  <div className="text-sm mb-[8px]">Downloads</div>
                  <div className="text-l-semibold font-bold text-neutral-900 mb-[8px]">
                    {formatMetricValue(dataset.metrics?.resources_downloads)}
                  </div>
                </div>
              </div>

              {/* Quality */}
              <div className="bg-[#F2F6FF] rounded-4 p-32 mb-16">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-l-semibold font-bold text-neutral-900 mb-[8px]">
                    Qualidade dos metadados
                  </h3>
                </div>
                <div className={qualityScore <= 45 ? "quality-progress-warning" : ""}>
                  <ProgressBar value={qualityScore} max={100} hidePercentageValue={true} />
                </div>
                <div className="text-xs text-neutral-700 mt-8">
                  {qualityScore}%
                  {qualityDetails.length > 0 && ` (${qualityDetails.join(', ')})`}
                </div>
                {qualityMissing.length > 0 && (
                  <div className="flex flex-col gap-8 mt-16">
                    {qualityMissing.map((label) => (
                      <div key={label} className="flex items-center gap-8">
                        <Icon name="agora-line-alert-triangle" className="w-[20px] h-[20px] fill-[#B06112]" />
                        <span className="text-neutral-900 text-base">{label} dos dados não preenchidos</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <DatasetTabs dataset={dataset} />
      </main>
    </div>
  );
}
