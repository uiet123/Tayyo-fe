import { MarketingNavbar } from "@/components/navbar/marketing-navbar";
import { Footer } from "@/components/landing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
