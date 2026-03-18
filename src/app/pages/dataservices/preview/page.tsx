"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Breadcrumb, Pill } from "@ama-pt/agora-design-system";

function DataservicePreviewContent() {
  const searchParams = useSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const title = searchParams.get("title") || "Sem título";
  const description = searchParams.get("description") || "Sem descrição";

  return (
    <div className="flex flex-col font-sans text-neutral-900 bg-white min-h-screen overflow-x-hidden">
      <main className="flex-grow container mx-auto px-4 pt-[64px]">
        <div className="flex justify-between items-center mb-[24px]">
          <Breadcrumb
            items={[
              { label: "Home", url: "/" },
              { label: "API", url: "/pages/admin/me/dataservices" },
              { label: title, url: "#" },
            ]}
          />
        </div>

        <div className="flex justify-end items-center gap-[16px] mb-[24px]">
          <Pill variant="warning">Rascunho</Pill>
          <Button
            variant="primary"
            appearance={isFavorite ? "solid" : "outline"}
            hasIcon={true}
            leadingIcon={isFavorite ? "agora-solid-star" : "agora-line-star"}
            leadingIconHover="agora-solid-star"
            className="flex-shrink-0"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          </Button>
        </div>

        <div className="mb-[24px]">
          <h1 className="text-xl-bold text-primary-900 leading-tight mb-24">
            {title}
          </h1>
          <p className="text-neutral-900 text-m-light">{description}</p>
        </div>
      </main>
    </div>
  );
}

export default function DataservicePreviewPage() {
  return (
    <Suspense fallback={<div>A carregar...</div>}>
      <DataservicePreviewContent />
    </Suspense>
  );
}
