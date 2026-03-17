'use client';

import React, { useEffect, useState } from 'react';
import { FederatedFooter } from '@ama-pt/agora-design-system';
import { fetchLatestDatasets } from '@/services/api';

const linkColumns = [
  {
    title: 'Dados abertos',
    links: [
      { href: '/pages/datasets', label: 'Catálogo de dados' },
      { href: 'https://data.europa.eu/en', label: 'Portal de dados europeu' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { href: '/pages/faqs/about_dadosgov', label: 'Sobre nós' },
      { href: '/pages/support', label: 'Contactar-nos' },
      { href: '/pages/faqs/terms', label: 'Termos de utilização' },
    ],
  },
  {
    title: 'Desenvolvimento',
    links: [
      { href: '/pages/docapi', label: 'API do portal' },
      { href: 'https://github.com/opendatateam/udata', label: 'Motor de código aberto: udata (14.7.2)' },
      { href: '#', label: 'Interface de utilizador de dados.gov: frontend' },
    ],
  },
];

const socialLinksData = [
  { icon: 'agora-line-linkedin', iconHover: 'agora-solid-linkedin', href: 'https://www.linkedin.com/company/arte-gov-pt/', label: 'LinkedIn' },
];

const usefulLinksData = [
  { href: 'https://www.portugal.gov.pt/pt/gc23', label: 'República Portuguesa' },
  { href: 'https://www.compete2020.gov.pt/', label: 'Compete 2020' },
  { href: 'https://portugal2020.pt/', label: 'Portugal 2020' },
  { href: 'https://commission.europa.eu/funding-tenders/find-funding/funding-management-mode/2014-2020-european-structural-and-investment-funds_en?prefLang=pt', label: 'Comissão Europeia' },
];

// Element 1: Links Navigation
const FooterNavigation = () => {
  const [firstDatasetSlug, setFirstDatasetSlug] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchLatestDatasets(1, 1);
        if (res.data && res.data.length > 0) {
          setFirstDatasetSlug(res.data[0].slug);
        }
      } catch {
        // fallback to datasets list
      }
    }
    load();
  }, []);

  const resolvedColumns = linkColumns.map((col) => ({
    ...col,
    links: col.links.map((link) => {
      if (link.label === 'Catálogo de dados' && firstDatasetSlug) {
        return { ...link, href: `/pages/datasets/${firstDatasetSlug}` };
      }
      return link;
    }),
  }));

  return (
    <div className="container mx-auto px-4 py-12 xl:py-64">
      <h3 className="text-l-bold mb-8 text-white mb-[32px]">Mais para descobrir no portal</h3>
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-32">
        {resolvedColumns.map((column, idx) => (
          <div key={idx}>
            <h4 className="text-m-semibold text-white mb-[16px]">{column.title}</h4>
            <ul className="space-y-2">
              {column.links.map((link, linkIdx) => (
                <li className="mb-[16px] gap-32" key={linkIdx}>
                  <a
                    href={link.href}
                    className="text-white hover:underline text-sm transition-colors"
                    {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Element 2: Institutional & Social
const FooterInstitutional = () => {
  return (
    <div className="border-t border-primary-700">
      {/* Top Row: Brand & Partners */}
      <div className="container mx-auto px-4 py-32">
        <div className="flex md:flex-row justify-between items-center gap-6">
          <p className="text-white text-sm">
            Plataforma aberta de dados públicos portugueses
          </p>
          <div className="flex items-center gap-32">
            <img src="/Logos/NextGenerationEU.svg" alt="NextGenerationEU" />
            <img src="/Logos/republica-portuguesa.svg" alt="República Portuguesa" />
            <a href="https://www.arte.gov.pt/" target="_blank" rel="noopener noreferrer">
              <img src="/Logos/ARTE.svg" alt="ARTE" />
            </a>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-primary-700"></div>

      {/* Bottom Row: Social, Links, Copyright */}
      <div className="container mx-auto px-4 py-32">
        <div className="flex md:flex-row min-h-[120px]">
          {/* Left Column - Social Links */}
          <div className="flex items-center justify-center gap-16 py-8 md:w-1/3">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                aria-label={social.label}
                className="text-white hover:opacity-80 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name={social.icon} className="w-6 h-6 fill-white" />
              </a>
            ))}
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px bg-primary-700 self-stretch"></div>

          {/* Right Column - Useful Links & Copyright */}
          <div className="flex-1 flex flex-col justify-center py-8 md:pl-12">
            {/* Useful Links */}
            <div className="flex flex-wrap items-center justify-end gap-48 text-sm mb-4">
              {usefulLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-white hover:underline transition-colors"
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="flex justify-end text-neutral-500 text-sm">
              © 2022 República Portuguesa. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
  const footerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const socialUl = footer.querySelector('nav.flex.items-center.justify-center ul');
    if (!socialUl) return;
    const existingGithub = socialUl.querySelector('[aria-label="GitHub"]');
    if (existingGithub) return;
    const li = document.createElement('li');
    li.className = 'flex items-center';
    const githubLink = document.createElement('a');
    githubLink.href = 'https://github.com/amagovpt/';
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.setAttribute('aria-label', 'GitHub');
    githubLink.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>`;
    li.appendChild(githubLink);
    socialUl.appendChild(li);
  }, []);

  return (
    <footer className="bg-primary-900 text-white" ref={footerRef}>
      <FooterNavigation />
      <FederatedFooter
        darkMode={true}
        brandImage={{
          image: {
            src: '/Logos/logo.png',
            alt: 'dados.gov',
            style: { height: '43px', width: 'auto' }
          }
        }}
        caption="Plataforma aberta de dados públicos portugueses"
        partnersLogos={[
          { image: { src: '/Logos/NextGenerationEU.svg', alt: 'NextGenerationEU', style: { height: '24px', width: 'auto', opacity: 0.5 } } },
          { image: { src: '/Logos/republica-portuguesa.svg', alt: 'República Portuguesa', style: { height: '24px', width: 'auto', opacity: 0.5 } } },
          { image: { src: '/Logos/Logotipo_ARTE__Horizontal_branco_pt.svg', alt: 'ARTE', style: { height: '24px', width: 'auto', opacity: 0.5 } } },
        ]}
        socialsLink={socialLinksData.map((s) => ({
          icon: s.icon,
          iconHover: s.iconHover,
          link: { href: s.href, 'aria-label': s.label },
        }))}
        usefulLinks={usefulLinksData.map((l) => ({
          href: l.href,
          children: l.label,
        }))}
        copyright="© 2022 República Portuguesa. Todos os direitos reservados."
      />
    </footer>
  );
};
