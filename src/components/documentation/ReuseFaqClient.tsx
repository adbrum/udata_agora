"use client";

import { GitHubArticlePage } from "./GitHubArticlePage";

export default function ReuseFaqClient() {
  return (
    <GitHubArticlePage
      slug="pages/faqs/reuse"
      title="Como reutilizar dados?"
      breadcrumbItems={[
        { label: "Início", url: "/" },
        { label: "Conhecimento", url: "#" },
        { label: "Como reutilizar dados?", url: "/pages/faqs/reuse" },
      ]}
    />
  );
}
