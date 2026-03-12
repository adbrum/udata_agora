'use client';

import React from 'react';
import { FederatedFooter } from '@ama-pt/agora-design-system';

const linkColumns = [
  {
    title: 'Dados abertos',
    links: [
      { href: '/pages/themes', label: 'Temas' },
      { href: '#', label: 'Dados de referência' },
      { href: '#', label: 'Catálogo de dados' },
      { href: '#', label: 'Acompanhe a abertura dos dados' },
      { href: '#', label: 'Portal de dados' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { href: '#', label: 'Guias' },
      { href: '#', label: 'Roteiro e novos desenvolvimentos' },
      { href: '/pages/support', label: 'Escreva-nos' },
      { href: '#', label: 'Interaja com a comunidade' },
      { href: '#', label: 'Estatísticas' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },
      { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },
      { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },
      { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },
      { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },

    ],
  },
  {
    title: 'Desenvolvimento',
    links: [
      { href: '#', label: 'API do portal' },
      { href: '#', label: 'Motor de código aberto: udata (14.7.2)' },
      { href: '#', label: 'Interface de usuário de data.gov.pt: cdata (jj2422c)' },
    ],
  },
];

const socialLinksData = [
  { icon: 'agora-line-facebook', href: 'https://facebook.com', label: 'Facebook' },
  { icon: 'agora-line-linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: 'agora-line-twitter', href: 'https://twitter.com', label: 'X (Twitter)' },
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
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-32">
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
          { image: { src: '/Logos/NextGenerationEU.svg', alt: 'NextGenerationEU' } },
          { image: { src: '/Logos/República Portuguesa.svg', alt: 'República Portuguesa' } },
          { image: { src: '/Logos/ARTE.svg', alt: 'ARTE' } },
        ]}
        socialsLink={socialLinksData.map((s) => ({
          icon: s.icon,
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
