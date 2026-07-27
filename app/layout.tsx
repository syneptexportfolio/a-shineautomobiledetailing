import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ashineautomobiledetailing.ca'),
  title: 'Mobile Interior Car Detailing Kitchener-Waterloo | A-Shine Auto',
  description: 'Mobile interior detailing in Kitchener-Waterloo. Steam cleaning, salt & stain removal, shampooing — we come to you. 5.0★ rated. Book today.',
  alternates: {
    canonical: 'https://ashineautomobiledetailing.ca',
  },
  openGraph: {
    title: 'Mobile Interior Car Detailing Kitchener-Waterloo | A-Shine Auto',
    description: 'Mobile interior detailing in Kitchener-Waterloo. Steam cleaning, salt & stain removal, shampooing — we come to you. 5.0★ rated. Book today.',
    url: 'https://ashineautomobiledetailing.ca',
    siteName: 'A-Shine Auto Mobile Detailing',
    locale: 'en_CA',
    type: 'website',
    images: [
      {
        url: 'https://ashineautomobiledetailing.ca/porsche-hero.png',
        width: 1200,
        height: 630,
        alt: 'A-Shine Auto Mobile Detailing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Interior Car Detailing Kitchener-Waterloo | A-Shine Auto',
    description: 'Mobile interior detailing in Kitchener-Waterloo. Steam cleaning, salt & stain removal, shampooing — we come to you. 5.0★ rated. Book today.',
    images: ['https://ashineautomobiledetailing.ca/porsche-hero.png'],
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
