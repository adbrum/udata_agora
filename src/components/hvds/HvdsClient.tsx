"use client";

import { Breadcrumb, StatusCard } from "@ama-pt/agora-design-system";

export default function HvdsClient() {
  return (
    <div className="container mx-auto px-16 py-32">
      <Breadcrumb
        items={[
          { label: "Início", url: "/" },
          { label: "HVDs", url: "/pages/hvds" },
        ]}
      />

      <h1 className="text-2xl-bold mt-24 mb-16">High Value Datasets</h1>

      <StatusCard
        type="warning"
        description="Página em manutenção"
      />
    </div>
  );
}
