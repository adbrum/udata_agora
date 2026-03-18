"use client";

import {
  Breadcrumb,
  CardFrame,
  CardNoResults,
  Icon,
  InputSearchBar,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@ama-pt/agora-design-system";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PublishDropdown from "@/components/admin/PublishDropdown";

export default function StatisticsClient() {
  const { displayName } = useCurrentUser();
  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: displayName || "...", url: "#" },
            { label: "Estatísticas", url: "/pages/admin/statistics" },
          ]}
        />
      </div>

      <h1 className="datasets-admin-page__title mt-[64px] mb-[16px]">Estatísticas</h1>

      <p className="text-neutral-700 text-sm leading-relaxed mb-[24px]">
        As estatísticas foram compiladas a partir de julho de 2022
        <br />
        e atualizadas esta manhã.
      </p>

      <Tabs>
        <Tab active>
          <TabHeader>Utilizador</TabHeader>
          <TabBody>
            <div className="flex gap-[24px] mt-[48px]">
              <div className="flex-1">
                <CardFrame label="0">
                  <p className="text-neutral-700 text-base">Conjuntos de dados</p>
                </CardFrame>
              </div>
              <div className="flex-1">
                <CardFrame label="0">
                  <p className="text-neutral-700 text-base">API</p>
                </CardFrame>
              </div>
              <div className="flex-1">
                <CardFrame label="0">
                  <p className="text-neutral-700 text-base">Reutilizar</p>
                </CardFrame>
              </div>
            </div>
          </TabBody>
        </Tab>
        <Tab>
          <TabHeader>Conjuntos de dados</TabHeader>
          <TabBody>
            <div className="mt-[24px]">
              <div className="flex justify-end mb-[16px]">
                <InputSearchBar hasVoiceActionButton={false}
                  label="Pesquisar"
                  placeholder="Pesquisar"
                  aria-label="Pesquisar conjuntos de dados"
                />
              </div>
              <Table
                paginationProps={{
                  itemsPerPageLabel: "Itens por página",
                  itemsPerPage: 10,
                  totalItems: 1,
                  availablePageSizes: [5, 10, 20],
                  currentPage: 1,
                  buttonDropdownAriaLabel: "Selecionar itens por página",
                  dropdownListAriaLabel: "Opções de itens por página",
                  prevButtonAriaLabel: "Página anterior",
                  nextButtonAriaLabel: "Próxima página",
                }}
              >
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>TÍTULO DO CONJUNTO DE DADOS</TableHeaderCell>
                    <TableHeaderCell sortType="numeric" sortOrder="none">
                      <Icon name="agora-line-chat" className="w-[16px] h-[16px]" />
                    </TableHeaderCell>
                    <TableHeaderCell sortType="numeric" sortOrder="none">
                      <Icon name="agora-line-eye" className="w-[16px] h-[16px]" />
                    </TableHeaderCell>
                    <TableHeaderCell sortType="numeric" sortOrder="none">
                      <Icon name="agora-line-download" className="w-[16px] h-[16px]" />
                    </TableHeaderCell>
                    <TableHeaderCell sortType="numeric" sortOrder="none">
                      <Icon name="agora-line-trending-up" className="w-[16px] h-[16px]" />
                    </TableHeaderCell>
                    <TableHeaderCell sortType="numeric" sortOrder="none">
                      <Icon name="agora-line-star" className="w-[16px] h-[16px]" />
                    </TableHeaderCell>
                    <TableHeaderCell>
                      <Icon name="agora-line-download" className="w-[16px] h-[16px]" />
                    </TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell headerLabel="Título">
                      <a href="#" className="text-primary-600 underline">ddd</a>
                    </TableCell>
                    <TableCell headerLabel="Discussões">0</TableCell>
                    <TableCell headerLabel="Visualizações">0</TableCell>
                    <TableCell headerLabel="Downloads">0</TableCell>
                    <TableCell headerLabel="Tendências">0</TableCell>
                    <TableCell headerLabel="Favoritos">0</TableCell>
                    <TableCell headerLabel="Exportar">
                      <Icon name="agora-line-download" className="w-[16px] h-[16px]" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabBody>
        </Tab>
        <Tab>
          <TabHeader>API</TabHeader>
          <TabBody>
            <div className="mt-[24px]">
              <div className="datasets-admin-page__header">
                <h2 className="datasets-admin-page__title">API</h2>
                <PublishDropdown />
              </div>

              <div className="datasets-page__body mt-[24px]">
                <div className="datasets-page__sidebar">
                  <p className="datasets-page__count">
                    <strong>0 API</strong>
                  </p>
                  <InputSearchBar hasVoiceActionButton={false}
                    label="Pesquisar"
                    placeholder="Pesquisar"
                    aria-label="Pesquisar APIs"
                  />
                </div>

                <div className="datasets-page__content">
                  <CardNoResults
                    className="datasets-page__empty"
                    position="center"
                    icon={
                      <Icon name="agora-line-edit" className="w-12 h-12 text-primary-500 icon-xl" />
                    }
                    title="Sem publicações"
                    description="Ainda não publicou uma API."
                    hasAnchor={false}
                    extraDescription={
                      <div className="mt-24">
                        <Button
                          variant="primary"
                          appearance="outline"
                          onClick={() => window.location.href = '/pages/admin/dataservices/new'}
                        >
                          Publique no portal
                        </Button>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </TabBody>
        </Tab>
        <Tab>
          <TabHeader>Reutilizar</TabHeader>
          <TabBody>
            <div className="mt-[24px]">
              <div className="datasets-admin-page__header">
                <h2 className="datasets-admin-page__title">Reutilizações</h2>
                <PublishDropdown />
              </div>

              <div className="datasets-page__body mt-[24px]">
                <div className="datasets-page__sidebar">
                  <p className="datasets-page__count">
                    <strong>0 REUTILIZAÇÕES</strong>
                  </p>
                  <InputSearchBar hasVoiceActionButton={false}
                    label="Pesquisar"
                    placeholder="Pesquisar"
                    aria-label="Pesquisar reutilizações"
                  />
                </div>

                <div className="datasets-page__content">
                  <CardNoResults
                    className="datasets-page__empty"
                    position="center"
                    icon={
                      <Icon name="agora-line-edit" className="w-12 h-12 text-primary-500 icon-xl" />
                    }
                    title="Sem publicações"
                    description="Ainda não publicou uma reutilização."
                    hasAnchor={false}
                    extraDescription={
                      <div className="mt-24">
                        <Button
                          variant="primary"
                          appearance="outline"
                          onClick={() => window.location.href = '/pages/admin/me/reuses/new'}
                        >
                          Publique no portal
                        </Button>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </TabBody>
        </Tab>
      </Tabs>
    </div>
  );
}
