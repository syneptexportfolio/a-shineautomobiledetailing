'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

const mockBookings = [
  { code: 'ASH-K7M2', name: 'Sarah Thompson', service: 'Full Detail', date: 'Jul 18 2026', time: '10:00 AM', status: 'Confirmed' },
  { code: 'ASH-P3N8', name: 'Michael Chen', service: 'Interior Detail', date: 'Jul 18 2026', time: '11:00 AM', status: 'In Progress' },
  { code: 'ASH-R5X1', name: 'Emily Watson', service: 'Express Wash', date: 'Jul 18 2026', time: '1:00 PM', status: 'Completed' },
  { code: 'ASH-T9L4', name: 'James Patel', service: 'Premium Detail', date: 'Jul 19 2026', time: '9:00 AM', status: 'Confirmed' },
  { code: 'ASH-W2B6', name: 'Olivia Martinez', service: 'Exterior Detail', date: 'Jul 19 2026', time: '2:00 PM', status: 'Confirmed' },
  { code: 'ASH-Y8D3', name: 'David Kim', service: 'Full Detail', date: 'Jul 17 2026', time: '10:00 AM', status: 'Completed' },
];

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        
        <div className="stat-card glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Today's Bookings</span>
            <div style={{ background: 'rgba(227, 27, 35, 0.1)', color: 'var(--color-accent-primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-primary)', fontWeight: 700, margin: 0 }}><AnimatedCounter value={8} /></h2>
            <span style={{ color: '#10b981', fontSize: '0.875rem' }}>↑ 12% from yesterday</span>
          </div>
        </div>

        <div className="stat-card glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Revenue Today</span>
            <div style={{ background: 'rgba(15, 23, 42, 0.05)', color: 'var(--color-accent-secondary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-primary)', fontWeight: 700, margin: 0 }}>$<AnimatedCounter value={1247} /></h2>
            <span style={{ color: '#10b981', fontSize: '0.875rem' }}>↑ 8% from yesterday</span>
          </div>
        </div>

        <div className="stat-card glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Completed</span>
            <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-primary)', fontWeight: 700, margin: 0 }}><AnimatedCounter value={5} /></h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Jobs finished today</span>
          </div>
        </div>

        <div className="stat-card glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Upcoming</span>
            <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Clock size={20} />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-primary)', fontWeight: 700, margin: 0 }}><AnimatedCounter value={3} /></h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Scheduled for today</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>Recent Bookings</h2>
          <Link href="/admin/bookings" style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
            View All →
          </Link>
        </div>

        <div className="data-table-wrapper glass-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '1rem', overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--color-text-primary)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Booking Code</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Customer</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Service</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Time</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((booking) => (
                <tr key={booking.code} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{booking.code}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{booking.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{booking.service}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{booking.date}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{booking.time}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge badge--${booking.status.toLowerCase().replace(' ', '-')}`} style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: booking.status === 'Confirmed' ? 'rgba(59,130,246,0.1)' : booking.status === 'In Progress' ? 'rgba(15, 23, 42, 0.05)' : 'rgba(16,185,129,0.1)',
                      color: booking.status === 'Confirmed' ? '#3b82f6' : booking.status === 'In Progress' ? '#f59e0b' : '#10b981'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link href={`/admin/bookings/${booking.code}`} className="btn btn--ghost btn--sm" style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-secondary)', borderRadius: '0.5rem', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
