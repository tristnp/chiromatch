import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { FormScrollLink } from "@/components/FormScrollLink";
import "./globals.css";
import { siteConfig } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const googleAnalyticsId = "G-9ZF7816ZH9";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ChiropracticMatch | Auto Accident Chiropractor Matching",
    template: "%s | ChiropracticMatch"
  },
  description: siteConfig.description,
  applicationName: siteConfig.name
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dce7f4] bg-white/96 shadow-[0_8px_24px_rgba(18,32,63,0.04)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-[#12203f]">
            <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#58b7dd] text-white shadow-[0_10px_24px_rgba(88,183,221,0.22)]">
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3L18 5.5V11.4C18 15.3 15.5 18.9 12 20.4C8.5 18.9 6 15.3 6 11.4V5.5L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path d="M9.6 12L11.2 13.6L14.8 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-[1.85rem] leading-none tracking-tight">
              Chiropractic<span className="text-[#58b7dd]">Match</span>
            </span>
          </Link>
        </div>

        <div className="ml-auto hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-8 text-[0.98rem] font-semibold text-[#48617f]">
            <Link href="/blog" className="hover:text-[#12203f]">
              Blog
            </Link>
            <Link href="/locations" className="hover:text-[#12203f]">
              Browse Cities
            </Link>
            <Link href="/for-chiropractors" className="text-[#58b7dd] hover:text-[#12203f]">
              For Chiropractors
            </Link>
          </nav>

          <FormScrollLink
            className="button-primary text-sm"
            homeChildren="Request Match"
            providerChildren="Apply to Join"
          >
            Request Match
          </FormScrollLink>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#dce7f4] bg-[#f7fbff]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-[#12203f]">
            Chiropractic<span className="text-[#58b7dd]">Match</span>
          </p>
          <p className="mt-4 max-w-md text-base leading-8 text-[#536986]">
            Find a chiropractor after a car accident without the runaround. ChiropracticMatch is not a medical provider and does not give medical advice.
          </p>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#58b7dd]">Explore</p>
          <div className="mt-4 grid gap-3 text-[0.98rem] font-semibold text-[#536986]">
            <Link href="/" className="hover:text-[#12203f]">
              Home
            </Link>
            <Link href="/auto-accident-chiropractor" className="hover:text-[#12203f]">
              Auto Accident Chiropractor
            </Link>
            <Link href="/blog" className="hover:text-[#12203f]">
              Blog
            </Link>
            <Link href="/locations" className="hover:text-[#12203f]">
              Browse Cities
            </Link>
            <Link href="/for-chiropractors" className="hover:text-[#12203f]">
              For Chiropractors
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#58b7dd]">Resources</p>
          <div className="mt-4 grid gap-3 text-[0.98rem] font-semibold text-[#536986]">
            <Link href="/thank-you" className="hover:text-[#12203f]">
              Match Request
            </Link>
            <Link href="/privacy" className="hover:text-[#12203f]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#12203f]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
