'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, FileText, MessageSquare, X, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [status, setStatus] = useState('Confirmed');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmDelivery = () => {
    setStatus('Completed');
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      <header>
        <Link href="/admin/bookings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1rem', transition: 'color 0.2s' }}>
          <ArrowLeft size={16} />
          Back to Bookings
        </Link>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-text-primary)' }}>Booking Details</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Booking Information</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Booking Code</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>{id}</span>
                  <button onClick={handleCopy} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-primary)', cursor: 'pointer', padding: '0.25rem' }}>
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</span>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.875rem', 
                    fontWeight: 600,
                    background: status === 'Confirmed' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                    color: status === 'Confirmed' ? '#3b82f6' : '#10b981',
                    display: 'inline-block'
                  }}>
                    {status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Service</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>Full Detail Package</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Created</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>July 15, 2026</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Date</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>July 18, 2026</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Time</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>10:00 AM - 12:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Customer Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Name</span>
                <span style={{ color: 'var(--color-text-primary)' }}>Sarah Thompson</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Vehicle</span>
                <span style={{ color: 'var(--color-text-primary)' }}>SUV</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Email</span>
                <span style={{ color: 'var(--color-text-primary)' }}>sarah.thompson@email.com</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Phone</span>
                <span style={{ color: 'var(--color-text-primary)' }}>+1 (416) 555-0123</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>WhatsApp Opt-in</span>
                <span style={{ color: 'var(--color-text-primary)' }}>✅ Yes</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Notes</span>
                <span style={{ color: 'var(--color-text-primary)', background: 'var(--color-bg-secondary)', padding: '0.75rem', borderRadius: '0.5rem', display: 'block', fontSize: '0.875rem' }}>
                  "Please focus on the dashboard area"
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Payment Details</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>$169.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>HST (13%)</span>
                <span>$21.97</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.25rem', fontWeight: 700, fontSize: '1.125rem' }}>
                <span>Total</span>
                <span>$190.97</span>
              </div>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16,185,129,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ display: 'block', color: '#10b981', fontWeight: 600, marginBottom: '0.25rem' }}>Payment Status: Paid ✓</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Stripe ID: pi_3O...H9k2</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {status !== 'Completed' ? (
              <button 
                onClick={() => setShowModal(true)}
                className="btn btn--primary btn--lg btn--full" 
                style={{ width: '100%', padding: '1rem', background: 'var(--color-accent-primary)', color: 'black', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <CheckCircle size={20} />
                Mark as Delivered
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button className="btn btn--secondary" style={{ padding: '1rem', background: 'var(--glass-border)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <FileText size={18} /> View Invoice
                </button>
                <button className="btn btn--ghost" style={{ padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-text-primary)', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} /> Resend WhatsApp
                </button>
              </div>
            )}
            
            <button className="btn btn--danger" style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem' }}>
              ❌ Cancel Booking
            </button>
          </div>
          
          <div className="glass-card" style={{ padding: '2rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Activity Timeline</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'var(--glass-border)' }}></div>
              
              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.125rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)' }}></div>
                </div>
                <div>
                  <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, margin: 0 }}>Booking confirmed</p>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Jul 15, 2026 3:25 PM</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.125rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                </div>
                <div>
                  <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, margin: 0 }}>Payment received</p>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Jul 15, 2026 3:25 PM</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.125rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                </div>
                <div>
                  <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, margin: 0 }}>Booking created</p>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Jul 15, 2026 3:24 PM</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{ position: 'relative', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
            >
              <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.25rem', marginBottom: '1rem' }}>Confirm Delivery</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
                Mark this booking as delivered? This will generate an invoice and send it to the customer via WhatsApp.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-text-primary)', borderRadius: '0.5rem', fontWeight: 500, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelivery}
                  style={{ padding: '0.75rem 1.5rem', background: 'var(--color-accent-primary)', border: 'none', color: 'black', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Confirm & Send Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            style={{ position: 'fixed', bottom: '2rem', left: '50%', background: 'var(--color-accent-primary)', color: 'black', padding: '1rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,212,255,0.3)', zIndex: 100 }}
          >
            <CheckCircle size={20} />
            Booking marked as delivered successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
