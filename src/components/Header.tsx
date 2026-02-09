'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Header as AgoraHeader,
  Brand,
  Logo,
  GeneralBar,
  Areas,
  Area,
  Languages,
  Language,
  Unauthenticated,
  NavigationBar,
  NavigationLink,
} from '@ama-pt/agora-design-system';

export const Header = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headerRef = useRef<any>(null);
  const router = useRouter();

  return (
    <AgoraHeader ref={headerRef}>
      <Brand>
        <Logo>
          <Link href="/" className="flex items-center">
            <NextImage src="/logo.png" alt="dados.gov" height={43} width={251} priority />
          </Link>
        </Logo>
      </Brand>

      <GeneralBar aria-label="Barra de utilidades">
        <Areas aria-label="Áreas do portal">
          <Area value="1" label="Portal" onClick={() => router.push('/')} />
          <Area value="2" label="Iniciar Sessão" onClick={() => router.push('/login')} />
        </Areas>

        <Languages
          aria-label="Selecionar idioma"
          onChange={(lang: string) => console.log('Language:', lang)}
        >
          <Language value="pt" label="Português" abbr="PT" />
          <Language value="en" label="English" abbr="EN" />
          <Language value="es" label="Español" abbr="ES" />
          <Language value="fr" label="Français" abbr="FR" />
        </Languages>

        <Unauthenticated
          label="Inscrever-se"
          aria-label="Registar"
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
        <NavigationLink>
          <Link href="/pages/datasets">Conjuntos de dados</Link>
        </NavigationLink>
        <NavigationLink>
          <Link href="/organizations">Organizações</Link>
        </NavigationLink>
        <NavigationLink>
          <Link href="/reuses">Reutilizações</Link>
        </NavigationLink>
        <NavigationLink>
          <Link href="/documentation">Documentação</Link>
        </NavigationLink>
        <NavigationLink>
          <Link href="/start">Primeiros passos</Link>
        </NavigationLink>
      </NavigationBar>
    </AgoraHeader>
  );
};
