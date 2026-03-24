"use client";

import React, { useState } from "react";
import { Button, ButtonUploader, InputText, usePopupContext } from "@ama-pt/agora-design-system";

interface FileUploadPopupContentProps {
  initialFiles: File[];
  initialUrl: string;
  onConfirm: (files: File[], url: string) => void;
}

export default function FileUploadPopupContent({
  initialFiles,
  initialUrl,
  onConfirm,
}: FileUploadPopupContentProps) {
  const { hide } = usePopupContext();
  const [localFiles, setLocalFiles] = useState<File[]>(initialFiles);
  const [localUrl, setLocalUrl] = useState(initialUrl);

  const handleConfirm = () => {
    onConfirm(localFiles, localUrl);
    hide();
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      <ButtonUploader
        label="Ficheiros"
        inputLabel="Selecione ou arraste o ficheiro"
        selectedFilesLabel="ficheiros selecionados"
        removeFileButtonLabel="Eliminar ficheiro"
        replaceFileButtonLabel="Substituir ficheiro"
        onChange={(e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            setLocalFiles(Array.from(files));
          }
        }}
      />

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-neutral-300" />
        <span className="text-neutral-500 text-sm px-3">ou</span>
        <div className="flex-1 border-t border-neutral-300" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-primary-900 font-semibold text-sm">Adicionar um link</h2>
        <InputText
          label="Link exato para o ficheiro"
          placeholder="https://"
          id="modal-resource-url"
          value={localUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalUrl(e.target.value)}
          feedbackState="info"
          hasFeedback
          feedbackText="Insira um URL válido, começando com https://"
        />
      </div>

      <div className="flex justify-end gap-[18px]">
        <Button appearance="outline" variant="neutral" onClick={hide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
