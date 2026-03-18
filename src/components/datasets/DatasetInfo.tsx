"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Icon } from "@ama-pt/agora-design-system";
import { Dataset } from "@/types/api";

interface DatasetInfoProps {
  dataset: Dataset;
}

const frequencyMap: Record<string, string> = {
  unknown: "Desconhecida",
  punctual: "Pontual",
  continuous: "Contínua",
  hourly: "Horária",
  fourTimesADay: "4 vezes ao dia",
  threeTimesADay: "3 vezes ao dia",
  semidaily: "Semidiária",
  daily: "Diária",
  fourTimesAWeek: "4 vezes por semana",
  threeTimesAWeek: "3 vezes por semana",
  semiweekly: "Bissemanal",
  weekly: "Semanal",
  biweekly: "Quinzenal",
  threeTimesAMonth: "3 vezes por mês",
  semimonthly: "Bimensal",
  monthly: "Mensal",
  bimonthly: "Bimestral",
  quarterly: "Trimestral",
  threeTimesAYear: "3 vezes por ano",
  semiannual: "Semestral",
  annual: "Anual",
  biennial: "Bienal",
  triennial: "Trienal",
  quinquennial: "Quinquenal",
  irregular: "Irregular",
};

const granularityMap: Record<string, string> = {
  "poi": "Ponto de interesse",
  "other": "Outro",
  "country": "País",
  "canton": "Cantão",
  "town": "Cidade",
  "epci": "EPCI",
  "iris": "IRIS",
  "commune": "Município",
  "fr:commune": "Município",
  "fr:departement": "Departamento",
  "fr:region": "Região",
  "fr:arrondissement": "Distrito",
};

const licenseMap: Record<string, string> = {
  "cc-by": "Creative Commons Attribution",
  "cc-by-sa": "Creative Commons Attribution Share-Alike",
  "cc-zero": "Creative Commons Zero",
  "fr-lo": "Licence Ouverte / Open Licence",
  "odc-by": "Open Data Commons Attribution",
  "odc-odbl": "Open Data Commons Open Database License",
  "odc-pddl": "Open Data Commons Public Domain Dedication and License",
  "notspecified": "Não especificada",
};

const formatZone = (zone: string): string => {
  const parts = zone.split(":");
  if (parts.length === 2) {
    return parts[1].toUpperCase();
  }
  return zone;
};

const formatDate = (dateStr: string): string => {
  try {
    return format(new Date(dateStr), "d 'de' MMMM 'de' yyyy", { locale: pt });
  } catch {
    return dateStr;
  }
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center ml-8 text-primary-600 hover:text-primary-800"
      title={copied ? "Copiado!" : "Copiar"}
    >
      {copied ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
};

export const DatasetInfo: React.FC<DatasetInfoProps> = ({ dataset }) => {
  if (!dataset) return null;

  const hasInfo =
    dataset.tags?.length > 0 || dataset.id || dataset.license;
  const hasTemporal =
    dataset.created_at || dataset.frequency || dataset.last_modified;
  const hasSpatial =
    dataset.spatial?.zones?.length || dataset.spatial?.granularity;

  const embedCode = `<div data-udata-dataset="${dataset.id}"></div><script data-udata="https://dados.gov.pt/" src="https://dados.gov.pt/oembed.js" async defer></script>`;

  return (
    <div className="bg-white rounded-8 p-32">
      {/* INFORMAÇÃO */}
      {hasInfo && (
        <div>
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider mb-16">
            Informação
          </h3>
          <div className="grid grid-cols-3 gap-24">
            {dataset.tags?.length > 0 && (
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-8">
                  Palavras-chave
                </p>
                <div className="flex flex-wrap gap-8">
                  {dataset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block border border-neutral-300 rounded-4 px-8 py-4 text-sm text-neutral-900"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {dataset.id && (
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-8">
                  Identificador
                </p>
                <div className="flex items-center">
                  <span className="text-neutral-900 text-sm">{dataset.id}</span>
                  <CopyButton text={dataset.id} />
                </div>
              </div>
            )}
            {dataset.license && (
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-8">
                  Licença
                </p>
                <span className="text-neutral-900 text-sm">
                  {licenseMap[dataset.license] || dataset.license}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEMPORALIDADE */}
      {hasTemporal && (
        <div className="mt-32">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider mb-16">
            Temporalidade
          </h3>
          <div className="grid grid-cols-3 gap-24">
            {dataset.created_at && (
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-8">
                  Criação
                </p>
                <span className="text-neutral-900 text-sm">
                  {formatDate(dataset.created_at)}
                </span>
              </div>
            )}
            {dataset.frequency && (
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-8">
                  Frequência
                </p>
                <span className="text-neutral-900 text-sm">
                  {frequencyMap[dataset.frequency] || dataset.frequency}
                </span>
              </div>
            )}
            {dataset.last_modified && (
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-8">
                  Última atualização
                </p>
                <span className="text-neutral-900 text-sm">
                  {formatDate(dataset.last_modified)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COBERTURA ESPACIAL */}
      {hasSpatial && (
        <div className="mt-32">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider mb-16">
            Cobertura espacial
          </h3>
          <div className="grid grid-cols-3 gap-24">
            {dataset.spatial?.zones && dataset.spatial.zones.length > 0 && (
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-8">
                  Zonas
                </p>
                <span className="text-primary-600 text-sm">
                  {dataset.spatial.zones.map(formatZone).join(", ")}
                </span>
              </div>
            )}
            {dataset.spatial?.granularity && (
              <div>
                <p className="font-bold text-neutral-900 text-sm mb-8">
                  Granularidade da cobertura territorial
                </p>
                <span className="text-neutral-900 text-sm">
                  {granularityMap[dataset.spatial.granularity] ||
                    dataset.spatial.granularity}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INTEGRE-O AO SEU SITE */}
      <div className="mt-32">
        <div className="flex items-center gap-8 mb-16">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
            Integre-o ao seu site.
          </h3>
          <CopyButton text={embedCode} />
        </div>
        <div className="bg-neutral-100 rounded-8 p-16">
          <code className="text-sm text-neutral-900 break-all">{embedCode}</code>
        </div>
      </div>
    </div>
  );
};
