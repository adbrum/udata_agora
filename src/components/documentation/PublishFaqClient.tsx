"use client";

import { GitHubArticlePage } from "./GitHubArticlePage";

export default function PublishFaqClient() {
  return (
    <GitHubArticlePage
      slug="pages/faqs/publish"
      title="Como publicar dados?"
      breadcrumbItems={[
        { label: "Início", url: "/" },
        { label: "Conhecimento", url: "#" },
        { label: "Como publicar dados?", url: "/pages/faqs/publish" },
      ]}
    />
  );
}
