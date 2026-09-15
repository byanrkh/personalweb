import Footer from "@/components/Navigation/Footer";
import Navbar from "@/components/Navigation/Navbar";
import { getAdminUser } from "@/libs/supabase/auth";
import React from "react";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAdmin={!!admin} />
      <main className="flex flex-1 items-center">{children}</main>
      <Footer />
    </div>
  );
}
