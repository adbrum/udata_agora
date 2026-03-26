import type { Metadata } from "next";
import ProfileClient from "@/components/admin/profile/ProfileClient";

export const metadata: Metadata = {
  title: "Perfil - Admin - dados.gov",
  description: "Perfil do utilizador no portal dados.gov.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
