"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  DropdownSection,
  DropdownOption,
  InputText,
  InputTextArea,
  DragAndDropUploader,
  StatusCard,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
} from "@ama-pt/agora-design-system";

export default function ProfileClient() {
  const router = useRouter();
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const editDropdownWrapperRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  return (
    <div className="datasets-admin-page">
      <div className="datasets-admin-page__breadcrumb">
        <Breadcrumb
          items={[
            { label: "Administração", url: "/pages/admin" },
            { label: "Lopes Inês", url: "#" },
            { label: "Perfil", url: "/pages/admin/profile" },
          ]}
        />
      </div>

      <h1 className="datasets-admin-page__title mt-[64px] mb-[32px]">Perfil</h1>

      <div className="profile-card">
        <Avatar
          avatarType={user?.avatar_thumbnail ? "image" : "initials"}
          srcPath={
            (user?.avatar_thumbnail ||
              `${user?.first_name?.charAt(0).toUpperCase() ?? ""}${user?.last_name?.charAt(0).toUpperCase() ?? ""}` ||
              "U") as unknown as undefined
          }
          alt={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
          className="profile-card__avatar"
        />

        <div className="profile-card__body">
          <div className="profile-card__info">
            <p className="text-neutral-900 text-base font-light leading-7">
              Agência para a Reforma Tecnológica do Estado
            </p>
            <p className="text-neutral-900 text-xl font-semibold leading-8">
              Nome do utilizador
            </p>
            <p className="text-neutral-900 text-base leading-7">
              <span className="font-semibold">Última atualização:</span>
              {" "}12 de janeiro de 2026
            </p>
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

          <div
            className="relative inline-block publish-dropdown-wrapper"
            ref={editDropdownWrapperRef}
          >
            <Button
              variant="primary"
              hasIcon
              leadingIcon="agora-line-edit"
              leadingIconHover="agora-solid-edit"
              onClick={() => setShowEditDropdown((v) => !v)}
            >
              Editar
            </Button>
            <Dropdown
              type="text"
              showDropdown={showEditDropdown}
              onHide={() => setShowEditDropdown(false)}
              hideSectionNames={true}
              optionsVisible={6}
              onChange={(options) => {
                const routes: Record<string, string> = {
                  dataset: "/pages/admin/me/datasets/new",
                  reuse: "/pages/admin/me/reuses/new",
                  harvester: "/pages/admin/harvesters/new",
                  api: "/pages/admin/dataservices/new",
    article: "/pages/admin/system/posts/new",
                  organization: "/pages/admin/organizations/new",
                };
                if (options.length > 0) {
                  const route = routes[options[0].value as string];
                  if (route) router.push(route);
                }
              }}
              style={{
                width: "max-content",
                minWidth: "100%",
              }}
            >
              <DropdownSection name="edit" label="">
                <DropdownOption value="dataset">Um conjunto de dados</DropdownOption>
                <DropdownOption value="reuse">Uma reutilização</DropdownOption>
                <DropdownOption value="harvester">Um harvester</DropdownOption>
              <DropdownOption value="api">Uma API</DropdownOption>
                <DropdownOption value="article">Um artigo</DropdownOption>
              <DropdownOption value="organization">Uma organização</DropdownOption>
              </DropdownSection>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-[32px]">
        <Tabs>
          <Tab active>
            <TabHeader>Perfil</TabHeader>
            <TabBody>
              <div className="datasets-admin-page__form mt-[24px]">
                <h2 className="datasets-admin-page__section-title">EDITAR PERFIL</h2>

                <div className="datasets-admin-page__fields-group">
                  <div className="flex gap-[18px]">
                    <div className="flex-1">
                      <InputText
                        label="Nome *"
                        placeholder="Placeholder"
                        id="first-name"
                      />
                    </div>
                    <div className="flex-1">
                      <InputText
                        label="Último nome *"
                        placeholder="Placeholder"
                        id="last-name"
                      />
                    </div>
                  </div>

                  <InputTextArea
                    label="Biografia"
                    placeholder="Placeholder"
                    id="biography"
                    rows={4}
                  />

                  <InputText
                    label="Site da Internet"
                    placeholder="Placeholder"
                    id="website"
                  />

                  <div>
                    <span className="text-primary-900 text-base font-medium leading-7">
                      Foto de perfil
                    </span>
                    <div className="mt-2">
                      <DragAndDropUploader
                        dragAndDropLabel="Arraste e solte os ficheiros"
                        separatorLabel="ou"
                        inputLabel="Selecionar ficheiro"
                        removeFileButtonLabel="Remover ficheiro"
                        replaceFileButtonLabel="Substituir ficheiro"
                        extensionsInstructions="Tamanho máximo: 4 MB. Formatos aceitos: JPG, JPEG, PNG."
                        accept=".jpg,.jpeg,.png"
                        maxSize={4194304}
                        maxCount={1}
                      />
                    </div>
                  </div>

                  <div className="flex items-end gap-[16px]">
                    <div className="flex-1">
                      <InputText
                        label="Chave de API"
                        placeholder="Placeholder"
                        id="api-key"
                      />
                    </div>
                    <Button appearance="outline" variant="primary" hasIcon leadingIcon="agora-line-edit" leadingIconHover="agora-solid-edit">
                      Gerar
                    </Button>
                  </div>

                  <div className="flex items-end gap-[16px]">
                    <div className="flex-1">
                      <InputText
                        label="Endereço de email"
                        placeholder="ines.correia@babelgroup.com"
                        id="email"
                      />
                    </div>
                    <Button appearance="outline" variant="neutral" hasIcon leadingIcon="agora-line-edit" leadingIconHover="agora-solid-edit">
                      Alterar endereço de e-mail
                    </Button>
                  </div>

                  <div className="flex items-end gap-[16px]">
                    <div className="flex-1">
                      <InputText
                        label="Senha"
                        placeholder="**********"
                        id="password"
                        type="password"
                      />
                    </div>
                    <Button appearance="outline" variant="neutral" hasIcon leadingIcon="agora-line-edit" leadingIconHover="agora-solid-edit">
                      Alterar sua senha
                    </Button>
                  </div>
                </div>

                <StatusCard
                  type="warning"
                  description={
                    <>
                      <strong>Autenticação de dois fatores</strong>
                      <br />
                      Configure a autenticação de dois fatores.
                    </>
                  }
                />

                <div className="flex justify-end mt-[8px]">
                  <Button appearance="outline" variant="neutral" hasIcon leadingIcon="agora-line-settings" leadingIconHover="agora-solid-settings">
                    Configure a autenticação de dois fatores.
                  </Button>
                </div>

                <StatusCard
                  type="danger"
                  description={
                    <>
                      <strong>Excluir conta</strong>
                      <br />
                      Atenção, esta ação não pode ser cancelada.
                    </>
                  }
                />

                <div className="flex justify-end mt-[8px]">
                  <Button appearance="outline" variant="danger" hasIcon leadingIcon="agora-line-trash" leadingIconHover="agora-solid-trash">
                    Eliminar
                  </Button>
                </div>

                <div className="flex justify-end mt-[16px]">
                  <Button variant="primary">
                    Guardar
                  </Button>
                </div>
              </div>
            </TabBody>
          </Tab>
          <Tab>
            <TabHeader>Atividades</TabHeader>
            <TabBody>
              <div className="mt-[24px]">
                <p className="text-neutral-700 text-base">
                  Nenhuma atividade registada.
                </p>
              </div>
            </TabBody>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
