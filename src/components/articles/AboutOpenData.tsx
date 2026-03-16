"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumb, Icon, CardArticle, Button } from "@ama-pt/agora-design-system";

const AboutOpenData = () => {
  const relatedArticles = [
    {
      date: "01 de agosto de 2025",
      title: "Title text lorem ipsum dolor",
      image: "/Articles/last-new1.svg",
    },
    {
      date: "01 de agosto de 2025",
      title: "Title text lorem ipsum dolor",
      image: "/Articles/last-new2.svg",
    },
    {
      date: "01 de agosto de 2025",
      title:
        "Title text lorem ipsum dolorTitle text lorem ipsum dolorTitle text lorem ipsum dolor",
      image: "/Articles/last-new3.svg",
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "agora-line-facebook", href: "#" },
    { name: "Twitter", icon: "agora-line-twitter", href: "#" },
    { name: "LinkedIn", icon: "agora-line-linkedin", href: "#" },
    { name: "WhatsApp", customIcon: "/Icons/whatsapp.svg", href: "#" },
    { name: "e-mail", icon: "agora-line-mail", href: "#" },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen font-sans">
      <main className="flex-grow pt-32 pb-64">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="pt-[32px] mb-[64px]">
            <Breadcrumb
              items={[
                { label: "In\u00EDcio", url: "/" },
                { label: "Conhecimento", url: "#" },
                { label: "Sobre dados abertos", url: "/pages/about-open-data" },
              ]}
            />
          </div>

          {/* Hero Section */}
          <div className="mb-64">
            <span className="text-primary-dark text-l-regular block mb-16">
              Publicado em 18.12.2025
            </span>
            <h1 className="text-[32px] font-medium text-[#021C51] mb-16 leading-tight max-w-[800px]">
              Sobre dados abertos
            </h1>
            <p className="text-[16px] text-neutral-700 max-w-[592px] mb-[32px]">
              Descubra como os dados abertos estão a transformar a transparência
              pública e a inovação em Portugal.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-[64px] lg:gap-[240px]">
            {/* Left - Main Content */}
            <div className="flex-shrink-0">
              <div className="text-[#2b363c] flex flex-col gap-[32px]">
                <div className="max-w-[592px]">
                  <h2 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
                    Conjuntos de dados abertos
                  </h2>
                  <p className="text-[16px] leading-[28px] mb-[16px] italic text-neutral-600 border-l-2 border-primary-200 pl-[16px]">
                    Um conjunto de dados, publicados ou geridos por um único
                    agente, e disponibilizado para acesso ou download através de
                    um ou mais formatos.
                    <br />
                    <span className="text-[14px]">
                      {" "}
                      W3C Data Catalogue Vocabulary (DCAT)
                    </span>
                  </p>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Conjuntos de dados, no contexto dos dados abertos públicos,
                    são agrupamentos de dados em formato digital, dedicados a um
                    tema específico. Uma lista de moradas de serviços de
                    atendimento ao público, por exemplo, ou dados mensais sobre
                    práticas de gestão ou contratação de um organismo público.
                  </p>
                </div>

                <div className="max-w-[592px]">
                  <h2 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
                    Dados sem restrições de reutilização
                  </h2>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Um dos pontos fundamentais dos dados abertos é a ideia de
                    que qualquer pessoa ou entidade pode utilizar, transformar ou
                    adaptar os dados públicos para rentabilizar num contexto de
                    negócio.
                  </p>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Quando falamos em dados abertos públicos, podemos considerar
                    dados relativos a: contratação pública, gestão de organismos
                    públicos, estatísticas económicas e financeiras, despesas e
                    receitas públicas, resultados eleitorais, georreferenciação
                    de moradas e serviços públicos, horários de transportes,
                    indicadores de qualidade de serviço, entre muitos outros.
                  </p>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Grande parte desta informação pode até já estar disponível
                    publicamente, mas para que um determinado conjunto de dados
                    governamentais possa ser classificado como Aberto é
                    necessário que não existam restrições ao seu acesso, sejam
                    estas legais ou políticas, tecnológicas ou financeiras.
                  </p>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Assim, distingue-se dados abertos de dados que sejam apenas
                    disponibilizados ao público. Os dados abertos são sempre
                    abrangidos por licenças abertas, que permitem reutilização
                    comercial. Se assim não for – não poderão ser considerados
                    dados abertos.
                  </p>
                </div>

                <div className="max-w-[592px]">
                  <h2 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
                    Privacidade e dados abertos
                  </h2>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Nem toda a informação do sector público deve ser tornada
                    pública. Há um vasto conjunto de dados na Administração
                    Pública que deve continuar na esfera de acesso restrito, seja
                    por razões de segurança, razões legais, ou direito à
                    privacidade dos cidadãos. As políticas de dados abertos não
                    estipulam que se &quot;abra&quot; toda a informação do
                    Estado, apenas aquela que pode ser considerada pública.
                  </p>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    As considerações relativamente à abertura de dados de
                    sectores específicos cabem às entidades que os gerem em
                    consonância com organismos como a Comissão Nacional de
                    Proteção de Dados.
                  </p>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Quando se fala de dados abertos fala-se sobretudo em dados
                    governamentais que já estão ou deveriam estar disponíveis
                    para a sociedade e que, assim, têm o potencial de se
                    tornarem abertos, garantindo sua reutilização em novos
                    projetos.
                  </p>
                </div>

                <div className="max-w-[592px]">
                  <h2 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
                    Como identificar conjuntos de dados para publicação?
                  </h2>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    No caso de não existirem ainda vários conjuntos de dados
                    delimitados e estruturados num organismo, que possam ser
                    imediatamente abertos, podemos começar por abrir apenas um
                    subconjunto desses dados.
                  </p>
                  <p className="text-[16px] leading-[28px] mb-[24px]">
                    Podemos começar por considerar disponibilizar informação que
                    já está disponível ao público, seja sob a forma de conteúdos
                    num site ou através de pedidos à organização, sob a forma
                    menos &quot;tratada&quot; de conjuntos de dados. Aqui e
                    patente a vantagem de disponibilizar dados em bruto, em
                    formatos abertos e lidos por máquina, de forma a privilegiar
                    a sua reutilização de forma livre.
                  </p>
                  <p className="text-[16px] leading-[28px] font-semibold mb-[16px]">
                    Regra geral, são especialmente apreciados pelos
                    reutilizadores de dados que privilegiem preocupações como:
                  </p>
                  <ul className="list-disc pl-[48px] space-y-[12px] mb-[24px] text-[16px] leading-[28px]">
                    <li>
                      Acesso às entidades, serviços disponíveis e pontos de
                      atendimento;
                    </li>
                    <li>
                      Transparência das contas, atividades e recursos da
                      entidade;
                    </li>
                    <li>
                      Monitorização de um tema, setor ou área de interesse
                      público.
                    </li>
                  </ul>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    É muito importante estabelecer também um compromisso de
                    manutenção e atualização dos dados. Nesse sentido, é embora
                    o esforço inicial seja um pouco mais elevado, é recomendável
                    a utilização de mecanismos automatizados (ex. API), para
                    garantir que o processo decorra de forma regular.
                  </p>
                </div>

                <div className="max-w-[592px]">
                  <h3 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
                    Dados com informação geográfica
                  </h3>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Nos dados a abrir deverá ser dedicada uma atenção e esforço
                    especiais à georreferenciação da informação, porque eleva
                    significativamente o interesse e o potencial de utilização
                    dos dados abertos. Ao enriquecer um conjunto de dados com
                    campos de referência geográfica, a entidade está a abrir o
                    potencial para o desenvolvimento de aplicacoes que permitem
                    visualizar os dados sobre um mapa.
                  </p>
                </div>

                <div className="max-w-[592px]">
                  <h3 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
                    Interagir com os reutilizadores
                  </h3>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    A interação com a comunidade de reutilizadores poderá
                    fornecer pistas preciosas sobre o tipo de dados a
                    disponibilizar.
                  </p>
                  <p className="text-[16px] leading-[28px]">
                    O organismo poderá fazer algum tipo de consulta pública e
                    perguntar aos seus interlocutores mais frequentes, ou a
                    outras partes interessadas, a que tipo de dados gostaria de
                    ter acesso.
                  </p>
                </div>

                <div className="max-w-[592px] pt-[32px]">
                  <p className="text-[16px] leading-[28px]">
                    A ARTE também poderá ajudar neste processo, incluindo
                    colaborar na organização de workshops / eventos com vista a
                    promover estas interações, contacte-nos em{" "}
                    <Link
                      href="mailto:dados@ama.pt"
                      className="text-[#034AD8] underline font-medium hover:text-primary-700"
                    >
                      dados@ama.pt
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Sidebar: Related Articles */}
            <div className="w-full lg:w-[384px] flex-shrink-0">
              <div className="pt-[96px] flex flex-col gap-[32px]">
                <p className="text-[20px] leading-[32px] text-[#021c51] font-light">
                  Outros <span className="font-bold">artigos</span> relacionados
                </p>

                <div className="flex flex-col gap-[16px]">
                  {relatedArticles.map((article, index) => (
                    <div key={index} className="flex flex-col gap-[32px]">
                      <div className="flex flex-col gap-[16px]">
                        <p className="text-[14px] leading-[24px] text-[#2b363c]">
                          Category
                        </p>
                        <div className="flex gap-[16px] items-start">
                          <div className="flex-1 flex flex-col gap-[8px] text-[16px] leading-[28px] text-[#2b363c]">
                            <p>{article.date}</p>
                            <p className="font-bold">{article.title}</p>
                          </div>
                          <div className="flex-1 relative min-h-[80px]">
                            <img
                              src={article.image}
                              alt=""
                              className="w-full h-full object-cover absolute inset-0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="h-[2px] bg-[#e1e4ea] w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-[64px] relative overflow-hidden w-full">
            <img
              src="/Articles/last-new1.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Social Sharing */}
          <div className="mt-[64px] flex flex-col gap-[16px]">
            <p className="text-[16px] leading-[28px] text-[#021c51]">
              Partilhar esta notícia
            </p>
            <div className="flex flex-wrap gap-[16px]">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-[8px] text-[#034AD8] hover:text-primary-700 transition-colors py-[8px] px-[16px]"
                >
                  {link.icon ? (
                    <Icon
                      name={link.icon as any}
                      className="w-[24px] h-[24px]"
                      aria-hidden="true"
                    />
                  ) : (
                    <img
                      src={link.customIcon}
                      alt=""
                      className="w-[24px] h-[24px]"
                    />
                  )}
                  <span className="text-[16px] leading-[28px]">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutOpenData;
