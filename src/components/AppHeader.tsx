"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  Header,
  Brand,
  Logo,
  GeneralBar,
  Areas,
  Area,
  Languages,
  Language,
  Search,
  Unauthenticated,
  NavigationBar,
  NavigationRoot,
  NavigationLink,
} from "@ama-pt/agora-design-system";

export default function AppHeader() {
  const headerRef = useRef<any>(null);

  return (
    <Header ref={headerRef}>
      <Brand>
        <Logo>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logótipo" className="h-10" />
          </div>
        </Logo>
      </Brand>

      <GeneralBar aria-label="Utilidades">
        <Areas aria-label="Seleção de áreas">
          <Area value="1" label="Portal" active />
          <Area value="2" label="Iniciar Sessão" />
        </Areas>

        {/* ✅ ISTO É O QUE DESBLOQUEIA O BOTÃO */}
        <Languages
          aria-label="Selecionar idioma"
          onChange={(lang: string) => console.log("Língua:", lang)}
        >
          <Language value="pt" label="Português" abbr="PT" active />
          <Language value="es" label="Espanhol" abbr="ES" />
          <Language value="en" label="Inglês" abbr="EN" />
        </Languages>

        <Search
          label="Pesquisar"
          aria-label="Pesquisar no site"
          onSearch={(term: string) => console.log("Pesquisa:", term)}
        />

        <Unauthenticated
          label="Login"
          aria-label="Entrar"
          onLogin={() => console.log("Abrir Login")}
        />
      </GeneralBar>

      <NavigationBar
        responsiveMenuLabel="Menu"
        responsiveMenuAriaLabel="Abrir menu"
        responsiveMenuBackToRootLabel="Voltar ao início"
        modalMenuLabel="Navegação Principal"
        modalAriaLabel="Menu de navegação"
        modalCloseLabel="Fechar"
      >
        {/* Seções com dropdown */}
        <NavigationRoot label="Dados">
          <NavigationLink>
            <Link href="/servicos/todos">Todos os Serviços</Link>
          </NavigationLink>
          <NavigationLink>
            <Link href="/servicos/agendamentos">Agendamentos</Link>
          </NavigationLink>
        </NavigationRoot>

        <NavigationRoot label="Sobre nós">
          <NavigationLink>
            <Link href="/noticias">Notícias</Link>
          </NavigationLink>
          <NavigationLink>
            <Link href="/ajuda">Centro de Ajuda</Link>
          </NavigationLink>
        </NavigationRoot>

        {/* Links diretos sem seta */}
        <NavigationLink>
          <Link href="/artigos">Artigos</Link>
        </NavigationLink>
        <NavigationLink>
          <Link href="/ajuda">Ajuda</Link>
        </NavigationLink>
      </NavigationBar>
    </Header>
  );
}
