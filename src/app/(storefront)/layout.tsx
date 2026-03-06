import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { SearchCommand } from "@/components/storefront/search-command";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <SearchCommand />
    </>
  );
}
