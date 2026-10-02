import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/pwa-register';

export const metadata: Metadata = {
  title: 'TahfidzWithLis',
  description: 'Platform monitoring tahfidz modern untuk guru, koordinator, dan lembaga.',
  applicationName: 'TahfidzWithLis',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#1C4C6E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
