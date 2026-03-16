"use client";

import { Breadcrumb, StatusCard } from "@ama-pt/agora-design-system";

export default function AboutDadosGovClient() {
  return (
    <div className="container mx-auto px-16 py-32">
      <Breadcrumb
        items={[
          { label: "Início", url: "/" },
          { label: "O que é o dados.gov", url: "/pages/faqs/about_dadosgov" },
        ]}
      />

      <h1 className="text-2xl-bold mt-24 mb-16">O que é o dados.gov</h1>

      <StatusCard
        type="warning"
        description="Página em manutenção"
      />
    </div>
  );
}
