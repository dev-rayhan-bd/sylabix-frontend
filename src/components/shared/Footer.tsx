import Link from "next/link";
import Image from "next/image";
import {
  TwitterIcon,
  GithubIcon,
  InstagramIcon,
} from "@/components/shared/premium-icons";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/sylabixlogo.png"
                alt="Syllabix"
                width={40}
                height={40}
                className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
                unoptimized
              />
              <span className="text-lg font-bold tracking-tight text-foreground">
                Syllabix
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Master your syllabus with AI-powered intelligence.
              Transform your study materials into adaptive learning plans.
            </p>
            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
              >
                <GithubIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
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

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Syllabix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
