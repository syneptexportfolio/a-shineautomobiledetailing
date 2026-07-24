// Service data shared across the application
export interface Service {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number; // in cents (CAD)
  duration: number; // in minutes
  icon: string;
  popular?: boolean;
}

export const SERVICES: Service[] = [
  {
    id: 'interior-small',
    name: 'Full Interior Shampoo (Small Car)',
    description: 'Complete interior deep clean & shampooing for sedans & coupes. Includes seats, carpets, dashboard, vents, door jambs, and trunk.',
    features: ['Seat shampooing & stain removal', 'Deep carpet extraction & salt removal', 'Dashboard, console & vents sanitized', 'Trunk & door jambs cleaned'],
    price: 10000,
    duration: 90,
    icon: '🧽',
    popular: true,
  },
  {
    id: 'interior-suv',
    name: 'Full Interior Shampoo (5-Seater SUV)',
    description: 'Deep interior shampooing & sanitization for 5-seater SUVs & crossovers. Includes seats, carpets, and trunk.',
    features: ['Seat & carpet deep shampooing', 'Steam cleansing & winter salt extraction', 'Dashboard, console & cup holders', 'Trunk & door jambs detailed'],
    price: 12500,
    duration: 120,
    icon: '🚙',
    popular: true,
  },
  {
    id: 'interior-7seater',
    name: 'Full Interior Shampoo (7-Seater / Large)',
    description: 'Full interior deep clean & shampooing for 7-seaters, 3-row SUVs, minivans & trucks.',
    features: ['All 3 rows seat shampooing', 'Deep carpet & mat salt removal', 'Dashboard, console & climate controls', 'Spill & stain extraction'],
    price: 15000,
    duration: 150,
    icon: '🚐',
    popular: true,
  },
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
