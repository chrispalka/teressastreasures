import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { LeopardPattern } from "@/components/brand/leopard-pattern";

const shopLinks = [
  { label: "All Jewelry", href: "/products" },
  { label: "Rings", href: "/categories/rings" },
  { label: "Earrings", href: "/categories/earrings" },
  { label: "Necklaces", href: "/categories/necklaces" },
  { label: "Bracelets", href: "/categories/bracelets" },
  { label: "Scarves", href: "/categories/scarves" },
];

const helpLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "FAQ", href: "/faq" },
];

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-champagne-gold">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-warm-sand transition-colors hover:text-champagne-gold"
      >
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-warm-sand">
      <LeopardPattern opacity={0.03} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-baseline gap-1">
            <span className="font-serif text-2xl italic text-champagne-gold">
              Teressa&apos;s
            </span>
            <span className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-warm-sand">
              Treasures
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-warm-sand/70">
            Bold, nature-inspired jewelry and accessories for the confident
            woman. Subscribe to our newsletter for exclusive offers and new
            arrivals.
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <FooterColumn title="Shop">
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Help">
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="About">
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Connect">
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-warm-sand transition-colors hover:text-champagne-gold"
                  >
                    <link.icon className="h-4 w-4 text-champagne-gold" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-warm-sand/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-warm-sand/50">
            &copy; 2024 Teressa&apos;s Treasures. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-warm-sand/40">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
