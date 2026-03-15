"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@ama-pt/agora-design-system";
import PageBanner from "@/components/PageBanner";
import { useRouter } from "next/navigation";
import { fetchPost, fetchPosts } from "@/services/api";
import { Post } from "@/types/api";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface ArticleDetailProps {
  rid: string;
}

export default function ArticleDetail({ rid }: ArticleDetailProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [postData, postsResponse] = await Promise.all([
          fetchPost(rid),
          fetchPosts(1, 4),
        ]);

        if (!postData) {
          setNotFound(true);
          return;
        }

        setPost(postData);
        setRelatedPosts(postsResponse.data.filter((p) => p.slug !== rid).slice(0, 3));
      } catch (error) {
        console.error("Error loading article:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [rid]);

  const formatPostDate = (dateStr: string | null): string => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return "";
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: "agora-line-facebook", href: "#" },
    { name: "Twitter", icon: "agora-line-twitter", href: "#" },
    { name: "LinkedIn", icon: "agora-line-linkedin", href: "#" },
    { name: "WhatsApp", customIcon: "/Icons/whatsapp.svg", href: "#" },
    { name: "e-mail", icon: "agora-line-mail", href: "#" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-neutral-600">A carregar artigo...</span>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-16">
        <h1 className="text-2xl-bold text-neutral-900">Artigo não encontrado</h1>
        <p className="text-neutral-600">O artigo que procura não existe ou foi removido.</p>
        <Link href="/pages/article" className="text-primary-600 underline hover:text-primary-700">
          Voltar aos artigos
        </Link>
      </div>
    );
  }

  const displayDate = formatPostDate(post.published || post.created_at);

  return (
    <div className="flex flex-col bg-white min-h-screen font-sans text-neutral-900 pb-128">
      <main className="flex-grow">
        <PageBanner
          title={
            <div className="flex flex-col gap-12 max-w-[592px]">
              <span className="text-primary-900 text-[20px] mb-8">
                Publicado em {displayDate}
              </span>
              <span className="block text-primary-900 xs:text-xl-semibold md:text-2xl-semibold xl:text-2xl-semibold">
                {post.name}
              </span>
            </div>
          }
          variant="light"
          className="bg-white"
          breadcrumbItems={[
            { label: "Início", url: "/" },
            { label: "Artigos", url: "/pages/article" },
            { label: post.name, url: "#" },
          ]}
          subtitle={
            <p className="text-neutral-700 text-lg leading-relaxed max-w-[592px]">
              {post.headline}
            </p>
          }
        />

        <div className="container mx-auto px-16 sm:px-32 lg:px-64 pt-64 full-width-bg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-80 bg-neutral-50">
            {/* Left Column: Content */}
            <div className="lg:col-span-8 flex flex-col gap-48">
              <div className="max-w-[592px] whitespace-pre-wrap text-m-regular text-neutral-800 leading-relaxed">
                {post.body_type === "html" ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <div className="whitespace-pre-wrap">{post.content}</div>
                )}

                {post.image && (
                  <div className="my-40 rounded-8 overflow-hidden bg-neutral-100">
                    <img
                      src={post.image}
                      alt={post.name}
                      className="w-full object-cover aspect-[16/9]"
                    />
                  </div>
                )}

                {post.credit_to && (
                  <p className="text-xs text-neutral-500 mt-8">
                    Créditos: {post.credit_url ? (
                      <a href={post.credit_url} className="underline" target="_blank" rel="noopener noreferrer">
                        {post.credit_to}
                      </a>
                    ) : post.credit_to}
                  </p>
                )}
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-8 max-w-[592px]">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-12 py-4 bg-neutral-100 text-neutral-700 text-xs rounded-4"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share section */}
              <div className="pt-32 border-t border-neutral-200 max-w-[592px]">
                <span className="text-s-regular text-neutral-600 block mb-24">
                  Partilhar esta notícia
                </span>
                <div className="flex flex-wrap gap-24 md:gap-40">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-8 text-primary-600 hover:text-primary-700 transition-colors group"
                    >
                      {link.icon ? (
                        <Icon name={link.icon as any} className="w-20 h-20" aria-hidden="true" />
                      ) : (
                        <img src={link.customIcon} alt="" className="w-20 h-20" />
                      )}
                      <span className="text-s-bold">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar (Related Articles) */}
            <aside className="lg:col-span-4">
              <div className="sticky top-32">
                <h3 className="text-l-regular text-neutral-800 mb-24">
                  Outros <span className="font-bold">artigos</span> relacionados
                </h3>
                <div className="flex flex-col gap-24">
                  {relatedPosts.map((rel) => (
                    <div
                      key={rel.id}
                      className="flex justify-between gap-16 items-start pb-24 border-b border-neutral-100 last:border-0 cursor-pointer group"
                      onClick={() => router.push(`/pages/article/${rel.slug}`)}
                    >
                      <div className="flex flex-col gap-8 flex-grow">
                        <span className="text-xs text-neutral-500">
                          {formatPostDate(rel.published || rel.created_at)}
                        </span>
                        <h4 className="text-s-bold text-primary-900 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">
                          {rel.name}
                        </h4>
                      </div>
                      {(rel.image_thumbnail || rel.image) && (
                        <div className="w-[124px] h-[70px] flex-shrink-0 bg-neutral-100 rounded-4 overflow-hidden shadow-sm">
                          <img
                            src={rel.image_thumbnail || rel.image || ""}
                            alt={rel.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
