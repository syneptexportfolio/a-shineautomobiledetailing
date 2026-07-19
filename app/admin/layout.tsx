'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarCheck, Wrench, Settings, LogOut, ExternalLink, Menu, X } from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Services', href: '/admin/services', icon: Wrench },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Mobile Toggle */}
      <button 
        className="admin-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50, padding: '0.5rem', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', color: 'white' }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}
      >
        <div style={{ marginBottom: '3rem' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-accent-primary)' }}>✦</span> A-Shine
            </span>
            <span className="badge badge--cyan" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '0.25rem', background: 'rgba(0,212,255,0.1)', color: 'var(--color-accent-primary)', fontWeight: 600 }}>
              Admin
            </span>
          </Link>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`admin-sidebar__link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  color: isActive ? 'var(--color-accent-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(0,212,255,0.1)' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            <ExternalLink size={20} />
            View Site →
          </Link>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'color 0.2s' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {children}
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
