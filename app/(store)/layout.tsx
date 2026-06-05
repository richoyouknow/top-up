import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { Suspense } from "react";

// Lazy loading skeleton for navbar
function NavbarSkeleton() {
  return (
    <div className="h-16 bg-[#13111b] border-b border-dark-purple/30 animate-pulse" />
  );
}

// Lazy loading skeleton for footer
function FooterSkeleton() {
  return (
    <div className="h-40 bg-[#13111b] border-t border-dark-purple/30 animate-pulse" />
  );
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 flex flex-col w-full relative z-10">
        {children}
      </main>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </>
  );
}
