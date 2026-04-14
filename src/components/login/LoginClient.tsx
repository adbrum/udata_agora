"use client";

import React, { useState } from "react";
import NextImage from "next/image";
import {
  Button,
  RadioButton,
  Checkbox,
  Icon,
  Breadcrumb,
  Tabs,
  Tab,
  TabHeader,
  TabBody,
  InputText,
  InputPassword,
  StatusCard,
} from "@ama-pt/agora-design-system";
import { fetchCsrfToken, login } from "@/services/api";

function LoginContent() {
  const [cmdModalOpen, setCmdModalOpen] = useState(false);
  const [isHoveredClose, setIsHoveredClose] = useState(false);
  const [isHoveredNacional, setIsHoveredNacional] = useState(false);
  const [isHoveredEstrangeiro, setIsHoveredEstrangeiro] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredEidas, setIsHoveredEidas] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [migrationRequired, setMigrationRequired] = useState(false);
  const [citizenType, setCitizenType] = useState<string | null>(null);
  const [termsCmdAccepted, setTermsCmdAccepted] = useState(false);
  const [termsEidasAccepted, setTermsEidasAccepted] = useState(false);

  const samlEnabled = process.env.NEXT_PUBLIC_SAML_ENABLED === "true";

  const submitSamlForm = async (endpoint: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        const text = await res.text();
        console.error("SAML login failed:", res.status, text);
        setError(`Erro ao iniciar autenticação (${res.status}). Tente novamente.`);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("SAML login: unexpected response type:", contentType, text.substring(0, 500));
        setError("Erro ao iniciar autenticação. O servidor não respondeu corretamente.");
        return;
      }

      const data = await res.json();
      if (!data.action || !data.SAMLRequest) {
        console.error("SAML login: missing fields in response:", data);
        setError("Erro ao iniciar autenticação. Resposta incompleta do servidor.");
        return;
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.action;

      const samlInput = document.createElement("input");
      samlInput.type = "hidden";
      samlInput.name = "SAMLRequest";
      samlInput.value = data.SAMLRequest;
      form.appendChild(samlInput);

      const relayInput = document.createElement("input");
      relayInput.type = "hidden";
      relayInput.name = "RelayState";
      relayInput.value = data.RelayState;
      form.appendChild(relayInput);

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error("SAML login error:", e);
      setError("Não foi possível contactar o servidor de autenticação. Verifique a sua ligação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSamlLogin = () => {
    submitSamlForm("/saml/login");
  };

  const handleEidasLogin = () => {
    submitSamlForm("/saml/eidas/login");
  };

  const breadcrumbItems = [
    { label: "Home", url: "/" },
    { label: "Autenticação", url: "#" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Get CSRF Token
      const csrfToken = await fetchCsrfToken();

      // 2. Prepare payload for backend
      const payload = new FormData();
      payload.append("email", email);
      payload.append("password", password);
      payload.append("csrf_token", csrfToken);
      payload.append("remember", "y");

      // 3. Login
      const response = await login(payload);

      // 4. Redirect on success (full reload to update auth state)
      window.location.href = response.redirect || "/";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ocorreu um erro ao tentar iniciar sessão.";
      if (message === "migration_required") {
        setMigrationRequired(true);
        setError(null);
      } else {
        console.error("Login error:", err);
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow bg-white min-h-screen relative">
      <div className="container mx-auto px-16 pt-32 pb-64 max-w-7xl login-page">
        {/* Breadcrumb */}
        {!cmdModalOpen && (
          <div>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        )}

        {/* Main Content */}
        {cmdModalOpen ? (
          <div className="mt-24 flex flex-col gap-24">
            <div className="flex justify-end">
              <button
                onClick={() => setCmdModalOpen(false)}
                onMouseEnter={() => setIsHoveredClose(true)}
                onMouseLeave={() => setIsHoveredClose(false)}
                className="flex items-center gap-8 text-sm text-neutral-900 hover:text-neutral-700"
              >
                Fechar
                <Icon
                  name={isHoveredClose ? "agora-solid-x" : "agora-line-x"}
                  className="w-20 h-20"
                />
              </button>
            </div>
            <h2 className="text-xl-bold text-brand-blue-dark">
              O que precisa para criar uma conta?
            </h2>
            <ul className="flex flex-col gap-16">
              <li className="flex items-start gap-16">
                <Icon name="agora-line-check" className="w-20 h-20 text-primary-600 shrink-0 mt-2" />
                <span>Para cidadãs/ãos nacionais e estrangeiras/os com Chave Móvel Digital (CMD) ativa.</span>
              </li>
              <li className="flex items-start gap-16">
                <Icon name="agora-line-check" className="w-20 h-20 text-primary-600 shrink-0 mt-2" />
                <span>
                  Precisa do código PIN da sua CMD e do telemóvel que lhe está associado. Se ainda não o fez, pode
                  <br />
                  <a
                    href="https://www.autenticacao.gov.pt/cmd-pedido-chave"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline"
                  >
                    ativar a Chave Móvel Digital em Autenticação.gov.
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-16">
                <Icon name="agora-line-check" className="w-20 h-20 text-primary-600 shrink-0 mt-2" />
                <span>O registo com CMD permite a realização de todos os serviços online disponibilizados neste portal.</span>
              </li>
            </ul>
            <div className="flex flex-col gap-24 mt-32 items-start">
              <a
                href="https://www.autenticacao.gov.pt/cmd-pedido-chave?partnerEntityID=https://dados.gov.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 flex items-center gap-8 text-sm"
                onMouseEnter={() => setIsHoveredNacional(true)}
                onMouseLeave={() => setIsHoveredNacional(false)}
              >
                Criar conta como cidadão nacional
                <Icon name={isHoveredNacional ? "agora-solid-arrow-right-circle" : "agora-line-arrow-right-circle"} className="w-20 h-20" />
              </a>
              <a
                href="https://www.autenticacao.gov.pt/cmd-pedido-chave-estrangeiro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 flex items-center gap-8 text-sm"
                onMouseEnter={() => setIsHoveredEstrangeiro(true)}
                onMouseLeave={() => setIsHoveredEstrangeiro(false)}
              >
                Criar conta como cidadão estrangeiro
                <Icon name={isHoveredEstrangeiro ? "agora-solid-arrow-right-circle" : "agora-line-arrow-right-circle"} className="w-20 h-20" />
              </a>
            </div>
          </div>
        ) : (
        <>
        <div>
          <h1 className="text-2xl-medium text-brand-blue-dark mt-64 mb-16">Autenticação</h1>
          <p className="text-lg text-neutral-700 max-w-2xl mb-32">
            Escolha um meio de autenticação para se autenticar no portal e ter acesso aos vários{" "}
            <br />
            serviços e funcionalidades online.
          </p>
        </div>
        <Tabs vertically className="mt-24">
          <Tab>
            <TabHeader>Chave Móvel Digital (CMD)</TabHeader>
            <TabBody>
              <div className="rounded-8">
                <div className="flex flex-col gap-40">
                  <div className="flex items-center justify-between gap-32">
                    <div className="flex flex-col gap-8">
                      <h2 className="text-base font-bold text-brand-blue-dark">
                        Antes de começar...
                      </h2>
                      <p className="text-[#2B363C]">
                        Precisa do código PIN da sua Chave Móvel Digital - CMD e do telemóvel
                        que lhe está associado.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <NextImage
                        src="/Logos/autenticacao_gov.svg"
                        alt="Autenticação.gov"
                        width={240}
                        height={48}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-neutral-900 my-32">
                    <strong>Não tem Chave Móvel Digital?</strong>{" "}
                    <button
                      className="text-primary-600 underline hover:text-primary-800 text-sm"
                      onClick={() => setCmdModalOpen(true)}
                    >
                      Descubra como criar conta
                    </button>
                  </p>
                  <div className="w-full h-[2px] bg-neutral-400"></div>
                  <div className="flex flex-col gap-24">
                    <div className="flex flex-col gap-8">
                      <h3 className="text-l-bold text-brand-blue-dark mt-32">Entrar como</h3>
                      <div className="flex flex-col gap-16 mt-8">
                        <RadioButton
                          label="Pessoa com nacionalidade portuguesa"
                          id="nacional"
                          name="citizen-type"
                          className="text-lg text-neutral-900"
                          onChange={() => setCitizenType("nacional")}
                        />
                        <RadioButton
                          label="Pessoa com nacionalidade estrangeira"
                          id="estrangeiro"
                          name="citizen-type"
                          className="text-lg text-neutral-900"
                          onChange={() => setCitizenType("estrangeiro")}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-8 mt-8">
                      <h3 className="text-l-bold text-brand-blue-dark">Termos e condições</h3>
                      <p className="text-sm">
                        Deve ler atentamente os{" "}
                        <a
                          href="/pages/faqs/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 underline hover:text-primary-800"
                        >
                          Termos e condições para o tratamento dos seus dados
                        </a>
                      </p>
                      <Checkbox
                        id="terms-cmd"
                        className="text-sm text-neutral-700 leading-relaxed"
                        onChange={(e) => setTermsCmdAccepted(e.target.checked)}
                      >
                        Declaro que li e aceito os termos e condições para o tratamento dos
                        meus dados pessoais no acesso e utilização da Área Reservada do
                        dadosgov.pt.
                      </Checkbox>
                    </div>
                  </div>
                  <div className="mt-16">
                    <Button
                      variant="primary"
                      className="px-48 h-56 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                      hasIcon={true}
                      trailingIcon={
                        isHovered
                          ? "agora-solid-arrow-right-circle"
                          : "agora-line-arrow-right-circle"
                      }
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onClick={handleSamlLogin}
                      disabled={!samlEnabled || !citizenType || !termsCmdAccepted}
                    >
                      Entrar com Chave Móvel Digital
                    </Button>
                  </div>
                </div>
              </div>
            </TabBody>
          </Tab>
          <Tab>
            <TabHeader>Autenticação europeia (eIDAS)</TabHeader>
            <TabBody>
              <div className="rounded-8">
                <div className="flex flex-col gap-40">
                  <div className="grid gap-32 xs:grid-cols-4 md:grid-cols-8 xl:grid-cols-12">
                    <div className="xs:col-span-4 md:col-span-5 xl:col-span-7">
                      <div className="bg-[#E9EBFF] rounded-8 w-fit p-16 mb-32">
                        <Icon
                          name="agora-line-globe"
                          className="w-24 h-24 text-brand-blue-primary"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl-bold text-brand-blue-dark mb-8">
                          Para se autenticar ou criar conta
                        </h2>
                        <p className="text-neutral-900">
                          Precisa de ter um meio de autenticação digital disponibilizado pelo seu
                          país de origem na União Europeia (UE). Este meio de autenticação está
                          disponível para a qualquer cidadã/o da UE.
                        </p>
                        <p className="text-sm text-neutral-900 mt-8">
                          Ainda não tem conta? Ao autenticar-se com o eIDAS, a sua conta será
                          criada automaticamente.
                        </p>
                      </div>
                    </div>
                    <div className="xs:col-span-4 md:col-span-3 xl:col-span-5 flex items-center justify-start md:justify-end">
                      <div className="w-[278px] md:flex md:justify-end xl:flex xl:justify-end mt-64">
                        <NextImage
                          src="/eidas.svg"
                          alt="eIDAS"
                          width={240}
                          height={48}
                          className="h-48 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[2px] bg-neutral-400 mt-32 mb-16"></div>
                  <div className="flex flex-col gap-24">
                    <div className="mt-8">
                      <Checkbox
                        id="terms-eidas"
                        className="text-sm text-neutral-700 leading-relaxed"
                        onChange={(e) => setTermsEidasAccepted(e.target.checked)}
                      >
                        Declaro que li e aceito os{" "}
                        <a
                          href="/pages/faqs/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 underline hover:text-primary-800"
                        >
                          termos e condições relativos ao tratamento de dados
                          pessoais
                        </a>{" "}
                        para a criação de conta e acesso ao portal dados.gov.pt
                      </Checkbox>
                    </div>
                  </div>
                  <div className="mt-16">
                    <Button
                      variant="primary"
                      className="px-48 h-56 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                      hasIcon={true}
                      trailingIcon={
                        isHoveredEidas
                          ? "agora-solid-arrow-right-circle"
                          : "agora-line-arrow-right-circle"
                      }
                      onMouseEnter={() => setIsHoveredEidas(true)}
                      onMouseLeave={() => setIsHoveredEidas(false)}
                      onClick={handleEidasLogin}
                      disabled={!samlEnabled || !termsEidasAccepted}
                    >
                      Autenticar com eIDAS
                    </Button>
                  </div>
                </div>
              </div>
            </TabBody>
          </Tab>
          <Tab>
            <TabHeader>Iniciar sessão</TabHeader>
            <TabBody>
              <div className="rounded-8">
                <div className="flex flex-col gap-32 max-w-[560px]">
                  <div className="bg-[#E9EBFF] rounded-8 w-fit p-16">
                    <Icon name="agora-line-user" className="w-24 h-24 text-brand-blue-primary" />
                  </div>

                  {migrationRequired ? (
                    <>
                      <div>
                        <h2 className="text-xl-bold text-brand-blue-dark mb-8">
                          Migração obrigatória
                        </h2>
                        <p className="text-neutral-900">
                          O login por email e palavra-passe vai ser descontinuado. Para continuar a
                          aceder ao portal, é necessário migrar a sua conta para a Chave Móvel
                          Digital (CMD) ou autenticação europeia (eIDAS).
                        </p>
                      </div>
                      <div className="p-24 rounded-8 bg-amber-50 border border-amber-200">
                        <div className="flex gap-12 items-start">
                          <Icon
                            name="agora-line-info-mark"
                            className="w-24 h-24 text-amber-600 shrink-0 mt-2"
                          />
                          <div>
                            <p className="text-sm-bold text-amber-800 mb-4">Como migrar?</p>
                            <p className="text-sm text-amber-700">
                              Autentique-se com a Chave Móvel Digital (separador
                              &quot;CMD&quot;) ou com a autenticação europeia (separador
                              &quot;eIDAS&quot;). O sistema detetará a sua conta existente e
                              guiá-lo-á pelo processo de migração. Os seus dados (conjuntos de
                              dados, organizações, reutilizações) serão mantidos.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-16">
                        <Button
                          variant="primary"
                          className="px-48 h-56 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                          onClick={handleSamlLogin}
                        >
                          Migrar com CMD
                        </Button>
                        <Button
                          variant="neutral"
                          className="px-48 h-56 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                          onClick={handleEidasLogin}
                        >
                          Migrar com eIDAS
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-xl-bold text-brand-blue-dark mb-8">
                          Iniciar sessão
                        </h2>
                        <p className="text-neutral-900">
                          Os campos marcados com um asterisco ( * ) são obrigatórios.
                        </p>
                      </div>

                      {error && (
                        <StatusCard type="danger" description={error} />
                      )}

                      <form
                        className="flex flex-col gap-24"
                        onSubmit={handleSubmit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.currentTarget.requestSubmit();
                          }
                        }}
                      >
                        <InputText
                          label="Endereço de e-mail *"
                          placeholder="Introduza aqui o texto"
                          id="login-email"
                          name="email"
                          type="email"
                          className="w-full"
                          disabled={isLoading}
                        />

                        <div className="flex flex-col gap-8">
                          <InputPassword
                            label="Palavra-passe *"
                            placeholder="Introduza aqui a palavra-passe"
                            id="login-password"
                            name="password"
                            className="w-full"
                            disabled={isLoading}
                          />
                        </div>

                        <div className="flex items-center text-neutral-900">
                          <Checkbox
                            label="Recordar palavra-passe"
                            id="remember-me"
                            name="remember-me"
                          />
                        </div>
                        <div className="mt-8">
                          <Button
                            variant="primary"
                            type="submit"
                            className="px-48 h-56 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                            disabled={isLoading}
                          >
                            {isLoading ? "A iniciar sessão..." : "Iniciar sessão"}
                          </Button>
                        </div>

                        <div className="flex items-center justify-center mt-24 gap-4">
                          <span className="text-sm text-neutral-900">
                            Esqueceu-se da palavra-passe?
                          </span>
                          <Button
                            variant="primary"
                            appearance="link"
                            className="p-0 h-auto font-bold text-sm"
                          >
                            Recuperar palavra-passe
                          </Button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </TabBody>
          </Tab>
        </Tabs>

        {/* Status card aligned with tab content */}
        <div className="grid xl:grid-cols-12 gap-[32px] mt-32">
          <div className="xl:col-span-3" />
          <div className="xl:col-span-9 xl:col-start-4">
            <StatusCard
              type="info"
              description={
                <div className="flex flex-col gap-8">
                  <p className="text-sm font-bold">Tem dúvidas?</p>
                  <p className="text-sm">
                    Se precisar de ajuda, fale connosco através do nosso formulário.
                  </p>
                  <a
                    href="/pages/support"
                    className="text-sm text-informative-600 flex items-center gap-8"
                  >
                    Formulário de contacto
                    <Icon name="agora-line-arrow-right-circle" className="w-16 h-16 text-informative-600" />
                  </a>
                </div>
              }
            />
          </div>
        </div>
        </>
        )}
      </div>
    </main>
  );
}

export default function LoginClient() {
  return <LoginContent />;
}
