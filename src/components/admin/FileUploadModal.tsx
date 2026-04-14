"use client";

import React from "react";
import { Button, usePopupContext } from "@ama-pt/agora-design-system";
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
      {hasSelection && (
        <span className="text-neutral-600 text-sm">
          {uploadedFiles.length > 0 && (
            <span>{uploadedFiles.length} ficheiro(s) selecionado(s)</span>
          )}
          {uploadedFiles.length > 0 && hasValidUrl && <span> · </span>}
          {hasValidUrl && <span>Link adicionado</span>}
        </span>
      )}
      {hasError && !hasSelection && (
        <span className="text-danger-500 text-sm">Campo obrigatório</span>
      )}
    </div>
  );
}
