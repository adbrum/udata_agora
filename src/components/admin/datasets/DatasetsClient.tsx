"use client";

import {
  Breadcrumb,
  CardNoResults,
  Icon,
  InputSelect,
  InputSearchBar,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";

export default function DatasetsClient() {
  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Lopes Inês", url: "#" },
            { label: "Conjuntos de dados", url: "/pages/admin/datasets" },
          ]}
        />
      </div>

      <h1 className="datasets-admin-page__title">Conjuntos de dados</h1>

      <div className="datasets-page__body">
        <div className="datasets-page__sidebar">
          <p className="datasets-page__count">
            <strong>0 CONJUNTOS DE DADOS</strong>
          </p>
          <InputSearchBar
            label="Pesquisar"
            placeholder="Pesquisar"
            aria-label="Pesquisar conjuntos de dados"
          />
          <InputSelect
            label="Filtrar"
            placeholder="Filtrar por status"
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

        <div className="datasets-page__content">
          <CardNoResults
            className="datasets-page__empty"
            position="center"
            icon={
              <Icon name="agora-line-file" className="datasets-page__empty-icon" />
            }
            description="Você ainda não publicou um conjunto de dados."
            hasAnchor
            valueAnchor="Publicar em data.gouv.fr"
            anchorHref="/pages/admin/datasets/new"
            anchorTarget="_self"
          />
        </div>
      </div>
    </div>
  );
}
