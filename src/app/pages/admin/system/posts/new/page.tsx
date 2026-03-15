import type { Metadata } from "next";
import PostsNewClient from "@/components/admin/posts/PostsNewClient";

export const metadata: Metadata = {
  title: "Criar artigo - Admin - dados.gov",
  description: "Criação de um novo artigo no portal dados.gov.",
};

export default function PostsNewPage() {
  return <PostsNewClient />;
}
