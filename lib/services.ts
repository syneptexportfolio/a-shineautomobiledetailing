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
    id: 'express-wash',
    name: 'Express Wash',
    description: 'Quick exterior hand wash & dry with basic wheel clean. Perfect for maintaining your vehicle between details.',
    features: ['Hand wash & dry', 'Basic wheel clean', 'Window cleaning', 'Quick turnaround'],
    price: 3900,
    duration: 30,
    icon: '🚿',
  },
  {
    id: 'exterior-detail',
    name: 'Exterior Detail',
    description: 'Complete exterior wash, clay bar treatment, polish & wax. Includes tire dressing & trim restoration.',
    features: ['Full exterior wash', 'Clay bar treatment', 'Polish & wax', 'Tire dressing', 'Trim restoration'],
    price: 8900,
    duration: 60,
    icon: '✨',
  },
  {
    id: 'interior-detail',
    name: 'Interior Detail',
    description: 'Full vacuum, steam clean, leather conditioning. Dashboard & console detailing for a fresh interior.',
    features: ['Deep vacuum', 'Steam cleaning', 'Leather conditioning', 'Dashboard detailing', 'Odor elimination'],
    price: 9900,
    duration: 60,
    icon: '🧽',
  },
  {
    id: 'full-detail',
    name: 'Full Detail Package',
    description: 'Complete interior & exterior detailing with paint correction & ceramic spray. Our most popular package.',
    features: ['Full interior & exterior', 'Paint correction', 'Ceramic spray coating', 'Engine bay cleaning', 'All express features'],
    price: 16900,
    duration: 120,
    icon: '💎',
    popular: true,
  },
  {
    id: 'premium-detail',
    name: 'Premium Detail',
    description: 'The ultimate detail experience. Paint correction, ceramic coating, engine bay clean, headlight restoration.',
    features: ['Everything in Full Detail', 'Professional ceramic coating', 'Headlight restoration', 'Paint decontamination', 'Premium interior treatment', '30-day coating warranty'],
    price: 27900,
    duration: 180,
    icon: '👑',
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
