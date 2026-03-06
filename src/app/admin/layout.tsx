import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/admin/sidebar-nav";

export const metadata = {
  title: "Admin Dashboard | Teressa's Treasures",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 bg-ivory p-6 lg:p-8 lg:ml-64">{children}</main>
    </div>
  );
}
