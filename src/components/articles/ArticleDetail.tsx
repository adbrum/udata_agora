'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb, Button, Icon, CardArticle, CardLinks } from '@ama-pt/agora-design-system';
import PageBanner from '@/components/PageBanner';
import { useRouter } from 'next/navigation';

// Mock data for articles (same as in ArticleClient)
const MOCK_ARTICLES = [
  {
    id: '1',
    slug: 'webinar-developers-data-scientists',
    title: 'Webinar Developers e Data Scientists: Publicação e uso de dados abertos',
    description: 'Participe no nosso próximo webinar focado em ferramentas e APIs para a comunidade técnica. Saiba como tirar o melhor partido dos dados abertos portugueses.',
    fullContent: '3 meses de eventos focados em dados públicos. Encontre todos os replays desde o início da nova temporada. O portal dados.gov tem o prazer de apresentar uma série de webinars dedicados à comunidade técnica. Neste evento particular, focaremos na publicação e uso de dados abertos, explorando como as APIs podem facilitar o acesso à informação pública.',
    date: '21 de novembro de 2024',
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
    date: '15 de novembro de 2024',
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
    date: '10 de novembro de 2024',
    organization: 'Laboratório de Inovação',
    image: '/Articles/last-new3.svg',
    views: '2 105',
    comments: '24'
  },
  {
    id: '4',
    slug: 'retrospectiva-temporada',
    title: 'Uma retrospectiva da temporada de volta às aulas do data.gouv.fr',
    description: '3 meses de eventos focados em dados públicos. Encontre todos os replays desde o início da nova temporada.',
    fullContent: 'Reviva os melhores momentos da nossa temporada de eventos. Desde discussões profundas sobre governação de dados até demonstrações práticas de novas ferramentas.',
    date: '18 de dezembro de 2025',
    organization: 'ADMIN',
    image: '/Banner/cubes.svg',
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

  return (
    <div className="flex flex-col font-sans text-neutral-900 bg-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-white text-neutral-900 pt-24 pb-48 sm:pb-64">
        <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
          <div className="mb-24">
            <Breadcrumb
              darkMode={false}
              items={[
                { label: 'Home', url: '/' },
                { label: 'Últimas novidades', url: '/pages/article' },
                { label: article.title, url: `/pages/article/${article.slug}` }
              ]}
            />
          </div>

          <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32 mt-6">
            <div className="xl:col-span-8">
              <h1 className="text-2xl-bold text-primary-900 mb-24">{article.title}</h1>
              <div className="flex items-center gap-16 text-neutral-500 mb-32">
                <span>{article.organization}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
              <div className="relative w-full aspect-video rounded-8 overflow-hidden mb-32 border-2 border-primary-50">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="prose max-w-none text-neutral-900 leading-relaxed text-lg">
                <p className="mb-24 font-medium text-xl leading-relaxed">
                  {article.description}
                </p>
                <p className="mb-24">
                  {article.fullContent}
                </p>
                <div className="bg-primary-50 p-32 rounded-16 mb-24 border border-primary-100">
                  <h3 className="text-l-bold mb-16">Destaques do artigo</h3>
                  <ul className="list-disc pl-24 space-y-8">
                    <li>Conteúdo técnico avançado</li>
                    <li>Foco em APIs e ferramentas</li>
                    <li>Exemplos práticos de implementação</li>
                  </ul>
                </div>
              </div>
            </div>

            <aside className="xl:col-span-4 flex flex-col gap-24">
              <div className="bg-[#F2F6FF] p-32 rounded-16 border border-primary-100">
                <h3 className="text-sm font-bold tracking-wider mb-16 uppercase text-primary-700">Métricas do Artigo</h3>
                <div className="space-y-16">
                  <div className="flex items-center gap-12">
                    <Icon name="agora-line-eye" className="w-24 h-24 text-primary-900" />
                    <span className="text-neutral-900 font-medium">{article.views} visualizações</span>
                  </div>
                  <div className="flex items-center gap-12">
                    <Icon name="agora-line-comment" className="w-24 h-24 text-primary-900" />
                    <span className="text-neutral-900 font-medium">0 comentários</span>
                  </div>
                  <div className="flex items-center gap-12">
                    <Icon name="agora-line-star" className="w-24 h-24 text-primary-900" />
                    <span className="text-neutral-900 font-medium">{article.comments} favoritos</span>
                  </div>
                </div>
                <div className="mt-24 pt-24 border-t border-primary-200">
                  <Button
                    variant="primary"
                    className="w-full"
                    hasIcon={true}
                    leadingIcon="agora-line-star"
                    leadingIconHover="agora-solid-star"
                  >
                    Adicionar aos favoritos
                  </Button>
                </div>
              </div>

              <div className="bg-white p-32 rounded-16 border border-neutral-200">
                <h3 className="text-sm font-bold tracking-wider mb-16 uppercase text-neutral-500">Partilhar</h3>
                <div className="flex gap-16">
                  <Button variant="primary" appearance="outline" hasIcon={true} leadingIcon="agora-line-facebook" className="p-8 h-auto" />
                  <Button variant="primary" appearance="outline" hasIcon={true} leadingIcon="agora-line-twitter" className="p-8 h-auto" />
                  <Button variant="primary" appearance="outline" hasIcon={true} leadingIcon="agora-line-linkedin" className="p-8 h-auto" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related News */}
      <section className="bg-neutral-50 py-64 border-t border-neutral-200">
        <div className="container mx-auto px-4 sm:px-16 md:px-32 lg:px-64">
          <h2 className="text-xl-bold text-primary-900 mb-32">Artigos relacionados</h2>
          <div className="grid md:grid-cols-3 gap-32">
            {MOCK_ARTICLES.filter(a => a.id !== article.id).slice(0, 3).map(related => (
              <div
                key={related.id}
                className="h-full cursor-pointer group"
                onClick={() => router.push(`/pages/article/${related.slug}`)}
              >
                <CardLinks
                  className="text-neutral-900 transition-all group-hover:shadow-md"
                  variant="white"
                  image={{
                    src: related.image || '/laptop.png',
                    alt: related.title,
                  }}
                  category={related.organization}
                  title={<div className="underline text-lg font-bold line-clamp-2">{related.title}</div>}
                  description={
                    <p className="text-sm line-clamp-3 text-neutral-900 mt-[8px]">
                      {related.description}
                    </p>
                  }
                  date={<span className="font-[300]">{related.date}</span>}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
