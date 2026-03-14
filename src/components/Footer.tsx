'use client';

import React from 'react';
import { FederatedFooter } from '@ama-pt/agora-design-system';

const linkColumns = [
  {
    title: 'Dados abertos',
    links: [
      { href: '#', label: 'Catálogo de dados' },
      { href: '#', label: 'Portal de dados da empresa' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { href: '#', label: 'Sobre nós' },
      { href: '#', label: 'Termos de utilização' },
    ],
  },
  {
    title: 'Desenvolvimento',
    links: [
      { href: '#', label: 'API do portal' },
      { href: '#', label: 'Motor de código aberto: udata (14.7.2)' },
      { href: '#', label: 'Interface de utilizador de data.gov.pt: cdata (jj2422c)' },
    ],
  },
];

const socialLinksData = [
  { icon: 'agora-line-facebook', iconHover: 'agora-solid-facebook', href: 'https://facebook.com', label: 'Facebook' },
  { icon: 'agora-line-linkedin', iconHover: 'agora-solid-linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: 'agora-line-twitter-x', iconHover: 'agora-solid-twitter-x', href: 'https://twitter.com', label: 'X (Twitter)' },
];

const usefulLinksData = [
  { href: '#', label: 'República Portuguesa' },
  { href: '#', label: 'Compete 2020' },
  { href: '#', label: 'Portugal 2020' },
  { href: '#', label: 'Comissão Europeia' },
];

// Element 1: Links Navigation
const FooterNavigation = () => {
  return (
    <div className="container mx-auto px-4 py-12 xl:py-64">
      <h3 className="text-l-bold mb-8 text-white mb-[32px]">Mais para descobrir no portal</h3>
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-32">
        {linkColumns.map((column, idx) => (
          <div key={idx}>
            <h4 className="text-m-semibold text-white mb-[16px]">{column.title}</h4>
            <ul className="space-y-2">
              {column.links.map((link, linkIdx) => (
                <li className="mb-[16px] gap-32" key={linkIdx}>
                  <a
                    href={link.href}
                    className="text-white hover:underline text-sm transition-colors"
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
            <img src="/Logos/ARTE.svg" alt="ARTE" />
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
  return (
    <footer className="bg-primary-900 text-white">
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
