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
import SearchDropdown from '@/components/search/SearchDropdown';
import { HeaderCard } from '@/components/HeaderCard';

export const Header = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headerRef = useRef<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const [selectedArea, setSelectedArea] = useState(
    pathname === '/pages/login' || pathname === '/pages/register' ? '2' : '1'
  );
  React.useEffect(() => {
    if (pathname === '/pages/login' || pathname === '/pages/register') {
      setSelectedArea('2');
    } else {
      setSelectedArea('1');
    }

    // Force close the responsive menu on route change
    const closeMenu = () => {
      // 1. Try via design system ref
      if (headerRef.current?.closeResponsiveMenu) {
        headerRef.current.closeResponsiveMenu();
      }

      // 2. Fallback: Try to trigger click on the close button in the modal/menu
      // The design system uses specific classes for the close button
      const closeButton = document.querySelector(
        '.agora-header-navigation-modal [aria-label="Fechar"], .agora-header-navigation-modal button.agora-modal-close'
      ) as HTMLButtonElement;
      if (closeButton) {
        closeButton.click();
      }
    };

    // Small timeout to ensure the route change has started and the DOM is accessible
    const timer = setTimeout(closeMenu, 100);
    return () => clearTimeout(timer);
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Force close the menu immediately
    if (headerRef.current?.closeResponsiveMenu) {
      headerRef.current.closeResponsiveMenu();
    }

    // Fallback close
    const closeButton = document.querySelector(
      '.agora-header-navigation-modal [aria-label="Fechar"], .agora-header-navigation-modal button.agora-modal-close'
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }

    // In mobile, sometimes we need to manually trigger the router to ensure it happens after the menu closes
    if (href !== '#') {
      router.push(href);
    }
  };

  return (
    <header className="sticky top-0 z-sticky">
      <AgoraHeader ref={headerRef}>
        <Brand>
          <Logo>
            <Link href="/" className="flex items-center">
              <NextImage
                src="/Logos/logo.png"
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

          <div className="header-search-wrapper flex items-center">
            <SearchDropdown
              id="header-search"
              placeholder="Pesquisar"
              label="Pesquisar"
            />
          </div>

          <Unauthenticated label="Inscrever-se" aria-label="Registar">
            <UnauthenticatedLink
              hasIcon
              leadingIcon="agora-line-user"
              leadingIconHover="agora-solid-user"
            >
              <Link href="/pages/register">Inscrever-se</Link>
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
          <NavigationRoot label="Contribuir">
            {[
              {
                iconDefault: "agora-line-layers-menu",
                iconHover: "agora-solid-layers-menu",
                title: "Novo Conjunto de Dados",
                description: "Pesquisar e explorar dados",
                href: "#",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "Nova API",
                description: "Explorar as APIs",
                href: "#",
              },
              {
                iconDefault: "agora-line-book-open",
                iconHover: "agora-solid-book-open",
                title: "Nova Reutilização",
                description: "Casos de uso",
                href: "#",
              },
              {
                iconDefault: "agora-line-star",
                iconHover: "agora-solid-star",
                title: "Nova Organização",
                description: "Entidades",
                href: "#",
              },
              {
                iconDefault: "agora-line-user-group",
                iconHover: "agora-solid-user-group",
                title: "Contactar",
                description: "Fale connosco",
                href: "/pages/support",
              },
            ].map((card) => (
              <NavigationLink key={card.title} appearance="link">
                <HeaderCard {...card} onLinkClick={handleLinkClick} />
              </NavigationLink>
            ))}
          </NavigationRoot>

          <NavigationRoot label="Explorar">
            {[
              {
                iconDefault: "agora-line-layers-menu",
                iconHover: "agora-solid-layers-menu",
                title: "Conjuntos de dados",
                description: "Explore os dados",
                href: "/pages/datasets",
              },
              {
                iconDefault: "agora-line-eye",
                iconHover: "agora-solid-eye",
                title: "Visualizações",
                description: "Ver dados visualmente",
                href: "#",
              },
              {
                iconDefault: "agora-line-document",
                title: "HVDs",
                description: "High Value Datasets",
                href: "#",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "APIs",
                description: "Consulte as APIs",
                href: "#",
              },
              {
                iconDefault: "agora-line-file",
                iconHover: "agora-solid-file",
                title: "Acesso Catalogo via SPARQL",
                description: "Query de dados",
                href: "#",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "Reutilizações",
                description: "Casos de uso",
                href: "/pages/reuses",
              },
              {
                iconDefault: "agora-line-star",
                iconHover: "agora-solid-star",
                title: "Organizações",
                description: "Entidades públicas",
                href: "/pages/organizations",
              },
              {
                iconDefault: "agora-line-user-group",
                iconHover: "agora-solid-user-group",
                title: "Data Stories",
                description: "Histórias com dados",
                href: "/pages/datastories",
              },
            ].map((card) => (
              <NavigationLink key={card.title} appearance="link">
                <HeaderCard {...card} onLinkClick={handleLinkClick} />
              </NavigationLink>
            ))}
          </NavigationRoot>

          <NavigationRoot label="Conhecimento">
            {[
              {
                iconDefault: "agora-line-star",
                iconHover: "agora-solid-star",
                title: "Sobre dados abertos",
                description: "Informação geral",
                href: "/pages/about-open-data",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "Como publicar dados?",
                description: "Guia de publicação",
                href: "#",
              },
              {
                iconDefault: "agora-line-book-open",
                iconHover: "agora-solid-book-open",
                title: "Como reutilizar dados?",
                description: "Guia de reutilização",
                href: "#",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "O que é o dados.gov",
                description: "Sobre o portal",
                href: "#",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "API Tutorial",
                description: "Aprenda a usar a API",
                href: "#",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "Referência da API",
                description: "Documentação técnica",
                href: "#",
              },
              {
                iconDefault: "agora-line-user-group",
                iconHover: "agora-solid-user-group",
                title: "Desenvolvimento",
                description: "Plataforma e código",
                href: "#",
              },
              {
                iconDefault: "agora-line-user-group",
                iconHover: "agora-solid-user-group",
                title: "Publicações",
                description: "Relatórios e estudos",
                href: "#",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "Pub. Relatórios/Estudos",
                description: "Submeter estudos",
                href: "#",
              },
              {
                iconDefault: "agora-line-plus-circle",
                iconHover: "agora-solid-plus-circle",
                title: "Guias",
                description: "Tutoriais e manuais",
                href: "#",
              },
              {
                iconDefault: "agora-line-file",
                iconHover: "agora-solid-file",
                title: "Notícias",
                description: "Últimas novidades",
                href: "/pages/article",
              },
              {
                iconDefault: "agora-line-file",
                iconHover: "agora-solid-file",
                title: "Minicursos",
                description: "Formação online",
                href: "/pages/mini-courses",
              },
            ].map((card) => (
              <NavigationLink key={card.title} appearance="link">
                <HeaderCard {...card} onLinkClick={handleLinkClick} />
              </NavigationLink>
            ))}
          </NavigationRoot>
        </NavigationBar>
      </AgoraHeader>
    </header>
  );
};
