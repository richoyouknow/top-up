import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative z-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
