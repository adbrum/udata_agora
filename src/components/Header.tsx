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
  CardGeneral,
  Icon,
} from '@ama-pt/agora-design-system';
import SearchDropdown from '@/components/search/SearchDropdown';

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
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-layers-menu"
                iconHover="agora-solid-layers-menu"
                titleText="Novo Conjunto de Dados"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Pesquisar e explorar dados</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="Nova API"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Explorar as APIs</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-book-open"
                iconHover="agora-solid-book-open"
                titleText="Nova Reutilização"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Casos de uso</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-star"
                iconHover="agora-solid-star"
                titleText="Nova Organização"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Entidades</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-user-group"
                iconHover="agora-solid-user-group"
                titleText="Contactar"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Fale connosco</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '/pages/support',
                  onClick: (e: any) => {
                    e.preventDefault();
                    handleLinkClick(e, '/pages/support');
                  },
                }}
              />
            </NavigationLink>
          </NavigationRoot>

          <NavigationRoot label="Explorar">
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-layers-menu"
                iconHover="agora-solid-layers-menu"
                titleText="Conjuntos de dados"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Explore os dados</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '/pages/datasets',
                  onClick: (e: any) => {
                    e.preventDefault();
                    handleLinkClick(e, '/pages/datasets');
                  },
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-eye"
                iconHover="agora-solid-eye"
                titleText="Visualizações"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Ver dados visualmente</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-document"
                titleText="HVDs"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">High Value Datasets</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="APIs"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Consulte as APIs</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-file"
                iconHover="agora-solid-file"
                titleText="Acesso Catalogo via SPARQL"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Query de dados</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="Reutilizações"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Casos de uso</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '/pages/reuses',
                  onClick: (e: any) => {
                    e.preventDefault();
                    handleLinkClick(e, '/pages/reuses');
                  },
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-star"
                iconHover="agora-solid-star"
                titleText="Organizações"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Entidades públicas</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '/pages/organizations',
                  onClick: (e: any) => {
                    e.preventDefault();
                    handleLinkClick(e, '/pages/organizations');
                  },
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-user-group"
                iconHover="agora-solid-user-group"
                titleText="Data Stories"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Histórias com dados</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '/pages/datastories',
                  onClick: (e: any) => {
                    e.preventDefault();
                    handleLinkClick(e, '/pages/datastories');
                  },
                }}
              />
            </NavigationLink>
          </NavigationRoot>

          <NavigationRoot label="Conhecimento">
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-star"
                iconHover="agora-solid-star"
                titleText="Sobre dados abertos"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Informação geral</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="Como publicar dados?"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Guia de publicação</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-book-open"
                iconHover="agora-solid-book-open"
                titleText="Como reutilizar dados?"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Guia de reutilização</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="O que é o dados.gov"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Sobre o portal</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="API Tutorial"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Aprenda a usar a API</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="Referência da API"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Documentação técnica</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-user-group"
                iconHover="agora-solid-user-group"
                titleText="Desenvolvimento"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Plataforma e código</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-user-group"
                iconHover="agora-solid-user-group"
                titleText="Publicações"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Relatórios e estudos</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="Pub. Relatórios/Estudos"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Submeter estudos</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-plus-circle"
                iconHover="agora-solid-plus-circle"
                titleText="Guias"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Tutoriais e manuais</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '#',
                  onClick: (e: any) => handleLinkClick(e, '#'),
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-file"
                iconHover="agora-solid-file"
                titleText="Notícias"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Últimas novidades</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '/pages/article',
                  onClick: (e: any) => {
                    e.preventDefault();
                    handleLinkClick(e, '/pages/article');
                  },
                }}
              />
            </NavigationLink>
            <NavigationLink appearance="link">
              <CardGeneral
                isCardHorizontal={true}
                isBlockedLink={true}
                variant="neutral-100"
                iconDefault="agora-line-file"
                iconHover="agora-solid-file"
                titleText="Minicursos"
                descriptionText={(
                  <div className="flex justify-between items-center w-full">
                    <span className="text-neutral-700">Formação online</span>
                    <Icon name="agora-line-arrow-right-circle" className="w-8 h-8 text-primary-600 ml-auto" />
                  </div>
                ) as unknown as string}
                anchor={{
                  href: '/pages/mini-courses',
                  onClick: (e: any) => {
                    e.preventDefault();
                    handleLinkClick(e, '/pages/mini-courses');
                  },
                }}
              />
            </NavigationLink>
          </NavigationRoot>
        </NavigationBar>
      </AgoraHeader>
    </header>
  );
};
