'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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
  UnauthenticatedLink,
  NavigationBar,
  NavigationLink,
  NavigationRoot,
} from '@ama-pt/agora-design-system';

export const Header = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headerRef = useRef<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const [selectedArea, setSelectedArea] = useState(pathname === '/pages/login' ? '2' : '1');

  React.useEffect(() => {
    if (pathname === '/pages/login') {
      setSelectedArea('2');
    } else {
      setSelectedArea('1');
    }
  }, [pathname]);

  const languages = [
    { value: 'pt', label: 'Português', abbr: 'PT' },
    { value: 'en', label: 'English', abbr: 'EN' },
    { value: 'es', label: 'Español', abbr: 'ES' },
    { value: 'fr', label: 'Français', abbr: 'FR' },
  ];

  const areas = [
    { value: '1', label: 'Portal' },
    { value: '2', label: 'Iniciar Sessão' },
  ];

  const currentLangLabel =
    languages.find((l) => l.value === selectedLanguage)?.label || 'Português';
  const currentAreaLabel =
    areas.find((a) => a.value === selectedArea)?.label || 'Portal';

  return (
    <header className="sticky top-0 z-sticky">
      <AgoraHeader ref={headerRef}>
        <Brand>
          <Logo>
            <Link href="/" className="flex items-center">
              <NextImage
                src="/logo.png"
                alt="dados.gov"
                height={43}
                width={251}
                priority
              />
            </Link>
          </Logo>
        </Brand>

        <GeneralBar aria-label="Opções navegação geral">
          <Areas
            aria-label="Áreas do portal"
            // @ts-ignore - Prop label does exist in component logic
            label={currentAreaLabel}
            onChange={(area: string) => setSelectedArea(area)}
          >
            <Area
              value="1"
              label="Portal"
              onClick={() => router.push('/')}
              active={selectedArea === '1'}
            />
            <Area
              value="2"
              label="Iniciar Sessão"
              onClick={() => router.push('/pages/login')}
              active={selectedArea === '2'}
            />
          </Areas>

          <Languages
            aria-label="Selecionar idioma"
            // @ts-ignore - Prop label does exist in component logic
            label={currentLangLabel}
            onChange={(lang: string) => setSelectedLanguage(lang)}
          >
            <Language
              value="pt"
              label="Português"
              abbr="PT"
              checked={selectedLanguage === 'pt'}
            />
            <Language
              value="en"
              label="English"
              abbr="EN"
              checked={selectedLanguage === 'en'}
            />
            <Language
              value="es"
              label="Español"
              abbr="ES"
              checked={selectedLanguage === 'es'}
            />
            <Language
              value="fr"
              label="Français"
              abbr="FR"
              checked={selectedLanguage === 'fr'}
            />
          </Languages>

          <Unauthenticated label="Inscrever-se" aria-label="Registar">
            <UnauthenticatedLink
              hasIcon
              leadingIcon="agora-line-user"
              leadingIconHover="agora-solid-user"
            >
              <Link href="/register">Inscrever-se</Link>
            </UnauthenticatedLink>
          </Unauthenticated>
        </GeneralBar>

        <NavigationBar
          responsiveMenuLabel="Menu"
          responsiveMenuAriaLabel="Abrir menu"
          responsiveMenuBackToRootLabel="Voltar ao início"
          modalMenuLabel="Navegação Principal"
          modalAriaLabel="Menu de navegação"
          modalCloseLabel="Fechar"
        >
          <NavigationLink appearance="link">
            <Link href="/pages/datasets">Conjuntos de dados</Link>
          </NavigationLink>
          <NavigationLink appearance="link">
            <Link href="/organizations">Organizações</Link>
          </NavigationLink>
          <NavigationLink appearance="link">
            <Link href="/pages/reuses">Reutilizações</Link>
          </NavigationLink>
          <NavigationLink appearance="link">
            <Link href="/documentation">Documentação</Link>
          </NavigationLink>
          <NavigationRoot label="Primeiros passos">
            <NavigationLink appearance="link">
              <Link href="/start">Visão geral</Link>
            </NavigationLink>
            <NavigationLink appearance="link">
              <Link href="/item2">Items</Link>
            </NavigationLink>
          </NavigationRoot>
        </NavigationBar>
      </AgoraHeader>
    </header>
  );
};
