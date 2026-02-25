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
            backgroundImage: 'url("/Banner/hero-bg.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
          }}
        >
          <div className="card-container">
            <div className="card-content">
              <div className="title">
                <h1 className="container mx-auto text-white flex flex-col items-start leading-tight">
                  <span className="xs:text-xl-bold md:text-2xl-bold xl:text-2xl-bold">
                    Plataforma aberta
                  </span>
                  <span className="xs:text-xl-light md:text-2xl-light xl:text-2xl-light">
                    de dados públicos portugueses
                  </span>
                </h1>
              </div>
              <div className="subtitle">
                <div className="container mx-auto text-left">
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
                    <div className="mt-8 text-s-regular">
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
        <div className="py-64 bg-primary-900 text-white -mt-8 relative z-20 rounded-t-3xl shadow-top-low md:mt-0 md:border-none md:shadow-none">
          <div className="container mx-auto px-4">
            <div className="grid xs:grid-cols-1 xl:grid-cols-12 gap-64 items-center">
              {/* Left: title + description */}
              <div className="xl:col-span-5 flex flex-col gap-24">
                <h2 className="text-white">
                  <span className="text-l-bold">Uma comunidade</span>
                  <br></br>
                  <span className="xs:text-xl-light md:text-2xl-light xl:text-2xl-light whitespace-nowrap">Dinâmica e empenhada</span>
                </h2>
                <p className="text-m-regular max-w-sm">
                  Partilhe a utilização e a troca de dados entre produtores e
                  reutilizadores de dados.
                </p>
              </div>

              {/* Right: 2x2 stats grid */}
              <div className="xl:col-span-7 grid xs:grid-cols-1 sm:grid-cols-2 gap-x-64 gap-y-48">
                <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32">
                  <div className="xl:col-span-6 flex flex-col gap-48">
                    {/* Item 1 */}
                    <div className="flex items-center gap-24">
                      <div className="stats-icon-wrapper text-[#A6D5FF] border-[#A6D5FF]">
                        <Icon name="agora-line-layers-menu" aria-hidden="true" className="w-[24px] h-[24px]" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-8">
                          <span className="text-2xl-semibold">47 825</span>
                          <span className="text-l-bold ">mil</span>
                        </div>
                        <span>Conjuntos de Dados</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-24">
                      <div className="stats-icon-wrapper text-[#CBFF3F] border-[#CBFF3F]">
                        <Icon name="agora-line-document" aria-hidden="true" className="w-[24px] h-[24px]" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-8">
                          <span className="text-2xl-semibold">2 456</span>
                          <span className="text-l-bold ">mil</span>
                        </div>
                        <span>Organizações</span>
                      </div>
                    </div>
                  </div>
                  <div className="xl:col-span-6 flex flex-col gap-48">
                    {/* Item 3 */}
                    <div className="flex items-center gap-24">
                      <div className="stats-icon-wrapper text-[#D600FF] border-[#D600FF]">
                        <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[15px] h-[24px]">
                          <path d="M0 22.9091V15.2727C0 14.6702 0.479695 14.1818 1.07143 14.1818C1.66316 14.1818 2.14286 14.6702 2.14286 15.2727V22.9091C2.14286 23.5116 1.66316 24 1.07143 24C0.479695 24 0 23.5116 0 22.9091ZM6.42857 22.9091V1.09091C6.42857 0.488417 6.90827 0 7.5 0C8.09173 0 8.57143 0.488417 8.57143 1.09091V22.9091C8.57143 23.5116 8.09173 24 7.5 24C6.90827 24 6.42857 23.5116 6.42857 22.9091ZM12.8571 22.9091V9.81818C12.8571 9.21569 13.3368 8.72727 13.9286 8.72727C14.5203 8.72727 15 9.21569 15 9.81818V22.9091C15 23.5116 14.5203 24 13.9286 24C13.3368 24 12.8571 23.5116 12.8571 22.9091Z" fill="currentColor" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-8">
                          <span className="text-2xl-semibold">8 234</span>
                          <span className="text-l-bold ">mil</span>
                        </div>
                        <span>Reutilizações</span>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center gap-24">
                      <div className="stats-icon-wrapper text-[#FFD700] border-[#FFD700]">
                        <Icon name="agora-line-user-group" aria-hidden="true" className="w-[24px] h-[24px]" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-8">
                          <span className="text-2xl-semibold">+152</span>
                          <span className="text-l-bold">milhões</span>
                        </div>
                        <span>Utilizadores</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Featured Datasets */}
        <div className="xl:py-64 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl-bold mb-32 text-primary-900 ">
              Conjunto de dados
            </h2>

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
                <div key={i} className="dataset-card-bordered border-2 border-[#1A65FA] rounded-8 overflow-hidden h-full">
                  <CardGeneral
                    variant="white"
                    pillText={item.time}
                    subtitleText={item.org}
                    titleText={item.title}
                    descriptionText={
                      (
                        <div className="flex flex-col gap-16 grow">
                          <div className="flex items-center gap-8 text-neutral-900 mt-16 mb-8">
                            <div className="w-8 h-8 rounded-full bg-primary-600" aria-hidden="true" />
                            <span className="text-s-regular">{item.views} visualizações</span>
                          </div>
                          <span className="text-m-regular text-neutral-800 line-clamp-3">
                            {item.desc}
                          </span>
                          <div className="flex items-center gap-8 text-primary-600 mt-auto">
                            <Icon
                              name="agora-line-arrow-right-circle"
                              className="w-32 h-32"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      ) as unknown as string
                    }
                    isBlockedLink={true}
                    anchor={{ href: '#' }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-64">
              <Link href="/pages/datasets">
                <Button
                  variant="primary"
                  appearance="link"
                  hasIcon={true}
                  trailingIcon="agora-line-arrow-right-circle"
                  trailingIconHover="agora-solid-arrow-right-circle"
                  className="p-0! h-auto"
                >
                  <span>Ver todos os conjuntos de dados</span>
                </Button>
              </Link>
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
                      src={`/Logos/${logo}`}
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
                  img: 'Storytellings/storytelling1.svg',
                  title: 'Gestão de resíduos contentores e ecopontos',
                  subtitle: 'Publicado a DD MM AAAA',
                },
                {
                  img: 'Storytellings/storytelling2.svg',
                  title:
                    'Sistema de Monitorização do Ordenamento do Território (SMOT)',
                  subtitle: 'Publicado a DD MM AAAA',
                },
                {
                  img: 'Storytellings/storytelling3.svg',
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
              {['Articles/last-new1.svg', 'Articles/last-new2.svg', 'Articles/last-new3.svg'].map(
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
