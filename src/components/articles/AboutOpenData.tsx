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
            <span className="text-primary-900 text-l-regular block mb-[8px]">
              Publicado em 18.12.2025
            </span>
            <h1 className="text-2xl-medium text-[#021C51] mb-16 leading-tight max-w-[800px]">
              Sobre dados abertos
            </h1>

          </div>

        </div>

        <div className="bg-[#F7F8FA] pt-[64px] pb-[38px] pl-[112px] pr-[112px]">
          <div className="container mx-auto px-4 flex gap-[64px] lg:gap-[240px]">
            {/* Left - Main Content */}
            <div className="w-[63%]">
              <div className="text-[#2b363c] flex flex-col gap-[32px]">
                <div className="max-w-[592px] ">
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Dados abertos, de acordo com a <Link href="https://opendefinition.org/" target="_blank" rel="noopener noreferrer" className="text-[#034AD8] underline font-medium hover:text-primary-700">Open Definition</Link>, são
                    "dados que qualquer pessoa pode aceder, utilizar, modificar e partilhar, para qualquer propósito".
                  </p>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Representam um subconjunto muito importante do vasto domínio de <strong>informação do setor público</strong>, cuja reutilização é promovida por uma diretiva europeia (transposta em Portugal pela Lei n.º 26/2016, de 22 de Agosto).</p>

                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    O movimento dos dados abertos, que é parte integral das políticas dedicadas ao <strong>Governo Aberto</strong> (Open Government), combina os princípios da transparência, participação e colaboração, assim como o potencial de desenvolvimento económico que o digital trouxe.
                  </p>

                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    A enorme quantidade de dados que é gerada e centralizada pela Administração Pública congrega em si um enorme potencial de utilização e de desenvolvimentos que podem ser úteis e importantes tanto para o Estado como para a sociedade civil e mundo empresarial.
                  </p>

                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    A grande maioria desses dados já são, por lei, considerados públicos. O grande desafio (e a maior preocupação das iniciativas de dados abertos como o <strong>dados.gov</strong>) passa por facilitar o seu acesso e reutilização, beneficiando vários grupos e sectores da sociedade:
                  </p>

                  <ul className="list-disc pl-[48px] space-y-[12px] mb-[24px] text-[16px] leading-[28px]">
                    <li>
                      os <strong>cidadãos</strong>, que passam a ter um acesso mais imediato a informação que lhes pertence por direito, reforçando a visão de transparência e prestação de contas do Estado perante os eleitores;
                    </li>
                    <li>
                      as <strong>instituições governamentais</strong>, que se tornam mais transparentes e têm a oportunidade de se tornarem mais eficientes e eficazes, reforçando também o seu papel de serviço público e o próprio acesso a dados de outros organismos;
                    </li>
                    <li>
                      o <strong>setor empresarial</strong>, que pode reutilizar informação pública para criar aplicações, plataformas ou serviços com elevado potencial comercial;
                    </li>
                    <li>
                      e muitos outros setores como o <strong>jornalismo</strong>, a <strong>investigação universitária</strong> ou mesmo <strong>organizações não-governamentais</strong> com preocupações cívicas.
                      Esse desafio passa por disponibilizar os dados em formatos passíveis de serem lidos por mecanismos automatizados, através de formatos e ferramentas abertas, para que possam ser reutilizados, transformados ou integrados por qualquer cidadão ou entidade, por norma disponibilizados sob a forma de <strong>conjuntos de dados</strong>.
                    </li>
                  </ul>

                  <h2 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
                    Conjuntos de dados abertos
                  </h2>
                  <p className="text-[16px] leading-[28px] mb-[16px]">
                    Um conjunto de dados, publicados ou geridos por um único
                    agente, e disponibilizado para acesso ou download através de
                    um ou mais formatos.
                    <br />
                    <span className="text-[14px]">
                      {" "}
                      W3C Data Catalogue Vocabulary (<Link href="https://www.w3.org/TR/vocab-dcat-1/" target="_blank" rel="noopener noreferrer" className="text-[#034AD8] underline font-medium hover:text-primary-700">DCAT</Link>)
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
                    Quando falamos em <strong>dados abertos públicos</strong>, podemos considerar
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
                    privacidade dos cidadãos.  <strong>As políticas de dados abertos não
                      estipulam que se &quot;abra&quot; toda a informação do
                      Estado, apenas aquela que pode ser considerada pública.</strong>
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
                    Nos dados a abrir deverá ser dedicada uma atenção e esforço especiais à georreferenciação da informação, porque eleva significativamente o interesse e o potencial de utilização dos dados abertos. Ao enriquecer um conjunto de dados com campos de referência geográfica, a entidade está a abrir o potencial para o desenvolvimento de aplicações que permitem visualizar os dados sobre um mapa. E estas são aplicações bastante apreciadas quer por utilizadores finais quer pela comunidade de desenvolvimento, porque permitem navegar nos dados de forma mais intuitiva e agradável e porque impulsionam a criação de apps para dispositivos móveis.
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
                <div>
                  <h1 className="text-[32px] font-medium text-[#021C51] mb-16 leading-tight max-w-[800px]">
                    Ações
                  </h1>
                  <a href="https://github.com/amagovpt/docs.dados.gov.pt/blob/master/pages/faqs/about_opendata.md" className="text-[#034AD8] underline font-medium hover:text-primary-700">Propor uma mudança</a>
                </div>
              </div>
            </div>

            {/* Right - Sidebar: Related Articles */}
            <div className="w-[37%]">
              <div className="pt-[96px] flex flex-col gap-[32px]">
                <p className="text-[20px] leading-[32px] text-[#021c51] font-light">
                  Outros <span className="text-[20px] font-bold">artigos</span> relacionados
                </p>

                <div className="flex flex-col gap-[16px]">
                  {relatedArticles.map((article, index) => (
                    <div key={index} className="flex flex-col gap-[32px]">
                      <div className="flex flex-col gap-[16px]">
                        {/* <p className="text-[14px] leading-[24px] text-[#2b363c]">
                        Category
                      </p> */}
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
        </div>

        <div className="container mx-auto px-4">
          {/* Newsletter Section */}
          <div className="mt-[64px] relative overflow-hidden w-full">
            <img
              src="/Articles/last-new1.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Social Sharing */}
          <div className="flex flex-col gap-[16px]">
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
      </main >
    </div >
  );
};

export default AboutOpenData;
