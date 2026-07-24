'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, Hash, Check, Clock, Download, ArrowLeft, Sparkles, Loader2, ArrowRight, X, Menu } from 'lucide-react';
import Link from 'next/link';

export default function TrackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    phone: ''
  });
  const [errors, setErrors] = useState({ code: '', phone: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { code: '', phone: '' };

    if (!formData.code.trim()) {
      newErrors.code = 'Booking code is required';
      valid = false;
    } else if (!/^ASH-[A-Z0-9]{4}$/i.test(formData.code.trim())) {
      newErrors.code = 'Invalid format (e.g. ASH-A1B2)';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  return (
    <main className="tracker-page min-h-screen bg-[var(--background)] flex flex-col items-center pt-24 pb-12 px-4">
      {/* Simplified Nav */}
      <nav className="fixed top-0 left-0 right-0 py-4 px-6 flex justify-between items-center max-w-6xl mx-auto z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', flexShrink: 0 }}>
            <img src="/a-logosvgmaker-editor.svg" alt="A-Shine Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-accent-secondary)', letterSpacing: '-0.02em' }}>A-SHINE</span>
        </Link>
        <Link href="/#contact" className="btn btn--primary text-sm px-6 py-2">
          Book Now
        </Link>
      </nav>

      <div className="w-full max-w-lg mt-12">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 heading-font mb-4">Track Your Booking</h1>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            Enter your booking code and phone number to check your appointment status
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              className="tracker-card glass-card p-8 rounded-2xl border border-[var(--border-color)] relative overflow-hidden shadow-lg bg-white"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)]"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Hash size={16} className="text-[var(--primary)]" />
                    Booking Code
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. ASH-A1B2"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all uppercase placeholder:normal-case"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    />
                    {errors.code && <p className="text-red-600 text-xs mt-1 absolute -bottom-5">{errors.code}</p>}
                  </div>
                </div>

                <div className="space-y-2 pb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-[var(--primary)]" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      placeholder="+1 (xxx) xxx-xxxx"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    {errors.phone && <p className="text-red-600 text-xs mt-1 absolute -bottom-5">{errors.phone}</p>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn--primary w-full py-3 flex items-center justify-center gap-2 group relative overflow-hidden"
                  style={{ borderRadius: '6px' }}
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Search size={20} className="group-hover:scale-110 transition-transform" />
                      Track Booking
                    </>
                  )}
                  
                  {/* Button shine effect */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              className="tracker-card glass-card rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-lg bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Booking Status</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900 font-mono">{formData.code || 'ASH-A1B2'}</h2>
                    <span className="bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                      <Sparkles size={12} /> In Progress
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Service</p>
                    <p className="text-sm text-gray-900 font-bold">Full Detail Package</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Vehicle</p>
                    <p className="text-sm text-gray-900 font-bold">SUV (Tesla Model Y)</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 col-span-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Appointment Time</p>
                      <p className="text-sm text-gray-900 font-bold">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})} at 10:00 AM</p>
                    </div>
                  </div>
                </div>

                <div className="tracker-status space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--primary)] before:via-[var(--primary)] before:to-slate-200 pt-2 pb-2">
                  
                  {/* Step 1: Confirmed */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_15px_rgba(227,27,35,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Booking Confirmed</h4>
                      <p className="text-xs text-[var(--text-muted)]">Your appointment has been scheduled.</p>
                    </div>
                  </div>

                  {/* Step 2: Payment */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_15px_rgba(227,27,35,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Payment Received</h4>
                      <p className="text-xs text-[var(--text-muted)]">Initial deposit processed successfully.</p>
                    </div>
                  </div>

                  {/* Step 3: In Progress */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--secondary)] bg-white text-[var(--secondary)] shadow-[0_0_15px_rgba(15,23,42,0.15)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-3 h-3 bg-[var(--secondary)] rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--secondary)]/20 bg-[var(--secondary)]/5 relative overflow-hidden">
                      <h4 className="font-bold text-[var(--secondary)] text-sm mb-1">In Progress</h4>
                      <p className="text-xs text-[var(--text-muted)]">Detailing team has arrived and started work.</p>
                    </div>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-50 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <h4 className="font-bold text-slate-400 text-sm mb-1">Completed</h4>
                      <p className="text-xs text-slate-400">Service finished and vehicle is ready.</p>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <button onClick={() => { setIsSuccess(false); setFormData({code: '', phone: ''}); }} className="btn btn--secondary w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center gap-2 group" style={{ borderRadius: '6px' }}>
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Look Up Another Booking
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
