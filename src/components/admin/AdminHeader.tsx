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
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/api";

export function AdminHeader() {
  const [currentLang, setCurrentLang] = useState("pt");
  const { user, samlLogin } = useAuth();

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
          {/* Pesquisar oculto temporariamente */}
          {/* <Search label="Pesquisar">
            <DefaultSearch>
              <SearchInputContainer>
                <InputSearchBar hasVoiceActionButton={false} label="Diga-nos o que procura que nos ajudamos" placeholder="Pesquisar" aria-label="Pesquisar" />
              </SearchInputContainer>
            </DefaultSearch>
          </Search> */}
          <Authenticated
            avatarType={user?.avatar_thumbnail ? "image" : "initials"}
            srcPath={
              (user?.avatar_thumbnail ||
                `${user?.first_name.charAt(0).toUpperCase() ?? ""}${user?.last_name.charAt(0).toUpperCase() ?? ""}`) as unknown as undefined
            }
            hasBadge
            badgePosition="top-right"
            alt={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
            information={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
          >
            <AuthenticatedHeader>
              {user?.first_name} {user?.last_name}
            </AuthenticatedHeader>
            <AuthenticatedBody>
              <AuthenticatedBodyLink
                hasIcon
                leadingIcon="agora-line-user"
                leadingIconHover="agora-solid-user"
              >
                <a href={`/pages/users/${user?.slug || ''}`}>O meu perfil</a>
              </AuthenticatedBodyLink>
{/* As minhas definições e Notificações ocultos temporariamente */}
            </AuthenticatedBody>
            <AuthenticatedFooter>
              <AuthenticatedFooterAction
                hasIcon
                leadingIcon="agora-line-trash"
                leadingIconHover="agora-solid-trash"
                variant="danger"
                appearance="link"
              >
                Eliminar conta
              </AuthenticatedFooterAction>
              <AuthenticatedFooterAction
                hasIcon
                leadingIcon="agora-line-log-out"
                leadingIconHover="agora-solid-log-out"
                appearance="link"
                onClick={async () => {
                  if (samlLogin) {
                    window.location.href = "/saml/logout";
                    return;
                  }
                  await logout();
                  window.location.href = "/";
                }}
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
