'use client';

import {
  Button,
  InputSearchBar,
  Icon,
  CardArticle,
  CardGeneral,
} from '@ama-pt/agora-design-system';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-grow">
      <div className="w-full homepage">
        {/* Hero Section */}
        <div
          className="agora-card-highlight-newsletter"
          style={{
            backgroundImage: 'url("/hero-bg.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
          }}
        >
          <div className="card-container">
            <div className="card-content">
              <div className="title">
                <h1 className="container mx-auto text-white flex flex-col items-start leading-tight">
                  <span className="xl:text-3xl-bold md:text-3xl-bold xs:text-2xl-bold">
                    Plataforma aberta
                  </span>
                  <span className="xl:text-3xl-regular md:text-3xl-regular xs:text-2xl-regular font-light">
                    de dados públicos portugueses
                  </span>
                </h1>
              </div>
              <div className="subtitle">
                <div className="container mx-auto text-m-regular text-left">
                  Aceda, explore e reutilize dados públicos de forma transparente e acessível. Milhares de
                  <br />
                  conjuntos de dados ao seu dispor.
                </div>
              </div>
            </div>
            <div className="input-container">
              <div className="email-bar">
                <div className="container mx-auto grid xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 pb-64">
                  <div className="relative text-white">
                    <InputSearchBar
                      label="O que procura no Portal?"
                      placeholder="Pesquisar datasets, organizações, temas..."
                      id="portal-search"
                      hasVoiceActionButton={true}
                      voiceActionAltText="Pesquisar por voz"
                      searchActionAltText="Pesquisar"
                      darkMode={true}
                    />
                    <div className="mt-8 text-[14px] text-white">
                      Exemplos: &quot;educação&quot;, &quot;saúde pública&quot;, &quot;ambiente&quot;
                    </div>
                    <div className="mt-64">
                      <Button
                        variant="primary"
                        darkMode={true}
                        hasIcon={false}
                        className="px-24 py-16 rounded-8 h-auto"
                      >
                        <span className="text-lg font-medium">
                          Publicar <span className="font-bold">dados.gov</span>
                        </span>
                      </Button>
                    </div>
                    <div className="absolute w-full mb-64 bg-white text-neutral-900 shadow-lg dropdown"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Stats Section / Communities */}
        <div className="xl:py-64 bg-primary-900 text-white -mt-8 relative z-20 rounded-t-3xl shadow-top-low md:mt-0 md:border-none md:shadow-none">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl-bold text-white">
              <span className="text-2xl-bold">Uma comunidade</span>{' '}
              <span className="text-2xl-light">dinâmica e empenhada</span>
            </h2>
            <p className=" mt-16 mb-32">
              Partilhe a utilização e a troca de dados entre produtores e reutilizadores de dados.
            </p>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-32">
              <div className="flex flex-col gap-4">
                <div className="icon-container mb-16 bg-[#F0F5FF] text-[#002D72]">
                  <Icon name="agora-line-layers-menu" aria-hidden="true" className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">
                    47,825
                  </span>
                  <span className="">Conjuntos de Dados</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="icon-container mb-16 bg-[#FFF1F1] text-[#D42B34]">
                  <Icon name="agora-line-document" aria-hidden="true" className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">
                    2,456
                  </span>
                  <span className="">Organizações</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="icon-container mb-16 bg-[#EDFBF2] text-[#008947]">
                  <Icon name="agora-line-document" aria-hidden="true" className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">
                    8,234
                  </span>
                  <span className="">Reutilizações</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="icon-container mb-16 bg-[#FFFAEB] text-[#8C4B00]">
                  <Icon name="agora-line-user-group" aria-hidden="true" className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">
                    152K
                  </span>
                  <span className="">Utilizadores</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Datasets */}
        <div className="xl:py-64 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl-bold text-primary-900 ">
              Conjunto de Dados em Destaque
            </h2>
            <p className="mt-16 mb-32 max-w-3xl">
              Conjuntos de dados mais populares e atualizados.
            </p>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-32">
              {[
                {
                  time: 'Hoje',
                  org: 'Agência Portuguesa do Ambiente',
                  title: 'Indicadores de Qualidade do Ar',
                  desc: 'Medições diárias da qualidade do ar em estações de monitorização em todo o país.',
                  views: '34 567',
                },
                {
                  time: '2 dias atrás',
                  org: 'Ministério da Saúde',
                  title: 'Base de Dados de Estabelecimentos de Saúde',
                  desc: 'Lista completa de todos os estabelecimentos de saúde em Portugal, incluindo hospitais, centros de saúde e clínicas.',
                  views: '45 678',
                },
                {
                  time: '3 dias atrás',
                  org: 'Instituto Nacional de Estatística',
                  title: 'Dados Demográficos Municipais',
                  desc: 'População, densidade, faixas etárias e indicadores demográficos por município.',
                  views: '52 341',
                },
              ].map((item, i) => (
                <CardGeneral
                  key={i}
                  variant="white"
                  pillText={item.time}
                  subtitleText={item.org}
                  titleText={item.title}
                  descriptionText={
                    (
                      <div className="flex flex-col gap-16">
                        <span>{item.desc}</span>
                        <div className="flex items-center gap-8 text-neutral-600">
                          <Icon
                            name="agora-line-eye"
                            className="w-20 h-20"
                            aria-hidden="true"
                          />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    ) as unknown as string
                  }
                  isBlockedLink={true}
                  anchor={{ href: '#' }}
                />
              ))}
            </div>
            <div className="mt-64">
              <Button variant="primary" appearance="outline">
                Ver mais
              </Button>
            </div>
          </div>
        </div>

        {/* Utilizado diariamente por */}
        <div className="xl:py-64 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl-bold text-primary-900 mb-32">
              Utilizado diariamente por
            </h2>
            <div className="grid grid-cols-5 md:grid-cols-5 gap-8 items-center justify-items-center">
              {['arte.svg', 'ADC.svg', 'IMPIC.svg', 'DSPA.svg', 'apa.svg'].map(
                (logo, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center w-full h-20"
                  >
                    <img
                      src={`/${logo}`}
                      alt={`Logo ${logo.replace('.svg', '')}`}
                      className="max-h-12 max-w-[160px] object-contain"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Reuses */}
        <div className="xl:py-64 bg-primary-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl-bold text-white">
              Storytellings em Destaque
            </h2>
            <p className="mt-16 mb-32 max-w-3xl text-white">
              Storytellings mais populares
            </p>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-32">
              {[
                {
                  img: 'storytelling1.svg',
                  title: 'Gestão de resíduos contentores e ecopontos',
                  subtitle: 'Publicado a DD MM AAAA',
                },
                {
                  img: 'storytelling2.svg',
                  title:
                    'Sistema de Monitorização do Ordenamento do Território (SMOT)',
                  subtitle: 'Publicado a DD MM AAAA',
                },
                {
                  img: 'storytelling3.svg',
                  title:
                    'Emissões GEE por setor (Portugal) — visualização + API (P7CO®)',
                  subtitle: 'Publicado a DD MM AAAA',
                },
              ].map((story, i) => (
                <CardArticle
                  key={i}
                  variant="indented"
                  image={{
                    src: `/${story.img}`,
                    alt: story.title,
                  }}
                  subtitle={story.subtitle}
                  title={story.title}
                  mainAnchor={{
                    href: '#',
                    target: '_self',
                    title: 'Ver mais',
                    hasIcon: true,
                    iconOnly: true,
                    leadingIcon: 'agora-line-arrow-right-circle',
                    leadingIconHover: 'agora-solid-arrow-right-circle',
                    variant: 'primary',
                  }}
                  blockedLink={true}
                />
              ))}
            </div>
            <div className="mt-64 mt-12">
              <Button variant="primary" appearance="outline" darkMode={true}>
                Ver mais
              </Button>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div className="xl:py-64 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-primary-900 mb-64">
              <span className="text-2xl-light">Últimas</span> <span className="text-2xl-bold">novidades</span>
            </h2>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-32">
              {['last-new1.svg', 'last-new2.svg', 'last-new3.svg'].map(
                (img, i) => (
                  <CardArticle
                    key={i}
                    image={{
                      src: `/${img}`,
                      alt: `Novidade ${i + 1}`,
                    }}

                    subtitle="Publicado em 21 de novembro de 2024"
                    title="Webinar Developers e Data Scientists: Publicação e uso de dados abertos"
                    mainAnchor={{
                      href: '/pages/article',
                      target: '_self',
                      title: 'Ver mais',
                      hasIcon: true,
                      iconOnly: true,
                      leadingIcon: 'agora-line-arrow-right-circle',
                      leadingIconHover: 'agora-solid-arrow-right-circle',
                      variant: 'primary',
                    }}
                    blockedLink={true}
                  />
                )
              )}
            </div>
            <div className="mt-64">
              <Link href="/pages/article">
                <Button variant="primary" appearance="outline">
                  Ver mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main >
  );
}
