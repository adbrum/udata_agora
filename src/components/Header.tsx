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
  Button,
} from '@ama-pt/agora-design-system';
import SearchDropdown from '@/components/search/SearchDropdown';
import { HeaderCard } from '@/components/HeaderCard';

export const Header = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headerRef = useRef<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const [submenu, setSubmenu] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState(
    pathname === '/pages/login' || pathname === '/pages/loginregister' ? '2' : '1'
  );
  React.useEffect(() => {
    if (pathname === '/pages/login' || pathname === '/pages/loginregister') {
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
    setSubmenu(null);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Apply hover styles to "Inscrever-se" button when on loginregister page
  React.useEffect(() => {
    if (pathname !== '/pages/loginregister') return;

    const applyActiveStyles = () => {
      const btn = document.querySelector('.unauthenticated-panel-menu > .agora-btn') as HTMLElement;
      if (!btn) return;

      // Text color
      const childrenWrapper = btn.querySelector('.children-wrapper') as HTMLElement;
      if (childrenWrapper) childrenWrapper.style.color = 'var(--color-primary-600)';

      // Underline
      btn.style.textDecorationLine = 'underline';
      btn.style.textDecorationStyle = 'solid';
      btn.style.textDecorationThickness = '0.094rem';
      btn.style.textUnderlineOffset = '0.388rem';
      btn.style.textDecorationColor = 'var(--color-primary-600)';

      // Icon swap: hide line, show solid
      const lineIcon = btn.querySelector('.icon-wrapper .line') as HTMLElement;
      const solidIcon = btn.querySelector('.icon-wrapper .solid') as HTMLElement;
      if (lineIcon) lineIcon.style.display = 'none';
      if (solidIcon) solidIcon.style.display = 'block';

      // Icon fill
      const svgs = btn.querySelectorAll('.icon-wrapper svg');
      svgs.forEach((svg) => ((svg as HTMLElement).style.fill = 'var(--color-primary-600)'));
    };

    // Wait for design system to render
    const timer = setTimeout(applyActiveStyles, 150);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Reset submenu when clicking anywhere outside the card grid (.links)
  const handleHeaderClickCapture = React.useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.links')) {
        setSubmenu(null);
      }
    },
    []
  );

  // Apply submenu styles directly on DOM (NavigationRoot doesn't forward className/styles)
  // Only targets the Conhecimento panel via data attribute marker
  React.useEffect(() => {
    const applySubmenuStyles = () => {
      // Clean up any previously modified panel
      const modified = document.querySelector(
        '.navigation-links-layout[data-submenu]'
      ) as HTMLElement | null;
      if (modified) {
        const titleEl = modified.querySelector(':scope > .title') as HTMLElement | null;
        modified.removeAttribute('data-submenu');
        if (titleEl && titleEl.dataset.originalTitle) {
          titleEl.textContent = titleEl.dataset.originalTitle;
          delete titleEl.dataset.originalTitle;
        }
      }

      // Mark the Conhecimento panel and apply submenu title
      const submenuTitles: Record<string, string> = {
        desenvolvimento: 'Desenvolvimento',
        publicacoes: 'Publicações',
      };

      document.querySelectorAll('.navigation-links-layout').forEach((el) => {
        const titleEl = el.querySelector(':scope > .title') as HTMLElement | null;
        if (!titleEl) return;
        const isConhecimento =
          titleEl.textContent === 'Conhecimento' ||
          titleEl.dataset.originalTitle === 'Conhecimento';
        if (!isConhecimento) return;

        const htmlEl = el as HTMLElement;
        htmlEl.setAttribute('data-conhecimento', '');

        if (submenu && submenuTitles[submenu]) {
          htmlEl.setAttribute('data-submenu', submenu);
          titleEl.dataset.originalTitle = 'Conhecimento';
          titleEl.textContent = submenuTitles[submenu];
        }
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(applySubmenuStyles);
    });
  }, [submenu]);

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

  type KnowledgeItem =
    | { type: "back"; key: string }
    | {
      type: "card";
      key: string;
      iconDefault: string;
      iconHover?: string;
      title: string;
      description: string;
      href: string;
      isSubmenuTrigger?: boolean;
    };

  const conhecimentoItems: KnowledgeItem[] =
    submenu === "desenvolvimento"
      ? [
        { type: "back", key: "voltar" },
        {
          type: "card",
          key: "dev-api-ref",
          iconDefault: "agora-line-plus-circle",
          iconHover: "agora-solid-plus-circle",
          title: "Referência da API",
          description: "Documentação técnica",
          href: "#",
        },
        {
          type: "card",
          key: "dev-pub",
          iconDefault: "agora-line-document",
          iconHover: "agora-solid-document",
          title: "Relatórios/Estudos",
          description: "Submeter estudos",
          href: "#",
        },
      ]
      : submenu === "publicacoes"
        ? [
          { type: "back", key: "voltar" },
          {
            type: "card",
            key: "pub-guias",
            iconDefault: "agora-line-book-open",
            iconHover: "agora-solid-book-open",
            title: "Relatórios/Estudos",
            description: "Relatórios e estudos",
            href: "#",
          },
        ]
        : [
          {
            type: "card",
            key: "sobre",
            iconDefault: "agora-line-star",
            iconHover: "agora-solid-star",
            title: "Sobre dados abertos",
            description: "Informação geral",
            href: "/pages/about-open-data",
          },
          {
            type: "card",
            key: "publicar",
            iconDefault: "agora-line-plus-circle",
            iconHover: "agora-solid-plus-circle",
            title: "Como publicar dados?",
            description: "Guia de publicação",
            href: "#",
          },
          {
            type: "card",
            key: "reutilizar",
            iconDefault: "agora-line-book-open",
            iconHover: "agora-solid-book-open",
            title: "Como reutilizar dados?",
            description: "Guia de reutilização",
            href: "#",
          },
          {
            type: "card",
            key: "dados-gov",
            iconDefault: "agora-line-plus-circle",
            iconHover: "agora-solid-plus-circle",
            title: "O que é o dados.gov",
            description: "Sobre o portal",
            href: "#",
          },
          {
            type: "card",
            key: "desenvolvimento",
            iconDefault: "agora-line-user-group",
            iconHover: "agora-solid-user-group",
            title: "Desenvolvimento",
            description: "Plataforma e código",
            href: "#",
            isSubmenuTrigger: true,
          },
          {
            type: "card",
            key: "publicacoes",
            iconDefault: "agora-line-user-group",
            iconHover: "agora-solid-user-group",
            title: "Publicações",
            description: "Relatórios e estudos",
            href: "#",
            isSubmenuTrigger: true,
          },
          {
            type: "card",
            key: "noticias",
            iconDefault: "agora-line-file",
            iconHover: "agora-solid-file",
            title: "Notícias",
            description: "Últimas novidades",
            href: "/pages/article",
          },
          {
            type: "card",
            key: "minicursos",
            iconDefault: "agora-line-file",
            iconHover: "agora-solid-file",
            title: "Minicursos",
            description: "Formação online",
            href: "/pages/mini-courses",
          },
        ];

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
    <header className="sticky top-0 z-sticky" onClickCapture={handleHeaderClickCapture}>
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
              <Link href="/pages/loginregister">Inscrever-se</Link>
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
                iconDefault: "agora-line-document",
                iconHover: "agora-solid-document",
                title: "HVDs",
                description: "High Value Datasets",
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
            {conhecimentoItems.map((item) => {

              if (item.type === "back") {

                return (
                  <NavigationLink key={item.key} appearance="link">
                    <div

                      onClickCapture={(e) => {

                        e.stopPropagation();

                        e.preventDefault();

                        setSubmenu(null);

                      }}
                    >
                      <Button

                        appearance="link"

                        hasIcon

                        leadingIcon="agora-line-arrow-left-anchor"

                        leadingIconHover="agora-solid-arrow-left-anchor"
                      >

                        Voltar
                      </Button>
                    </div>
                  </NavigationLink>

                );

              }

              if (item.isSubmenuTrigger) {

                return (
                  <NavigationLink key={item.key} appearance="link">
                    <div

                      role="button"

                      tabIndex={0}

                      onClickCapture={(e) => {

                        e.stopPropagation();

                        e.preventDefault();

                        setSubmenu(item.key);

                      }}

                      onKeyDown={(e) => {

                        if (e.key === "Enter" || e.key === " ") {

                          e.preventDefault();

                          setSubmenu(item.key);

                        }

                      }}

                      className="cursor-pointer"
                    >
                      <HeaderCard

                        iconDefault={item.iconDefault}

                        iconHover={item.iconHover}

                        title={item.title}

                        description={item.description}

                        href={item.href}

                        onLinkClick={(e) => {

                          e.preventDefault();

                          e.stopPropagation();

                          setSubmenu(item.key);

                        }}

                      />
                    </div>
                  </NavigationLink>

                );

              }

              return (
                <NavigationLink key={item.key} appearance="link">
                  <HeaderCard

                    iconDefault={item.iconDefault}

                    iconHover={item.iconHover}

                    title={item.title}

                    description={item.description}

                    href={item.href}

                    onLinkClick={handleLinkClick}

                  />
                </NavigationLink>

              );

            })}

          </NavigationRoot>
        </NavigationBar>
      </AgoraHeader>
    </header>
  );
};
