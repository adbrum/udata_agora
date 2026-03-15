"use client";

import React, { useState } from "react";
import {
  Button,
  InputText,
  InputTextArea,
  RadioButton,
  Icon,
  StatusCard,
  Accordion,
  AccordionGroup,
  InputSelect,
  InputDate,
  DropdownSection,
  DropdownOption,
  ButtonUploader,
} from "@ama-pt/agora-design-system";

interface DatasetsAdminClientProps {
  currentStep: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export default function DatasetsAdminClient({
  currentStep,
  onNextStep,
  onPreviousStep,
}: DatasetsAdminClientProps) {
  const [accessType, setAccessType] = useState("open");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showFileError, setShowFileError] = useState(false);

  const auxiliarItemsStep2 = [
    {
      title: "Nomeando seu conjunto de dados",
      content: (
        <>
          <p>
            O título do seu conjunto de dados deve ser o mais preciso e específico possível.
          </p>
          <p>
            Deve também corresponder ao vocabulário utilizado pelos utilizadores que, na maioria
            das vezes, procuram dados através de um motor de busca.
          </p>
        </>
      ),
    },
    {
      title: "Adicione uma sigla ao conjunto de dados.",
      content:
        "Você tem a opção de adicionar uma sigla ao seu conjunto de dados. As letras que compõem essa sigla não precisam ser separadas por pontos.",
    },
    {
      title: "Escreva uma boa descrição",
      content: (
        <>
          <p>
            A descrição do seu conjunto de dados permite que os utilizadores obtenham informações sobre
            o conteúdo e a estrutura dos recursos publicados; você pode, em particular, fornecer
            informações como:
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-2">
            <li>A lista de ficheiros disponibilizados;</li>
            <li>Descrição do formato do ficheiro;</li>
            <li>A frequência de atualização.</li>
          </ul>
          <ul className="list-disc pl-5 mt-4 flex flex-col gap-2">
            <li>As motivações para a criação do conjunto de dados;</li>
            <li>A composição do conjunto de dados;</li>
            <li>O processo de coleta de dados;</li>
            <li>Pré-processamento de dados;</li>
            <li>A distribuição do conjunto de dados;</li>
            <li>Manutenção de conjuntos de dados;</li>
            <li>Considerações legais e éticas.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Escreva uma breve descrição.",
      content: (
        <>
          <p>
            A descrição resumida apresenta seu conjunto de dados em uma ou duas frases. Isso ajuda
            os utilizadores a entenderem rapidamente o conteúdo e melhora sua visibilidade nos
            resultados de busca.
          </p>
          <p className="font-bold mt-3">Sugestões automáticas</p>
          <p className="mt-2">
            Uma primeira versão pode ser gerada automaticamente se você já tiver preenchido o título
            e uma descrição de pelo menos 200 caracteres, sendo então adaptada de acordo com as suas
            necessidades.
          </p>
          <p className="mt-3">
            <a href="#" className="text-primary-600 underline">
              A IA baseia-se exclusivamente nas informações que você forneceu e, por vezes, pode
              cometer erros: releia sempre a proposta antes de validar.
            </a>
          </p>
        </>
      ),
    },
    {
      title: "Adicionar palavras-chave",
      content: (
        <>
          <p>
            As palavras-chave descrevem seu conjunto de dados e facilitam sua descoberta. Elas
            melhoram seu posicionamento nos mecanismos de busca e ajudam os utilizadores a encontrar
            com mais facilidade os dados que procuram.
          </p>
          <p className="font-bold mt-3">Sugestões automáticas</p>
          <p className="mt-2">
            Com base no conteúdo do seu conjunto de dados, podem ser sugeridas palavras-chave
            automaticamente. Você pode aceitá-las, modificá-las ou excluí-las.
          </p>
          <p className="mt-3">
            <a href="#" className="text-primary-600 underline">
              A IA baseia-se exclusivamente nas informações que você forneceu e, por vezes, pode
              cometer erros: releia sempre a proposta antes de validar.
            </a>
          </p>
        </>
      ),
    },
    {
      title: "Selecione uma licença",
      content:
        "As licenças definem as regras para a reutilização. Ao escolher uma licença de reutilização, você garante que o conjunto de dados publicado será reutilizado de acordo com os termos de uso que você definiu.",
    },
    {
      title: "Escolha a frequência de atualização.",
      content:
        "A frequência de atualização refere-se à frequência com que você planeja atualizar os dados publicados. Essa frequência de atualização é apenas indicativa.",
    },
    {
      title: "Forneça a cobertura de tempo.",
      content: (
        <>
          <p>A abrangência temporal indica o período de tempo dos dados publicados.</p>
          <p>Por exemplo: de 2012 a 2015.</p>
        </>
      ),
    },
    {
      title: "Complete as informações espaciais",
      content: (
        <>
          <p>
            A granularidade espacial indica o nível mais detalhado de informações geográficas que
            seus dados podem abranger.
          </p>
          <p>Por exemplo: em nível departamental ou municipal.</p>
        </>
      ),
    },
  ];

  const auxiliarItemsStep3 = [
    {
      title: "Escolher o formato certo",
      content: (
        <>
          <p>Os formatos devem ser:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-2">
            <li>
              <strong>Aberto:</strong> um formato aberto não adiciona especificações técnicas que
              restrinjam o uso dos dados (por exemplo, o uso de software pago);
            </li>
            <li>
              <strong>facilmente reutilizável:</strong> um formato facilmente reutilizável implica
              que qualquer pessoa ou servidor pode reutilizar facilmente o conjunto de dados;
            </li>
            <li>
              <strong>Utilizável em um sistema de processamento automatizado:</strong> um sistema de
              processamento automatizado permite operações automáticas relacionadas ao processamento
              de dados (por exemplo, um ficheiro CSV é facilmente utilizável por um sistema
              automatizado, ao contrário de um ficheiro PDF).
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Adicionar documentação",
      content: (
        <>
          <p>
            A descrição de um ficheiro facilita a reutilização de dados. Ela inclui, entre outras
            coisas:
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-2">
            <li>uma descrição geral do conjunto de dados;</li>
            <li>uma descrição do método de produção de dados;</li>
            <li>uma descrição do modelo de dados;</li>
            <li>uma descrição do esquema de dados;</li>
            <li>uma descrição dos metadados;</li>
            <li>Uma descrição das principais mudanças.</li>
          </ul>
          <p className="text-red-500 mt-3 font-medium">
            Você não adicionou nenhum ficheiro de documentação nem descreveu seus ficheiros.
          </p>
        </>
      ),
    },
  ];

  const auxiliarItems =
    currentStep === 3 || currentStep === 4 ? auxiliarItemsStep3 : auxiliarItemsStep2;

  return (
    <>
      {/* Main content area: form + auxiliar sidebar */}
      <div className="datasets-admin-page__body">
        {/* Left: Form */}
        <div className="datasets-admin-page__form-area">
          {/* Step 2: Descreva o conjunto de dados */}
          {currentStep === 2 && (
            <>
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>O que é um conjunto de dados?</strong>
                    <br />
                    Em dados.gov, um conjunto de dados é um conjunto de ficheiros.
                  </>
                }
              />

              <form className="datasets-admin-page__form">
                <p className="text-neutral-900 text-base leading-7">
                  Os campos marcados com um asterisco ( * ) são obrigatórios.
                </p>
                <h2 className="datasets-admin-page__section-title">Produtor</h2>

                <InputSelect
                  label="Verifique a identidade que deseja usar na publicação."
                  placeholder="Para pesquisar..."
                  id="producer-identity"
                >
                  <DropdownSection name="organizations">
                    <DropdownOption value="org1">
                      Minha Organização
                    </DropdownOption>
                  </DropdownSection>
                </InputSelect>

                <div className="datasets-admin-page__org-card">
                  <p className="datasets-admin-page__org-card-title">
                    Você não pertence a nenhuma organização.
                  </p>
                  <p className="datasets-admin-page__org-card-description">
                    Recomendamos que publique em nome de uma organização se se
                    tratar de uma atividade profissional.
                  </p>
                  <a
                    href="#"
                    className="datasets-admin-page__org-card-link"
                  >
                    Crie ou participe de uma organização
                    <Icon
                      name="agora-line-arrow-right-circle"
                      className="w-[24px] h-[24px]"
                    />
                  </a>
                </div>

                <h2 className="datasets-admin-page__section-title">Descrição</h2>

                <div className="datasets-admin-page__fields-group">
                  <InputText
                    label="Título*"
                    placeholder="Placeholder"
                    id="api-name"
                  />
                  <InputText
                    label="Acrônimo"
                    placeholder="Placeholder"
                    id="api-acronym"
                  />
                  <InputTextArea
                    label="Descrição*"
                    placeholder="Placeholder"
                    id="dataset-description"
                    rows={4}
                    maxLength={246}
                  />
                  <InputTextArea
                    label="Descrição resumida"
                    placeholder="Placeholder"
                    id="dataset-short-description"
                    rows={3}
                  />
                  <p className="text-neutral-500 text-sm leading-relaxed -mt-2">
                    Se este campo for deixado em branco, serão utilizados os primeiros 200
                    caracteres da sua descrição.
                  </p>
                  <div className="w-1/2">
                    <Button appearance="outline" variant="primary" hasIcon leadingIcon="agora-line-edit" leadingIconHover="agora-solid-edit" fullWidth>
                      Sugira uma breve descrição.
                    </Button>
                  </div>

                  <InputSelect
                    label="Palavras-chave"
                    placeholder="Pesquise por uma palavra-chave..."
                    id="dataset-keywords"
                  >
                    <DropdownSection name="keywords">
                      <DropdownOption value="keyword1">Palavra-chave 1</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                  <div className="w-1/2">
                    <Button appearance="outline" variant="primary" hasIcon leadingIcon="agora-line-edit" leadingIconHover="agora-solid-edit" fullWidth>
                      Sugira palavras-chave
                    </Button>
                  </div>
                </div>

                <h2 className="datasets-admin-page__section-title">Acesso</h2>

                <div className="datasets-admin-page__fields-group">
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-primary-900 text-base font-medium leading-7">
                      Tipo de acesso
                    </span>
                    <div className="flex flex-row gap-4">
                      <RadioButton
                        label="Abrir"
                        id="access-open"
                        name="access-type"
                        checked={accessType === "open"}
                        onChange={() => setAccessType("open")}
                      />
                      <RadioButton
                        label="Restrito"
                        id="access-restricted"
                        name="access-type"
                        checked={accessType === "restricted"}
                        onChange={() => setAccessType("restricted")}
                      />
                    </div>
                  </div>

                  <InputSelect
                    label="Licença"
                    placeholder="Selecione uma licença"
                    id="dataset-license"
                  >
                    <DropdownSection name="licenses">
                      <DropdownOption value="license1">Licença 1</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                </div>

                <h2 className="datasets-admin-page__section-title">Tempo</h2>

                <div className="datasets-admin-page__fields-group">
                  <InputSelect
                    label="Frequência de atualização *"
                    placeholder="Procure uma frequência..."
                    id="dataset-frequency"
                  >
                    <DropdownSection name="frequencies">
                      <DropdownOption value="daily">Diária</DropdownOption>
                      <DropdownOption value="weekly">Semanal</DropdownOption>
                      <DropdownOption value="monthly">Mensal</DropdownOption>
                      <DropdownOption value="annual">Anual</DropdownOption>
                    </DropdownSection>
                  </InputSelect>

                  <div className="flex gap-[18px]">
                    <InputDate
                      label="Cobertura temporal (Data de início)"
                      id="dataset-date-start"
                      dayInputPlaceholder="dd"
                      monthInputPlaceholder="mm"
                      yearInputPlaceholder="aaaa"
                      calendarIconAriaLabel="Abrir calendário"
                      previousYearAriaLabel="Ano anterior"
                      previousMonthAriaLabel="Mês anterior"
                      nextMonthAriaLabel="Próximo mês"
                      nextYearAriaLabel="Próximo ano"
                      selectedDayAriaLabel="Dia selecionado"
                      todayDayAriaLabel="Hoje"
                      todayLabel="Hoje"
                      cancelLabel="Cancelar"
                      okLabel="OK"
                    />
                    <InputDate
                      label="Data de fim"
                      id="dataset-date-end"
                      dayInputPlaceholder="dd"
                      monthInputPlaceholder="mm"
                      yearInputPlaceholder="aaaa"
                      calendarIconAriaLabel="Abrir calendário"
                      previousYearAriaLabel="Ano anterior"
                      previousMonthAriaLabel="Mês anterior"
                      nextMonthAriaLabel="Próximo mês"
                      nextYearAriaLabel="Próximo ano"
                      selectedDayAriaLabel="Dia selecionado"
                      todayDayAriaLabel="Hoje"
                      todayLabel="Hoje"
                      cancelLabel="Cancelar"
                      okLabel="OK"
                    />
                  </div>
                </div>

                <div className="datasets-admin-page__actions">
                  <Button
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-arrow-right-circle"
                    trailingIconHover="agora-solid-arrow-right-circle"
                    onClick={onNextStep}
                  >
                    Seguinte
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Adicionar ficheiros */}
          {currentStep === 3 && (
            <>
              <StatusCard
                type="info"
                description={
                  <>
                    <strong>O que é um ficheiro?</strong>
                    <br />
                    Um conjunto de dados pode conter vários tipos de ficheiros
                    (atualizações, histórico, documentação, código-fonte, API, links, etc.).
                  </>
                }
              />

              <div className="datasets-admin-page__form">
                <h2 className="datasets-admin-page__section-title">FICHEIROS</h2>

                <div className="datasets-admin-page__org-card flex flex-col items-center gap-[16px]">
                  <ButtonUploader
                    label="Adicionar ficheiros"
                    inputLabel="Adicionar ficheiros"
                    selectedFilesLabel="ficheiros selecionados"
                    removeFileButtonLabel="Remover ficheiro"
                    replaceFileButtonLabel="Substituir ficheiro"
                    onChange={(e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files && files.length > 0) {
                        setUploadedFiles(Array.from(files));
                        setShowFileError(false);
                      }
                    }}
                  />
                </div>

                <div className="datasets-admin-page__actions datasets-admin-page__actions--between">
                  <Button
                    appearance="outline"
                    variant="neutral"
                    hasIcon
                    leadingIcon="agora-line-arrow-left-circle"
                    leadingIconHover="agora-solid-arrow-left-circle"
                    onClick={onPreviousStep}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="primary"
                    hasIcon
                    trailingIcon="agora-line-arrow-right-circle"
                    trailingIconHover="agora-solid-arrow-right-circle"
                    onClick={onNextStep}
                  >
                    Seguinte
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Finalizar a publicação */}
          {currentStep === 4 && (
            <>
              <StatusCard
                type="success"
                description={
                  <>
                    <strong>Seu conjunto de dados foi criado!</strong>
                    <br />
                    Agora você pode publicar ou salvar como rascunho.
                  </>
                }
              />

              <Button
                appearance="link"
                variant="primary"
                hasIcon
                trailingIcon="agora-line-external-link"
                trailingIconHover="agora-solid-external-link"
              >
                Dê-nos o seu feedback sobre o processo de publicação.
              </Button>

              <div className="datasets-admin-page__actions flex justify-end gap-[18px]">
                <Button appearance="outline" variant="neutral">
                  Salvar rascunho
                </Button>
                <Button variant="primary">
                  Publique o conjunto de dados
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Right: Auxiliar sidebar */}
        {currentStep !== 4 && (
          <aside className="datasets-admin-page__auxiliar">
            <div className="datasets-admin-page__auxiliar-inner">
              <div className="datasets-admin-page__auxiliar-header">
                <Icon
                  name="agora-line-question-mark"
                  className="w-[24px] h-[24px]"
                />
                <h2 className="datasets-admin-page__auxiliar-title">Auxiliar</h2>
              </div>
              <AccordionGroup>
                {auxiliarItems.map((item, idx) => (
                  <Accordion
                    key={idx}
                    headingTitle={item.title}
                    headingLevel="h3"
                  >
                    <div className="py-[12px] text-sm text-neutral-700 leading-relaxed">
                      {item.content}
                    </div>
                  </Accordion>
                ))}
              </AccordionGroup>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
