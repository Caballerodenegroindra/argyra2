import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import type { ReactNode } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { MobileNav } from '@/layouts/MobileNav';
import { SiteFooter } from '@/layouts/SiteFooter';
import { SiteHeader } from '@/layouts/SiteHeader';
import '@/styles/globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Argyra — apoyo a grupos y comunidades',
    template: '%s — Argyra',
  },
  description:
    'Argyra acompaña a administradores de grupos y comunidades con organización, crecimiento, diseño y automatización.',
};

export const viewport: Viewport = {
  themeColor: '#090b0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh antialiased">
        <AuthProvider>
          <SiteHeader />
          <main className="pb-20 sm:pb-0">{children}</main>
          <SiteFooter />
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
