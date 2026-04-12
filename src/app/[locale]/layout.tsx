import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/theme/theme-provider";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import QueryProvider from "@/lib/QueryProvider";
import FilenestUserFileModalProvider from "@/modules/client/shared/provider/FilenestUserFileModalProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DrGodly",
  description:
    "A modern telemedicine application for virtual doctor consultations, appointment scheduling, patient management, and secure digital healthcare.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.className} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="teal-light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <FilenestUserFileModalProvider />
            </QueryProvider>
            <Toaster />
            <NextTopLoader showSpinner={false} color="var(--progress-bar)" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
