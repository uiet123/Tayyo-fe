import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { BRAND } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Interview types", href: "/#interview-types" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "Mock interviews", href: "/signup" },
      { label: "Behavioral prep", href: "/signup" },
      { label: "System design", href: "/signup" },
      { label: "Resume insights", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/signup" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {BRAND.productName} is your {BRAND.positioning.toLowerCase()} — practice smarter,
              prepare better, and walk in confident.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[13px] font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {BRAND.productName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
