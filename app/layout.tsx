import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/pwa-register';

export const metadata: Metadata = {
  title: 'TahfidzWithLis · Bina Insan Palu',
  description: 'Aplikasi monitoring tahfidz SD Islam Terpadu Bina Insan Palu untuk siswa, setoran, murajaah, target, dan laporan.',
  applicationName: 'TahfidzWithLis',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/bina-insan-logo.jpg', apple: '/bina-insan-logo.jpg' },
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
