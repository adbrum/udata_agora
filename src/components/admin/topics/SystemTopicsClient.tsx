"use client";

import {
  Breadcrumb,
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
} from "@ama-pt/agora-design-system";
import PublishDropdown from "@/components/admin/PublishDropdown";

interface MockTopic {
  name: string;
  slug: string;
  createdAt: string;
  datasets: number;
  reuses: number;
}

const mockTopics: MockTopic[] = [
  {
    name: "Justiça",
    slug: "justica",
    createdAt: "15 de março de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "Defesa e Segurança",
    slug: "defesa-e-seguranca",
    createdAt: "15 de março de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "Turismo, Cultura e Esporte",
    slug: "turismo-cultura-e-esporte",
    createdAt: "15 de março de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "Transportes e Infraestruturas",
    slug: "transportes-e-infraestruturas",
    createdAt: "15 de março de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "Saúde",
    slug: "saude",
    createdAt: "15 de março de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "Governo e Administração Pública",
    slug: "governo-e-administracao-publica",
    createdAt: "15 de março de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "População e Sociedade",
    slug: "populacao-e-sociedade",
    createdAt: "15 de março de 2026",
    datasets: 0,
    reuses: 0,
  },
  {
    name: "Educação, Ciência e Tecnologia",
    slug: "educacao-ciencia-e-tecnologia",
    createdAt: "15 de março de 2026",
    datasets: 0,
    reuses: 0,
  },
];

export default function SystemTopicsClient() {
  const topics = mockTopics;

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Temas", url: "/pages/admin/system/topics" },
          ]}
        />
      </div>

      <div className="datasets-admin-page__header">
        <h1 className="datasets-admin-page__title">Temas</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {topics.length} resultados
      </p>

      <span className="text-s-bold text-neutral-900 block mb-[8px]">Pesquisar</span>
      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1">
          <InputSearchBar hasVoiceActionButton={false}
            label=""
            placeholder="Pesquise o nome do tema"
            aria-label="Pesquisar temas"
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

      <Table
        paginationProps={{
          itemsPerPageLabel: "Linhas por página",
          itemsPerPage: 10,
          totalItems: topics.length,
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
              Nome
            </TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Criado em
            </TableHeaderCell>
            <TableHeaderCell sortType="numeric" sortOrder="none">
              Conjuntos de dados
            </TableHeaderCell>
            <TableHeaderCell sortType="numeric" sortOrder="none">
              Reutilizar
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic, index) => (
            <TableRow key={index}>
              <TableCell headerLabel="Nome">
                <a
                  href={`/pages/admin/system/topics/${topic.slug}`}
                  className="text-primary-600 underline"
                >
                  {topic.name}
                </a>
              </TableCell>
              <TableCell headerLabel="Criado em">{topic.createdAt}</TableCell>
              <TableCell headerLabel="Conjuntos de dados">
                {topic.datasets}
              </TableCell>
              <TableCell headerLabel="Reutilizar">{topic.reuses}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
