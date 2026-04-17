"use client";

import React, { useRef, useState } from "react";
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
  // Accumulate files picked inside the popup before confirming
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [localUrl, setLocalUrl] = useState(initialUrl);
  const uploaderRef = useRef<{ input: HTMLInputElement | null; reset: () => void } | null>(null);

  const handleConfirm = () => {
    // Merge newly picked files with the ones already on the page (initialFiles)
    const names = new Set(initialFiles.map((f) => f.name));
    const merged = [...initialFiles, ...pendingFiles.filter((f) => !names.has(f.name))];
    onConfirm(merged, localUrl);
    hide();
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      {/*
        The ButtonUploader resets its internal list after each pick so the popup
        shows only the upload button. The selected files are accumulated in
        pendingFiles and rendered as a list on the page after confirming.
      */}
      <ButtonUploader
        ref={uploaderRef}
        multiple
        label="Ficheiros"
        inputLabel="Selecione ou arraste os ficheiros"
        selectedFilesLabel="ficheiros selecionados"
        removeFileButtonLabel="Remover ficheiro"
        replaceFileButtonLabel="Substituir ficheiro"
        onChange={(e) => {
          const picked = Array.from((e.target as HTMLInputElement).files || []);
          if (picked.length === 0) return;
          setPendingFiles((prev) => {
            const existing = new Set(prev.map((f) => f.name));
            return [...prev, ...picked.filter((f) => !existing.has(f.name))];
          });
          // Reset uploader display so only the button remains visible in the popup.
          setTimeout(() => uploaderRef.current?.reset(), 0);
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
