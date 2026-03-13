import { AdminSideNavigation } from "@/components/admin/AdminSideNavigation";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-wrapper">
      <AdminHeader />
      <div className="admin-layout">
        <AdminSideNavigation />
        <div className="admin-layout__content">{children}</div>
      </div>
    </div>
  );
}
