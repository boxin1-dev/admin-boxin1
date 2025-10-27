"use client";
import { AppSidebar } from "@/components/Dashboard/AppSidebar";
import { SiteHeader } from "@/components/Dashboard/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/src/lib/auth-client";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = authClient.useSession();

  if (isPending) return <div>Loading....</div>;

  if (error) return <div>error</div>;

  //const userRole = session?.user.role as Role;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
