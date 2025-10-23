"use client";
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
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
