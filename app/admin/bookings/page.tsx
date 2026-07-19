'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';

const allMockBookings = [
  { code: 'ASH-K7M2', name: 'Sarah Thompson', service: 'Full Detail', date: 'Jul 18 2026', time: '10:00 AM', status: 'Confirmed' },
  { code: 'ASH-P3N8', name: 'Michael Chen', service: 'Interior Detail', date: 'Jul 18 2026', time: '11:00 AM', status: 'In Progress' },
  { code: 'ASH-R5X1', name: 'Emily Watson', service: 'Express Wash', date: 'Jul 18 2026', time: '1:00 PM', status: 'Completed' },
  { code: 'ASH-T9L4', name: 'James Patel', service: 'Premium Detail', date: 'Jul 19 2026', time: '9:00 AM', status: 'Confirmed' },
  { code: 'ASH-W2B6', name: 'Olivia Martinez', service: 'Exterior Detail', date: 'Jul 19 2026', time: '2:00 PM', status: 'Confirmed' },
  { code: 'ASH-Y8D3', name: 'David Kim', service: 'Full Detail', date: 'Jul 17 2026', time: '10:00 AM', status: 'Completed' },
  { code: 'ASH-J4F9', name: 'Robert Johnson', service: 'Exterior Detail', date: 'Jul 19 2026', time: '4:00 PM', status: 'Confirmed' },
  { code: 'ASH-M2L1', name: 'Amanda Smith', service: 'Full Detail', date: 'Jul 20 2026', time: '9:00 AM', status: 'Confirmed' },
  { code: 'ASH-Q8K5', name: 'William Davis', service: 'Interior Detail', date: 'Jul 20 2026', time: '1:00 PM', status: 'Confirmed' },
  { code: 'ASH-V6C3', name: 'Jessica Brown', service: 'Premium Detail', date: 'Jul 16 2026', time: '2:00 PM', status: 'Completed' },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filteredBookings = allMockBookings.filter(b => {
    const matchesTab = 
      activeTab === 'All' ? true :
      activeTab === 'Today' ? b.date === 'Jul 18 2026' :
      activeTab === 'Upcoming' ? b.date.includes('19') || b.date.includes('20') :
      activeTab === 'Completed' ? b.status === 'Completed' : true;
    
    const matchesSearch = 
      b.code.toLowerCase().includes(search.toLowerCase()) || 
      b.name.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Bookings</h1>
          
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-bg-secondary)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
            {['All', 'Today', 'Upcoming', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: activeTab === tab ? 'var(--color-accent-primary)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
                  fontWeight: activeTab === tab ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by code, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '0.75rem',
              color: 'var(--color-text-primary)',
              outline: 'none',
            }}
          />
        </div>
      </header>

      <div className="data-table-wrapper glass-card" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '1rem', overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--color-text-primary)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Booking Code</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Customer</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Service</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Time</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
              <tr key={booking.code} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{booking.code}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>{booking.name}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{booking.service}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{booking.date}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{booking.time}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span className={`badge badge--${booking.status.toLowerCase().replace(' ', '-')}`} style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: booking.status === 'Confirmed' ? 'rgba(59,130,246,0.1)' : booking.status === 'In Progress' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                    color: booking.status === 'Confirmed' ? '#3b82f6' : booking.status === 'In Progress' ? '#f59e0b' : '#16a34a'
                  }}>
                    {booking.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <Link href={`/admin/bookings/${booking.code}`} className="btn btn--ghost btn--sm" style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-secondary)', borderRadius: '0.5rem', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    View Details
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No bookings found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {filteredBookings.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.875rem' }}>Page 1 of 3</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-secondary)', border: 'none', borderRadius: '0.5rem', color: 'var(--color-text-primary)', cursor: 'pointer' }}>Previous</button>
              <button style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-secondary)', border: 'none', borderRadius: '0.5rem', color: 'var(--color-text-primary)', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
