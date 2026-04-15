"use client";

import React from "react";
import { Button, ButtonUploader, usePopupContext } from "@ama-pt/agora-design-system";
import FileUploadPopupContent from "@/components/admin/FileUploadPopupContent";

interface FileUploadModalProps {
  uploadedFiles: File[];
  resourceUrl: string;
  hasValidUrl: boolean;
  onFilesChange: (files: File[]) => void;
  onUrlChange: (url: string) => void;
  hasError?: boolean;
}

export default function FileUploadModal({
  uploadedFiles,
  resourceUrl,
  hasValidUrl,
  onFilesChange,
  onUrlChange,
  hasError,
}: FileUploadModalProps) {
  const { show } = usePopupContext();
  const hasSelection = uploadedFiles.length > 0 || hasValidUrl;

  const handleOpen = () => {
    show(
      <FileUploadPopupContent
        initialFiles={uploadedFiles}
        initialUrl={resourceUrl}
        onConfirm={(files, url) => {
          onFilesChange(files);
          onUrlChange(url);
        }}
      />,
      {
        title: "Carregar ficheiros",
        closeAriaLabel: "Fechar",
        dimensions: "m",
      },
    );
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-primary-900 text-base font-medium leading-7">Ficheiros</span>

      <Button
        variant={hasError && !hasSelection ? "danger" : "primary"}
        appearance="outline"
        hasIcon
        leadingIcon="agora-line-plus-circle"
        leadingIconHover="agora-solid-plus-circle"
        onClick={handleOpen}
        style={{ width: "fit-content" }}
      >
        Adicionar ficheiros
      </Button>

      {hasError && !hasSelection && (
        <span className="text-danger-500 text-sm">Campo obrigatório</span>
      )}

      {uploadedFiles.length > 0 && (
        <ButtonUploader
          multiple
          hideLabel
          label="Ficheiros adicionados"
          inputLabel="Adicionar mais ficheiros"
          selectedFilesLabel="ficheiros selecionados"
          removeFileButtonLabel="Remover ficheiro"
          replaceFileButtonLabel="Substituir ficheiro"
          files={uploadedFiles}
          maxCount={uploadedFiles.length}
          onChange={(e) => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            onFilesChange(files);
          }}
        />
      )}

      {hasValidUrl && (
        <span className="text-neutral-600 text-sm">Link adicionado: {resourceUrl}</span>
      )}
    </div>
  );
}
