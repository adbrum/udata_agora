"use client";

import {
  Header,
  GeneralBar,
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
  const { user, samlLogin } = useAuth();

  const initials = user
    ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase()
    : "";

  return (
    <div
      className="admin-header"
      {...(user?.avatar_thumbnail
        ? { style: { "--admin-avatar-url": `url(${user.avatar_thumbnail})` } as React.CSSProperties }
        : { style: { "--admin-initials": `"${initials}"` } as React.CSSProperties })}
    >
      <Header darkMode>
        <GeneralBar aria-label="Barra de opções do administrador">
          {/* Idioma oculto temporariamente */}
          {/* Pesquisar oculto temporariamente */}
          {/* <Search label="Pesquisar">
            <DefaultSearch>
              <SearchInputContainer>
                <InputSearchBar hasVoiceActionButton={false} label="Diga-nos o que procura que nos ajudamos" placeholder="Pesquisar" aria-label="Pesquisar" />
              </SearchInputContainer>
            </DefaultSearch>
          </Search> */}
          <Authenticated
            avatarType={user?.avatar_thumbnail ? "image" : "icon"}
            srcPath={
              (user?.avatar_thumbnail || "agora-line-user") as unknown as undefined
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
