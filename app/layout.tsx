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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDetailingService",
    "name": "A-Shine Auto Mobile Detailing",
    "url": "https://ashineautomobiledetailing.ca",
    "telephone": "+1-519-729-5856",
    "email": "info@ashineautomobiledetailing.ca",
    "image": "https://ashineautomobiledetailing.ca/porsche-hero.png",
    "priceRange": "$100–$250",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "54 Woodbine Avenue",
      "addressLocality": "Kitchener",
      "addressRegion": "ON",
      "postalCode": "N2R 1V1",
      "addressCountry": "CA"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Kitchener",
        "sameAs": "https://en.wikipedia.org/wiki/Kitchener,_Ontario"
      },
      {
        "@type": "City",
        "name": "Waterloo",
        "sameAs": "https://en.wikipedia.org/wiki/Waterloo,_Ontario"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": "420"
    },
    "sameAs": [
      "https://www.facebook.com/people/A-shine-Automobile-Detailing/61580395624520/",
      "https://www.instagram.com/ashineautomobiledetailing/"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
