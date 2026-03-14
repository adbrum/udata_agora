"use client";

import { useRef, useState } from "react";
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";

export default function ProfileClient() {
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const editDropdownWrapperRef = useRef<HTMLDivElement>(null);

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
          avatarType="image"
          srcPath="/placeholder-avatar.png"
          alt="Avatar do utilizador"
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
              optionsVisible={4}
              style={{
                width: "max-content",
                minWidth: "100%",
              }}
            >
              <DropdownSection name="edit" label="">
                <DropdownOption value="dataset">Um conjunto de dados</DropdownOption>
                <DropdownOption value="reuse">Uma reutilização</DropdownOption>
                <DropdownOption value="harvester">Um harvester</DropdownOption>
                <DropdownOption value="organization">Uma organização</DropdownOption>
              </DropdownSection>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
