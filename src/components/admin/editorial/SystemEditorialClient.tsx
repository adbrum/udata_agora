"use client";

import {
  Breadcrumb,
  Button,
  CardNoResults,
  Icon,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
} from "@ama-pt/agora-design-system";

const emptyContent = (
  <div>
    <div className="flex justify-end gap-[12px] mb-[24px] mt-[24px]">
      <Button
        appearance="outline"
        variant="neutral"
        hasIcon={true}
        leadingIcon="agora-line-eye"
        leadingIconHover="agora-solid-eye"
      >
        Veja a página pública
      </Button>
      <Button
        appearance="outline"
        variant="neutral"
        hasIcon={true}
        leadingIcon="agora-line-eye"
        leadingIconHover="agora-solid-eye"
      >
        Pré-visualização
      </Button>
      <Button
        variant="primary"
        hasIcon={true}
        leadingIcon="agora-line-plus-circle"
        leadingIconHover="agora-solid-plus-circle"
      >
        Adicionar um bloco
      </Button>
    </div>
    <CardNoResults
      className="datasets-page__empty"
      position="center"
      icon={
        <Icon name="agora-line-file" className="datasets-page__empty-icon" />
      }
      description="Página em branco, adicione um bloco através do botão acima."
    />
  </div>
);

export default function SystemEditorialClient() {
  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Editorial", url: "/pages/admin/system/editorial" },
          ]}
        />
      </div>

      <h1 className="datasets-admin-page__title mb-[24px]">Editorial</h1>

      <Tabs>
        <Tab active>
          <TabHeader>Conjuntos de dados</TabHeader>
          <TabBody>{emptyContent}</TabBody>
        </Tab>
        <Tab>
          <TabHeader>Reutilizar</TabHeader>
          <TabBody>{emptyContent}</TabBody>
        </Tab>
        <Tab>
          <TabHeader>APIs</TabHeader>
          <TabBody>{emptyContent}</TabBody>
        </Tab>
      </Tabs>
    </div>
  );
}
