"use client";

import { useState } from "react";
import {
  Header,
  GeneralBar,
  Languages,
  Language,
  Search,
  DefaultSearch,
  SearchInputContainer,
  InputSearchBar,
  Authenticated,
  AuthenticatedHeader,
  AuthenticatedBody,
  AuthenticatedBodyLink,
  AuthenticatedFooter,
  AuthenticatedFooterAction,
} from "@ama-pt/agora-design-system";

export function AdminHeader() {
  const [currentLang, setCurrentLang] = useState("pt");

  return (
    <div className="admin-header">
      <Header darkMode>
        <GeneralBar aria-label="Barra de opções do administrador">
          <Languages
            aria-label="Selecionar idioma"
            onChange={(lang) => {
              setCurrentLang(lang);
            }}
          >
            <Language label="Português" abbr="PT" value="pt" checked={currentLang === "pt"} />
            <Language label="Inglês" abbr="EN" value="en" checked={currentLang === "en"} />
            <Language label="Espanhol" abbr="ES" value="es" checked={currentLang === "es"} />
            <Language label="Francês" abbr="FR" value="fr" checked={currentLang === "fr"} />
          </Languages>
          <Search label="Pesquisar">
            <DefaultSearch>
              <SearchInputContainer>
                <InputSearchBar placeholder="Pesquisar" aria-label="Pesquisar" />
              </SearchInputContainer>
            </DefaultSearch>
          </Search>
          <Authenticated
            avatarType="initials"
            srcPath={"IC" as unknown as undefined}
            hasBadge
            badgePosition="top-right"
            alt="Inês Correia"
            information="Inês Correia"
          >
            <AuthenticatedHeader>Inês Correia</AuthenticatedHeader>
            <AuthenticatedBody>
              <AuthenticatedBodyLink
                hasIcon
                leadingIcon="agora-line-person"
              >
                <a href="/pages/admin/perfil">O meu perfil</a>
              </AuthenticatedBodyLink>
              <AuthenticatedBodyLink
                hasIcon
                leadingIcon="agora-line-settings"
              >
                <a href="/pages/admin/definicoes">As minhas definições</a>
              </AuthenticatedBodyLink>
              <AuthenticatedBodyLink
                hasIcon
                leadingIcon="agora-line-notification"
              >
                <a href="/pages/admin/notificacoes">Notificações</a>
              </AuthenticatedBodyLink>
            </AuthenticatedBody>
            <AuthenticatedFooter>
              <AuthenticatedFooterAction
                hasIcon
                leadingIcon="agora-line-delete"
                variant="danger"
                appearance="link"
              >
                Eliminar conta
              </AuthenticatedFooterAction>
              <AuthenticatedFooterAction
                hasIcon
                leadingIcon="agora-line-logout"
                appearance="link"
              >
                Terminar sessão
              </AuthenticatedFooterAction>
            </AuthenticatedFooter>
          </Authenticated>
        </GeneralBar>
      </Header>
    </div>
  );
}
