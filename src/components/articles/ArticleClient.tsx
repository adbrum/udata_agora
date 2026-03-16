"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CardLinks,
  InputSearchBar,
  Button,
  InputSelect,
  DropdownSection,
  DropdownOption,
} from "@ama-pt/agora-design-system";
import PageBanner from "@/components/PageBanner";
import { Pagination } from "@/components/Pagination";

import { fetchPosts } from "@/services/api";
import { Post } from "@/types/api";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const PAGE_SIZE = 12;

export default function ArticleClient({ currentPage }: { currentPage: number }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetchPosts(currentPage, PAGE_SIZE);
        setPosts(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, [currentPage]);

  const formatPostDate = (post: Post): string => {
    const dateStr = post.published || post.created_at;
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 filters article">
      <main className="grow bg-primary-50">
        <PageBanner
          title="Últimas novidades"
          backgroundImageUrl="/Banner/hero-bg.png"
          backgroundPosition="center right"
          breadcrumbItems={[
            { label: "Home", url: "/" },
            { label: "Últimas novidades", url: "/pages/article" },
          ]}
        >
          <InputSearchBar
            label="O que procura nas novidades?"
            placeholder="Pesquisar artigos, notícias, webinars..."
            id="articles-search"
            hasVoiceActionButton={true}
            voiceActionAltText="Pesquisar por voz"
            searchActionAltText="Pesquisar"
            darkMode={true}
          />
          <div className="mt-8 text-s-regular text-neutral-200">
            Exemplos: &quot;webinar&quot;, &quot;estudos&quot;, &quot;eventos&quot;
          </div>
        </PageBanner>

        <div className="container mx-auto md:gap-32 xl:gap-64">
          <div className="pt-32 pb-64">
            <div className="grid md:grid-cols-2 xl:grid-cols-12 gap-32 mb-16 items-center mt-[12px]">
              <span className="text-neutral-900 font-medium text-base xl:col-span-7 mt-[32px]">
                {isLoading ? "A carregar..." : `${total} Resultados`}
              </span>
              <div className="w-full md:w-auto xl:col-span-5 flex items-end gap-16 justify-end">
                <Button
                  variant="primary"
                  appearance="link"
                  hasIcon={true}
                  trailingIcon="agora-line-settings"
                  trailingIconHover="agora-solid-settings"
                >
                  Filtrar
                </Button>
                <div className="grow max-w-[240px]">
                  <InputSelect
                    label="Ordenar por :"
                    id="sort-articles"
                    defaultValue="recentes"
                    className="selectArticle"
                  >
                    <DropdownSection name="order">
                      <DropdownOption value="recentes">Mais recentes</DropdownOption>
                      <DropdownOption value="antigos">Mais antigos</DropdownOption>
                      <DropdownOption value="visualizados">Mais visualizados</DropdownOption>
                    </DropdownSection>
                  </InputSelect>
                </div>
              </div>
            </div>

            <div className="divider-neutral-200 mt-[14px] mb-24" />

            {isLoading ? null : posts.length === 0 ? (
              <div className="flex justify-center py-64">
                <span className="text-neutral-600">Nenhum artigo encontrado.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 agora-card-links-datasets-px0 gap-32">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="h-full cursor-pointer group"
                    onClick={() => router.push(`/pages/article/${post.slug}`)}
                  >
                    <CardLinks
                      className="text-neutral-900 transition-all group-hover:shadow-md"
                      variant="transparent"
                      image={{
                        src: post.image_thumbnail || post.image || "/laptop.png",
                        alt: post.name,
                      }}
                      category={post.owner ? `${post.owner.first_name} ${post.owner.last_name}` : ""}
                      title={<div className="underline text-xl-bold">{post.name}</div>}
                      description={
                        <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px]">
                          {post.headline}
                        </p>
                      }
                      date={<span className="font-[300]">{formatPostDate(post)}</span>}
                      links={[
                        {
                          href: "#",
                          hasIcon: true,
                          leadingIcon: "agora-line-calendar",
                          leadingIconHover: "agora-solid-calendar",
                          trailingIcon: "",
                          trailingIconHover: "",
                          trailingIconActive: "",
                          children: formatPostDate(post),
                          title: "Data",
                          onClick: (e: React.MouseEvent) => e.preventDefault(),
                          className: "text-[#034AD8]",
                        },
                      ]}
                      mainLink={
                        <Link href={`/pages/article/${post.slug}`}>
                          <span className="underline">{post.name}</span>
                        </Link>
                      }
                      blockedLink={true}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pb-64 mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                pageSize={PAGE_SIZE}
                baseUrl="/pages/article"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
