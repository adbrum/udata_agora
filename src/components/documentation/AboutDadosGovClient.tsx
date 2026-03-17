"use client";

import { GitHubArticlePage } from "./GitHubArticlePage";

export default function AboutDadosGovClient() {
  return (
    <GitHubArticlePage
      slug="pages/faqs/about_dadosgov"
      title="Sobre o dados.gov"
      breadcrumbItems={[
        { label: "Início", url: "/" },
        { label: "Conhecimento", url: "#" },
        { label: "Sobre o dados.gov", url: "/pages/faqs/about_dadosgov" },
      ]}
    />
  );
}
