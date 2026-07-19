import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'A-Shine Auto Mobile Detailing | Premium Car Detailing in Canada',
  description: 'Experience premium auto detailing services in Canada with A-Shine Auto Mobile Detailing. We offer exterior and interior detailing, ceramic coating, and more.',
  openGraph: {
    title: 'A-Shine Auto Mobile Detailing | Premium Car Detailing',
    description: 'Experience premium auto detailing services in Canada with A-Shine Auto Mobile Detailing.',
    url: 'https://ashinedetailing.ca',
    siteName: 'A-Shine Auto Mobile Detailing',
    locale: 'en_CA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
