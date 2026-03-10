'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb, Icon } from '@ama-pt/agora-design-system';
import { useRouter } from 'next/navigation';

// Mock data for articles (including more for the sidebar)
const MOCK_ARTICLES = [
  {
    id: '1',
    slug: 'webinar-developers-data-scientists',
    title: 'Webinar Developers e Data Scientists: Publicação e uso de dados abertos',
    description: 'Participe no nosso próximo webinar focado em ferramentas e APIs para a comunidade técnica. Saiba como tirar o melhor partido dos dados abertos portugueses.',
    fullContent: '3 meses de eventos focados em dados públicos. Encontre todos os replays desde o início da nova temporada. O portal dados.gov tem o prazer de apresentar uma série de webinars dedicados à comunidade técnica. Neste evento particular, focaremos na publicação e uso de dados abertos, explorando como as APIs podem facilitar o acesso à informação pública.',
    date: '01 de agosto de 2025',
    organization: 'Portal Dados Abertos',
    image: '/Articles/last-new1.svg',
    views: '1 234',
    comments: '12'
  },
  {
    id: '2',
    slug: 'nova-data-webinar-empresas',
    title: 'NOVA DATA - Webinar Dados Abertos: Importância para as empresas',
    description: 'Devido à elevada procura, agendámos uma nova data para o webinar sobre o impacto económico e social da abertura de dados no setor empresarial.',
    fullContent: 'O impacto económico dos dados abertos é inegável. Neste webinar, especialistas discutem como as empresas podem utilizar datasets públicos para inovar e criar novos modelos de negócio.',
    date: '01 de agosto de 2025',
    organization: 'Ministério da Economia',
    image: '/Articles/last-new2.svg',
    views: '856',
    comments: '5'
  },
  {
    id: '3',
    slug: 'workshop-visualizacao-dados',
    title: 'Workshop Prático: Visualização de Dados para o Cidadão',
    description: 'Aprenda a criar visualizações impactantes a partir de conjuntos de dados públicos utilizando ferramentas gratuitas e acessíveis.',
    fullContent: 'A visualização de dados é uma competência essencial na era da informação. Participe neste workshop para aprender técnicas básicas e avançadas de representação visual de dados públicos.',
    date: '01 de agosto de 2025',
    organization: 'Laboratório de Inovação',
    image: '/Articles/last-new3.svg',
    views: '2 105',
    comments: '24'
  },
  {
    id: '4',
    slug: 'retrospectiva-temporada',
    title: 'Uma retrospectiva da temporada de volta às aulas do data.gouv.fr - 3 meses de eventos focados em dados públicos.',
    description: 'Encontre todos os replays desde o início da nova temporada.',
    fullContent: `O período de volta às aulas ocorreu de setembro a dezembro de 2025 e utilizou diversos formatos:
• Mesas-redondas para refletir sobre os desafios dos dados abertos e compartilhar experiências concretas;
• Sessões de perguntas e respostas e tempo para discussão com as equipas da plataforma e as partes interessadas no ecossistema;
• Workshops práticos e demonstrações para desenvolver habilidades em ferramentas, APIs e melhores práticas;
• Webinários temáticos ;
• Hackathon sobre projeções climáticas , coorganizado com a Météo-France.

Todas as gravações já estão disponíveis
Boas notícias: todos os webinars e sessões gravadas estão disponíveis para reprodução ! Se você perdeu alguma sessão ou deseja aprofundar-se em tópicos específicos, pode assisti-los (ou reassisti-los) a qualquer momento.

Encontre as gravações dos webinars na página dedicada .

Quer ir mais longe?
Assine a newsletter do data.gouv.fr para receber os próximos eventos diretamente na sua caixa de entrada.`,
    date: '18.12.2025',
    organization: 'ADMIN',
    image: '/Articles/retrospectiva.svg',
    views: '3 420',
    comments: '45'
  }
];

interface ArticleDetailProps {
  rid: string;
}

export default function ArticleDetail({ rid }: ArticleDetailProps) {
  const router = useRouter();
  // Find the article by slug (rid) or ID
  const article = MOCK_ARTICLES.find(a => a.slug === rid || a.id === rid) || MOCK_ARTICLES[0];

  // If the rid is for the specific article in Figma, ensure we use that data
  const isFigmaArticle = rid === 'retrospectiva-temporada' || article.id === '4';

  const displayTitle = isFigmaArticle ? 'Uma retrospectiva da temporada de volta às aulas do data.gouv.fr - 3 meses de eventos focados em dados públicos.' : article.title;
  const displayDate = isFigmaArticle ? '18.12.2025' : article.date;
  const displayDescription = isFigmaArticle ? 'Encontre todos os replays desde o início da nova temporada.' : article.description;

  const relatedArticlesRaw = [
    {
      date: '01 de agosto de 2025',
      title: 'Title text lorem ipsum dolor',
      image: '/Articles/last-new1.svg',
      slug: 'webinar-developers-data-scientists'
    },
    {
      date: '01 de agosto de 2025',
      title: 'Title text lorem ipsum dolor',
      image: '/Articles/last-new2.svg',
      slug: 'nova-data-webinar-empresas'
    },
    {
      date: '01 de agosto de 2025',
      title: 'Title text lorem ipsum dolorTitle text lorem ipsum dolorTitle text lorem ipsum dolor',
      image: '/Articles/last-new3.svg',
      slug: 'workshop-visualizacao-dados'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'agora-line-facebook', href: '#' },
    { name: 'Twitter', icon: 'agora-line-twitter', href: '#' },
    { name: 'LinkedIn', icon: 'agora-line-linkedin', href: '#' },
    { name: 'WhatsApp', customIcon: '/Icons/whatsapp.svg', href: '#' },
    { name: 'e-mail', icon: 'agora-line-mail', href: '#' }
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen font-sans text-neutral-900 pb-128">
      {/* Main Content Area */}
      <main className="container mx-auto px-16 sm:px-32 lg:px-64 pt-32">
        {/* Breadcrumbs */}
        <div className="mb-48">
          <Breadcrumb
            items={[
              { label: 'Início', url: '/' },
              { label: 'Artigos', url: '/pages/article' },
              { label: displayTitle, url: '#' }
            ]}
          />
        </div>

        {/* Article Header */}
        <div className="mb-40">
          <span className="text-neutral-600 text-m-regular block mb-16">
            Publicado em {displayDate}
          </span>
          <h1 className="text-2xl-bold md:text-3xl-bold text-primary-900 mb-24 leading-tight">
            {displayTitle}
          </h1>
          <p className="text-xl-light text-neutral-700 max-w-[592px]">
            {displayDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-80 bg-neutral-50 full-width-bg">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 flex flex-col gap-48">
            <div className="max-w-[592px] whitespace-pre-wrap text-m-regular text-neutral-800 leading-relaxed">
              <h2 className="text-l-bold text-primary-900 mt-0 mb-16">Três meses de acontecimentos para reviver</h2>

              <p className="mb-16">
                O período de volta às aulas ocorreu de setembro a dezembro de 2025 e utilizou diversos formatos:
              </p>

              <ul className="list-disc pl-24 space-y-8 mb-24">
                <li>Mesas-redondas para refletir sobre os desafios dos dados abertos e compartilhar experiências concretas;</li>
                <li>Sessões de perguntas e respostas e tempo para discussão com as equipas da plataforma e as partes interessadas no ecossistema;</li>
                <li>Workshops práticos e demonstrações para desenvolver habilidades em ferramentas, APIs e melhores práticas;</li>
                <li>Webinários temáticos ;</li>
                <li>Hackathon sobre projeções climáticas , coorganizado com a Météo-France.</li>
              </ul>

              <h2 className="text-l-bold text-primary-900 mt-32 mb-16">Todas as gravações já estão disponíveis</h2>

              <p className="mb-16">
                Boas notícias: todos os webinars e sessões gravadas estão disponíveis para reprodução ! Se você perdeu alguma sessão ou deseja aprofundar-se em tópicos específicos, pode assisti-los (ou reassisti-los) a qualquer momento.
              </p>

              <p className="mb-32">
                <Link href="#" className="text-primary-600 underline hover:text-primary-700 transition-colors">Encontre as gravações dos webinars na página dedicada</Link>.
              </p>

              {/* Image box from Figma */}
              <div className="my-40 rounded-8 overflow-hidden bg-neutral-100">
                <img
                  src="/Articles/retrospectiva-inner.svg"
                  alt="Retropectiva"
                  className="w-full object-cover aspect-[16/9]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/1200/800?random=1';
                  }}
                />
              </div>

              <h2 className="text-l-bold text-primary-900 mt-32 mb-16">Quer ir mais longe?</h2>

              <p className="mb-32">
                <Link href="#" className="text-primary-600 underline hover:text-primary-700 transition-colors">Assine a</Link> newsletter do data.gouv.fr para receber os próximos eventos diretamente na sua caixa de entrada.
              </p>
            </div>


            {/* Partilhar section */}
            <div className="pt-32 border-t border-neutral-200 max-w-[592px]">
              <span className="text-s-regular text-neutral-600 block mb-24">Partilhar esta notícia</span>
              <div className="flex flex-wrap gap-24 md:gap-40">
                {socialLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="flex items-center gap-8 text-primary-600 hover:text-primary-700 transition-colors group">
                    {link.icon ? (
                      <Icon name={link.icon as any} className="w-20 h-20" aria-hidden="true" />
                    ) : (
                      <img src={link.customIcon} alt="" className="w-20 h-20" />
                    )}
                    <span className="text-s-bold">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (Other Relatated Articles) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32">
              <h3 className="text-l-regular text-neutral-800 mb-24">
                Outros <span className="font-bold">artigos</span> relacionados
              </h3>
              <div className="flex flex-col gap-24">
                {relatedArticlesRaw.map((rel, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between gap-16 items-start pb-24 border-b border-neutral-100 last:border-0 cursor-pointer group"
                    onClick={() => router.push(`/pages/article/${rel.slug}`)}
                  >
                    <div className="flex flex-col gap-8 flex-grow">
                      <span className="text-xs text-neutral-500">{rel.date}</span>
                      <h4 className="text-s-bold text-primary-900 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="w-[124px] h-[70px] flex-shrink-0 bg-neutral-100 rounded-4 overflow-hidden shadow-sm">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/300/200?random=${idx}`;
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
