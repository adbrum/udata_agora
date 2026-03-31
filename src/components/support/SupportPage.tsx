"use client";

import React from "react";
import {
  Accordion,
  Icon,
  ToggleGroup,
  Toggle,
  InputText,
  InputTextArea,
  Button,
} from "@ama-pt/agora-design-system";
import PageBanner from "@/components/PageBanner";

const FAQ_DATA = [
  {
    category: "Sobre dados específicos",
    items: [
      {
        question: "Dados sobre um tema concreto?",
        answer: "",
        richAnswer: true,
        defaultExpanded: true,
      },
    ],
  },
  {
    category: "Publicar dados no portal",
    items: [
      {
        question: "Quer publicar no portal dados.gov.pt?",
        answer: "",
        richAnswer: "publicar",
        defaultExpanded: true,
      },
    ],
  },
  {
    category: "Usar dados / reutilização",
    items: [
      {
        question: "Precisa de ajuda para encontrar ou usar dados?",
        answer: "",
        richAnswer: "usar-dados",
        defaultExpanded: true,
      },
    ],
  },
  {
    category: "APIs e Acesso Técnico",
    items: [
      {
        question: "Questões sobre API ou acesso de programação",
        answer: "",
        richAnswer: "apis",
        defaultExpanded: true,
      },
    ],
  },
  {
    category: "Questões legais e privacidade",
    items: [
      {
        question: "Dúvidas sobre legalidade ou dados pessoais",
        answer: "",
        richAnswer: "legais",
        defaultExpanded: true,
      },
    ],
  },
  {
    category: "Problemas técnicos no portal",
    items: [
      {
        question: "Tem um erro no sistema?",
        answer: "",
        richAnswer: "problemas-tecnicos",
        defaultExpanded: true,
      },
    ],
  },
  {
    category: "Pedidos de novos dados",
    items: [
      {
        question: "Não encontrou os dados que procura?",
        answer: "",
        richAnswer: "pedidos-dados",
        defaultExpanded: true,
      },
    ],
  },
  {
    category: "Outros assuntos",
    items: [
      {
        question: "Outras necessidades",
        answer: "",
        richAnswer: "outros",
        defaultExpanded: true,
      },
    ],
  },
];

const SupportPage = () => {
  const [activeItem, setActiveItem] = React.useState("Nesta página");
  const [expandedId, setExpandedId] = React.useState<string | null>("0-1");
  const [selectedToggle, setSelectedToggle] = React.useState<string | null>(null);
  const [subjectBody, setSubjectBody] = React.useState("");

  const TOGGLE_PREFIX_MAP: Record<string, string> = {
    question: "Pergunta",
    bug: "Bug",
    feedback: "Feedback",
  };

  const TOGGLE_TITLE_MAP: Record<string, string> = {
    question: "Qual o problema que está a enfrentar?",
    bug: "Qual o problema que está a enfrentar?",
    feedback: "Envie seu feedback",
  };

  const TOGGLE_SUBJECT_LABEL_MAP: Record<string, string> = {
    question: "O assunto da sua pergunta *",
    bug: "O assunto do seu bug *",
    feedback: "O assunto do seu feedback *",
  };

  return (
    <main id="nesta-pagina" className="flex-grow bg-white pb-64">
      <PageBanner
        title={
          <>
            <span className="text-[32px] text-white font-[500] mb-[10px]">
              Bem-vindo à página de suporte da
            </span>
            <span className="text-[32px] text-white font-[500]">plataforma data.gov</span>
          </>
        }
        breadcrumbItems={[
          { label: "Home", url: "/" },
          { label: "Apoiar", url: "#" },
        ]}
        backgroundImageUrl="/Banner/hero-bg.png"
        backgroundPosition="inherit"
        subtitle={
          <>
            <label className="block text-[20px] font-bold text-white mt-[48px]">
              Antes de nos contactar, consulte o fórum e os nossos guias:
              <br />
              poderá já encontrar a resposta à sua pergunta lá!
            </label>

            <div className="absolute w-full mb-64 bg-white text-neutral-900 shadow-lg dropdown"></div>

            <div className="mt-[16px] flex flex-wrap gap-[32px]">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-8 text-white cursor-pointer hover:underline"
              >
                Consulte a documentação em data.gov.pt
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-m fill-white w-32 h-32"
                  aria-hidden="true"
                  role="img"
                >
                  <path d="M11.2929 8.70711C10.9024 8.31658 10.9024 7.68342 11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071C10.9024 16.3166 10.9024 15.6834 11.2929 15.2929L13.5858 13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H13.5858L11.2929 8.70711Z"></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                  ></path>
                </svg>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-8 text-white cursor-pointer hover:underline"
              >
                Consulte os guias sobre dados abertos
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-m fill-white w-32 h-32"
                  aria-hidden="true"
                  role="img"
                >
                  <path d="M11.2929 8.70711C10.9024 8.31658 10.9024 7.68342 11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071C10.9024 16.3166 10.9024 15.6834 11.2929 15.2929L13.5858 13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H13.5858L11.2929 8.70711Z"></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                  ></path>
                </svg>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-8 text-white cursor-pointer hover:underline"
              >
                Consulte os guias sobre como usar os dados
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-m fill-white w-32 h-32"
                  aria-hidden="true"
                  role="img"
                >
                  <path d="M11.2929 8.70711C10.9024 8.31658 10.9024 7.68342 11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071C10.9024 16.3166 10.9024 15.6834 11.2929 15.2929L13.5858 13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H13.5858L11.2929 8.70711Z"></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                  ></path>
                </svg>
              </a>
            </div>
          </>
        }
      />

      <div className="container mx-auto px-4 py-64">
        <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-32">
          <div className="xl:col-span-8 xl:block max-w-ch">
            {/* FAQ Section */}
            <div id="faq" className="max-w-4xl mx-auto scroll-mt-[190px]">
              <p className="text-sm text-neutral-700 mb-[32px]">Conteúdos atualizado a 23.2.2026</p>
              <h2 className="text-xl-semibold mb-[32px] text-primary-900">Perguntas frequentes</h2>

              <div className="space-y-48">
                {FAQ_DATA.map((category, idx) => (
                  <section
                    key={idx}
                    id={category.category
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]/g, "")}
                    className={`${category.category !== "Sobre dados específicos" ? "mt-[32px]" : ""} scroll-mt-[190px]`}
                  >
                    <h3 className="text-[20px] font-bold text-[#021C51] mb-[16px]">
                      {category.category}
                    </h3>
                    <div>
                      {category.items.map((item, itemIdx) => {
                        const currentId = `${idx}-${itemIdx}`;
                        return (
                          <Accordion
                            key={`${currentId}-${expandedId === currentId}`}
                            headingTitle={
                              <span className="text-[#2B363C] font-bold mr-[16px]">
                                {item.question}
                              </span>
                            }
                            headingLevel="h4"
                            defaultExpanded={expandedId === currentId}
                            onExpanded={() => setExpandedId(currentId)}
                            onCollapsed={() => {
                              if (expandedId === currentId) {
                                setExpandedId(null);
                              }
                            }}
                          >
                            <div className="py-16 mr-[16px] text-neutral-900 leading-relaxed">
                              {"richAnswer" in item && item.richAnswer === "publicar" ? (
                                <div className="space-y-[16px]">
                                  <div>
                                    <p className="font-bold">
                                      Informação oficial sobre publicação
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Página &ldquo;Publicar Dados&rdquo; no portal português:
                                    </p>
                                    <p>
                                      Como publicar dados — explicação passo-a-passo no portal{" "}
                                      <a
                                        href="https://dados.gov.pt/pt/pages/faqs/publish"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Como publicar dados
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Tópicos incluídos:</p>
                                    <p><Icon name="agora-line-check" className="inline w-16 h-16" /> Quem pode publicar (AP e outros participantes)</p>
                                    <p><Icon name="agora-line-check" className="inline w-16 h-16" /> Criar conta / associar organização</p>
                                    <p><Icon name="agora-line-check" className="inline w-16 h-16" /> Carregar datasets ou referenciar URL</p>
                                    <p><Icon name="agora-line-check" className="inline w-16 h-16" /> Usar API ou harvester</p>
                                    <p><Icon name="agora-line-check" className="inline w-16 h-16" /> Certificação de fornecedores oficiais</p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Tornar-me publicador</p>
                                    <p>1. Criar conta no portal</p>
                                    <p>2. Associar-se à organização</p>
                                    <p>3. Aguardar validação</p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Atualizar um dataset</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Pode editar o conjunto de dados e substituir ou acrescentar
                                      recursos a qualquer momento.
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Dados pessoais ou sensíveis</p>
                                    <p><Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Apenas dados anonimizados podem ser publicados.</p>
                                    <p>Para questões sobre proteção de dados:</p>
                                    <p>
                                      <a
                                        href="https://www.cnpd.pt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Comissão Nacional de Proteção de Dados
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              ) : "richAnswer" in item && item.richAnswer === "usar-dados" ? (
                                <div className="space-y-[16px]">
                                  <div>
                                    <p className="font-bold">
                                      Pesquisa de dados aberta do portal
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Página principal do portal:{" "}
                                      <a
                                        href="https://dados.gov.pt/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Dados.gov
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Como reutilizar dados</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Consultar secções de exemplos de reutilização e licenças
                                      no portal (ex:{" "}
                                      <a
                                        href="https://dados.gov.pt/pt/pages/faqs/reuse/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Como reutilizar dados?
                                      </a>
                                      {" "})
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Licenças de dados abertos</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Licenças padrão (ex.: Creative Commons CC BY 4.0
                                      utilizado no portal){" "}
                                      <a
                                        href="https://dados.gov.pt/pt/pages/faqs/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Licenças
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Citar dados corretamente</p>
                                    <p><Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Ver informação de metadados em cada conjunto de dados</p>
                                    <p className="ml-[16px]">
                                      Indicar: nome do dataset, entidade publicadora, link
                                      original, data de acesso
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Casos de reutilização</p>
                                    <p className="ml-[16px]">
                                      Consultar exemplos de projetos baseados em dados abertos no
                                      portal
                                    </p>
                                  </div>
                                </div>
                              ) : "richAnswer" in item && item.richAnswer === "apis" ? (
                                <div className="space-y-[16px]">
                                  <div>
                                    <p className="font-bold">Documentação da API</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Endpoint de API do portal{" "}
                                      <a
                                        href="https://dados.gov.pt/api"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        API
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Autenticação / chave API</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> A API permite leitura aberta. Para escrita/autenticação é
                                      necessário gerar o token na área de administração do
                                      utilizador.
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">
                                      Limites de pedidos / uso responsável
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Política de uso do API nos termos do portal{" "}
                                      <a
                                        href="https://dados.gov.pt/pt/pages/api-tutorial/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        API tutorial
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              ) : "richAnswer" in item && item.richAnswer === "legais" ? (
                                <div className="space-y-[16px]">
                                  <div>
                                    <p className="font-bold">
                                      Proteção de Dados Pessoais / RGPD
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Contactar a{" "}
                                      <a
                                        href="https://www.cnpd.pt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Comissão Nacional de Proteção de Dados
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">
                                      Pedido de remoção de dados pessoais
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Contactar a equipa do dados.gov na página de{" "}
                                      <a
                                        href="https://dados.gov.pt/pages/support"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Suporte
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              ) : "richAnswer" in item &&
                                item.richAnswer === "problemas-tecnicos" ? (
                                <div className="space-y-[16px]">
                                  <div>
                                    <p className="font-bold">
                                      Erros de login / publicação / upload / pesquisa / comentários
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Contactar a equipa do dados.gov na página de{" "}
                                      <a
                                        href="https://dados.gov.pt/pages/support"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Suporte
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">
                                      Página ou funcionalidade indisponível
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Contactar a equipa do dados.gov na página de{" "}
                                      <a
                                        href="https://dados.gov.pt/pages/support"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        suporte
                                      </a>
                                      {" "}escolhendo &ldquo;Reportar um bug&rdquo;.
                                    </p>
                                  </div>
                                </div>
                              ) : "richAnswer" in item &&
                                item.richAnswer === "pedidos-dados" ? (
                                <div className="space-y-[16px]">
                                  <div>
                                    <p className="font-bold">Sugerir conjunto de dados</p>
                                    <p><Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Formulário de sugestão no portal</p>
                                  </div>
                                  <div>
                                    <p className="font-bold">
                                      Pedido formal de dados a uma entidade pública
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Pode dirigir pedidos à{" "}
                                      <a
                                        href="https://www.cada.pt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Comissão de Acesso a Documentos Administrativos
                                      </a>
                                    </p>
                                    <p>
                                      <a
                                        href="https://dados.gov.pt/en/contact/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        formulário e orientação disponíveis na página de contato
                                      </a>
                                    </p>
                                    <p>
                                      <a
                                        href="https://dados.gov.pt/pt/organizations/comissao-de-acesso-aos-documentos-administrativos/#/presentation"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Comissão de Acesso a Documentos Administrativos
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">
                                      Ver pedidos existentes de abertura de dados
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Consultar lista pública de pedidos no portal{" "}
                                      <a
                                        href="https://dados.gov.pt/pt/organizations/comissao-de-acesso-aos-documentos-administrativos/#/presentation"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        Comissão de Acesso aos Documentos Administrativos
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              ) : "richAnswer" in item &&
                                item.richAnswer === "outros" ? (
                                <div className="space-y-[16px]">
                                  <div>
                                    <p className="font-bold">Dar feedback ao portal</p>
                                    <p><Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Formulário de feedback</p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Sugerir melhorias do sistema</p>
                                    <p><Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Formulário de sugestões</p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Reportar conteúdo impróprio</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Usar funcionalidades de sinalização do portal
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Eventos, formação e comunidade</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Consultar secções de iniciativas e casos de reutilização
                                    </p>
                                  </div>
                                </div>
                              ) : "richAnswer" in item && item.richAnswer ? (
                                <div className="space-y-[16px]">
                                  <div>
                                    <p className="font-bold">Estatísticas oficiais</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Visitar o Instituto Nacional de Estatística no{" "}
                                      <a
                                        href="https://dados.gov.pt/pt/organizations/instituto-nacional-de-estatistica/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        dados.gov.
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Dados geográficos / cartografia</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Direção-Geral do Território no{" "}
                                      <a
                                        href="https://dados.gov.pt/pt/organizations/direcao-geral-do-territorio/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        dados.gov.
                                      </a>
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Sistema Nacional de Informação Geográfica{" "}
                                      <a
                                        href="https://snig.dgterritorio.gov.pt/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        SNIG
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Dados bibliográficos / culturais</p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Biblioteca Nacional de Portugal -{" "}
                                      <a
                                        href="https://opendata.bnportugal.gov.pt/eng_index.htm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        OpenData BNP
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">
                                      Dados do Sistema de Informação Cadastral Simplificado e do
                                      Balcão Único do Prédio
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> eBUPI no{" "}
                                      <a
                                        href="https://dados.gov.pt/pt/organizations/ebupi-estrutura-de-missao-para-a-expansao-do-sistema-de-informacao-cadastral-simplificado/#/presentation"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        dados.gov
                                      </a>
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Estrutura de Missão Para a Expansão do Sistema de
                                      Informação Cadastral Simplificado no{" "}
                                      <a
                                        href="https://www.gov.pt/entidades/estrutura-de-missao-para-a-expansao-do-sistema-de-informacao-cadastral-simplificado"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 underline"
                                      >
                                        gov.pt
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold">
                                      Questões sobre um dataset no dados.gov
                                    </p>
                                    <p>
                                      <Icon name="agora-line-arrow-right-anchor" className="inline w-16 h-16" /> Abrir o separador{" "}
                                      <strong>&ldquo;Discussões&rdquo;</strong> na página do
                                      conjunto de dados.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                item.answer
                              )}
                            </div>
                          </Accordion>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* Bottom Support Options */}
          </div>

          <div className="xl:col-span-4 xl:block self-start sticky top-[190px] h-fit">
            <div className="sidebar-index pr-64 border-l border-neutral-700">
              <ul>
                <li
                  className="mb-[16px] cursor-pointer"
                  onClick={() => setActiveItem("Nesta página")}
                >
                  <a
                    href="#nesta-pagina"
                    className={`text-neutral-900 ${activeItem === "Nesta página" ? "text-m-bold font-bold" : "text-m-regular"}`}
                    style={activeItem === "Nesta página" ? { fontWeight: 700 } : {}}
                  >
                    Nesta página
                  </a>
                </li>
                {FAQ_DATA.map((category) => {
                  const slug = category.category
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "");
                  return (
                    <li
                      key={slug}
                      className="mb-[8px] cursor-pointer"
                      onClick={() => setActiveItem(category.category)}
                    >
                      <a
                        href={`#${slug}`}
                        className={`text-neutral-900 ${activeItem === category.category ? "text-m-bold font-bold" : "text-m-regular"}`}
                        style={activeItem === category.category ? { fontWeight: 700 } : {}}
                      >
                        {category.category}
                      </a>
                    </li>
                  );
                })}
                <li className="cursor-pointer" onClick={() => setActiveItem("Ajuda")}>
                  <a
                    href="#ajuda"
                    className={`text-primary-900 ${activeItem === "Ajuda" ? "text-m-bold font-bold" : "text-m-regular"}`}
                    style={activeItem === "Ajuda" ? { fontWeight: 700 } : {}}
                  >
                    Ajuda
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="ajuda" className="mt-80 pt-64 border-neutral-200 scroll-mt-[190px]">
          <h2 className="text-[24px] font-bold text-[#021C51] mb-[24px]">Ajuda</h2>
          <h3 className="text-[20px] font-[500] text-[#021C51] mb-[16px]">
            Não encontrou o que procurava?
          </h3>

          <ToggleGroup
            multiple={false}
            onChange={(val) => {
              const selected = val.length > 0 ? val[0] : null;
              setSelectedToggle(selected);
              setSubjectBody("");
            }}
          >
            <Toggle
              value="question"
              leadingIcon="agora-line-question-mark"
              leadingIconHover="agora-solid-question-mark"
              hasIcon={true}
            >
              Tenho uma pergunta
            </Toggle>
            <Toggle
              value="bug"
              leadingIcon="agora-line-alert-triangle"
              leadingIconHover="agora-solid-alert-triangle"
              hasIcon={true}
            >
              Reportar um bug
            </Toggle>
            <Toggle
              value="feedback"
              leadingIcon="agora-line-chat"
              leadingIconHover="agora-solid-chat"
              hasIcon={true}
            >
              Envie seu feedback
            </Toggle>
          </ToggleGroup>

          {selectedToggle && (
            <div className="mt-[32px] max-w-2xl">
              <h3 className="text-[20px] font-bold text-[#021C51] mb-[24px]">
                {TOGGLE_TITLE_MAP[selectedToggle]}
              </h3>

              <div>
                <div className="mt-[20px]">
                  <InputText
                    label="Seu endereço de e-mail *"
                    type="email"
                    required
                  />
                </div>

                <div className="mt-[20px]">
                  <div className="agora-input-text-wrapper">
                    <label className="input-text-label">
                      {TOGGLE_SUBJECT_LABEL_MAP[selectedToggle]}
                    </label>
                    <div
                      className="flex items-center w-full rounded-[4px] border-[2px] border-neutral-700 bg-white px-[16px]"
                      style={{ height: "60px" }}
                    >
                      <span className="text-neutral-900 whitespace-nowrap text-base">
                        {TOGGLE_PREFIX_MAP[selectedToggle]} -&nbsp;
                      </span>
                      <input
                        type="text"
                        className="flex-1 bg-transparent outline-none text-neutral-900 text-base placeholder:text-neutral-700"
                        placeholder="..."
                        value={subjectBody}
                        onChange={(e) => setSubjectBody(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-[20px]">
                  <InputTextArea
                    label="Sua pergunta *"
                    required
                    rows={5}
                  />
                </div>

                <div className="mt-[20px]">
                  <Button>Enviar</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SupportPage;
