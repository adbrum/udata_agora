"use client";

import { Breadcrumb, StatusCard } from "@ama-pt/agora-design-system";

export default function TermsClient() {
  return (
    <div className="container mx-auto px-16 py-32">
      <Breadcrumb
        items={[
          { label: "Início", url: "/" },
          { label: "Termos de utilização", url: "/pages/faqs/terms" },
        ]}
      />

      <h1 className="text-2xl-bold mt-24 mb-16">Termos de utilização</h1>

      <StatusCard
        type="warning"
        description="Página em manutenção"
      />
    </div>
  );
}
