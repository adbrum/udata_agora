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
  Pill,
} from "@ama-pt/agora-design-system";
import PublishDropdown from "@/components/admin/PublishDropdown";

interface MockHarvester {
  name: string;
  slug: string;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "informative";
  implementation: string;
  createdAt: string;
  lastExecution: string;
  datasets: number;
  api: number;
}

const mockHarvesters: MockHarvester[] = [
  {
    name: "Teste Title",
    slug: "teste-title",
    status: "Em espera de validação",
    statusVariant: "warning",
    implementation: "dgt",
    createdAt: "16 de janeiro de 2026",
    lastExecution: "Ainda não",
    datasets: 0,
    api: 0,
  },
  {
    name: "Teste",
    slug: "teste",
    status: "Sem tarefa de momento",
    statusVariant: "informative",
    implementation: "dgt",
    createdAt: "16 de janeiro de 2026",
    lastExecution: "Ainda não",
    datasets: 0,
    api: 0,
  },
  {
    name: "INE HVD - Instituto Nacional de Estatística",
    slug: "ine-hvd",
    status: "Terminado",
    statusVariant: "success",
    implementation: "inehvd",
    createdAt: "6 de novembro de 2025",
    lastExecution: "6 de janeiro de 2026",
    datasets: 36,
    api: 0,
  },
  {
    name: "Harvested",
    slug: "harvested",
    status: "Suprimido",
    statusVariant: "danger",
    implementation: "ckan",
    createdAt: "3 de novembro de 2025",
    lastExecution: "Ainda não",
    datasets: 0,
    api: 0,
  },
  {
    name: "IFAP - Inst de Financ. da Agri. e das Pescas (DGT)",
    slug: "ifap-dgt",
    status: "Terminado",
    statusVariant: "success",
    implementation: "dgt",
    createdAt: "26 de fevereiro de 2025",
    lastExecution: "5 de janeiro de 2026",
    datasets: 6,
    api: 0,
  },
  {
    name: "IPRA - Inst. da Seg. Soc. dos Açores (DGT)",
    slug: "ipra-dgt",
    status: "Falhado",
    statusVariant: "danger",
    implementation: "dgt",
    createdAt: "22 de agosto de 2024",
    lastExecution: "6 de janeiro de 2026",
    datasets: 0,
    api: 0,
  },
  {
    name: "PG Pres do Gov Reg Açores (DGT)",
    slug: "pg-pres-gov-reg-acores-dgt",
    status: "Falhado",
    statusVariant: "danger",
    implementation: "dgt",
    createdAt: "23 de julho de 2024",
    lastExecution: "5 de janeiro de 2026",
    datasets: 0,
    api: 0,
  },
];

export default function SystemHarvestersClient() {
  const harvesters = mockHarvesters;

  return (
    <div className="admin-page">
      <div className="admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Sistema", url: "#" },
            { label: "Harvesters", url: "/pages/admin/system/harvesters" },
          ]}
        />
      </div>

      <div className="admin-page__header">
        <h1 className="admin-page__title">Harvesters</h1>
        <PublishDropdown />
      </div>

      <p className="text-neutral-700 text-sm mb-[16px]">
        {harvesters.length} resultados
      </p>

      <div className="flex items-end gap-[16px] mb-[24px]">
        <div className="admin-search-wrapper">
          <InputSearchBar hasVoiceActionButton={false}
            label="Pesquisar"
            placeholder="Pesquise o nome do harvester"
            aria-label="Pesquisar harvesters"
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
          totalItems: harvesters.length,
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
            <TableHeaderCell>Estatuto</TableHeaderCell>
            <TableHeaderCell>Implementação</TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Criado em
            </TableHeaderCell>
            <TableHeaderCell sortType="date" sortOrder="none">
              Última execução
            </TableHeaderCell>
            <TableHeaderCell sortType="numeric" sortOrder="none">
              Conjuntos de dados
            </TableHeaderCell>
            <TableHeaderCell sortType="numeric" sortOrder="none">
              API
            </TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {harvesters.map((harvester, index) => (
            <TableRow key={index}>
              <TableCell headerLabel="Nome">
                <a
                  href={`/pages/admin/system/harvesters/${harvester.slug}`}
                  className="text-primary-600 underline"
                >
                  {harvester.name}
                </a>
              </TableCell>
              <TableCell headerLabel="Estatuto">
                <Pill variant={harvester.statusVariant}>{harvester.status}</Pill>
              </TableCell>
              <TableCell headerLabel="Implementação">
                {harvester.implementation}
              </TableCell>
              <TableCell headerLabel="Criado em">{harvester.createdAt}</TableCell>
              <TableCell headerLabel="Última execução">
                {harvester.lastExecution}
              </TableCell>
              <TableCell headerLabel="Conjuntos de dados">
                <a href="#" className="text-primary-600 underline">
                  {harvester.datasets}
                </a>
              </TableCell>
              <TableCell headerLabel="API">
                <a href="#" className="text-primary-600 underline">
                  {harvester.api}
                </a>
              </TableCell>
              <TableCell headerLabel="Ações">
                <div className="flex gap-[8px]">
                  <a href={`/pages/admin/system/harvesters/${harvester.slug}`}>
                    <Icon name="agora-line-eye" className="w-[20px] h-[20px]" />
                  </a>
                  <a
                    href={`/pages/admin/system/harvesters/edit?slug=${harvester.slug}`}
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
