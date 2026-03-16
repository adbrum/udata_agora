"use client";

import { Breadcrumb, StatusCard } from "@ama-pt/agora-design-system";

export default function PublishFaqClient() {
  return (
    <div className="container mx-auto px-16 py-32">
      <Breadcrumb
        items={[
          { label: "Início", url: "/" },
          { label: "Como publicar dados?", url: "/pages/faqs/publish" },
        ]}
      />

      <h1 className="text-2xl-bold mt-24 mb-16">Como publicar dados?</h1>

      <StatusCard
        type="warning"
        description="Página em manutenção"
      />
    </div>
  );
}
