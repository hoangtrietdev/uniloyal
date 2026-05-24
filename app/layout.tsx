import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

export const metadata: Metadata = {
  title: 'UniLoyal — Omni-Channel Loyalty Ecosystem',
  description: 'Earn, redeem and manage loyalty points across all your favourite brands with NFC tap-to-earn technology.',
  keywords: ['loyalty', 'rewards', 'NFC', 'points', 'Vietnam', 'coffee', 'shopping'],
  authors: [{ name: 'UniLoyal' }],
  applicationName: 'UniLoyal',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UniLoyal',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'UniLoyal — Omni-Channel Loyalty Ecosystem',
    description: 'Earn and redeem loyalty points across all your favourite brands',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
