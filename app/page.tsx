'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Menu, X, Sparkles, Star, Calendar,
  MapPin, Phone, Mail, Clock, ArrowRight, Shield, Check, MessageSquare
} from 'lucide-react';

// Before/After interactive slider component
function BeforeAfterSlider({ before, after, label, beforeFilter }: { before: string; after: string; label: string; beforeFilter?: string }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX, rect);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      handleMove(e.clientX, rect);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-md select-none"
      style={{ width: '100%', aspectRatio: '4/3', cursor: 'ew-resize' }}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* After Image (Background) */}
      <img src={after} alt={`${label} After`} className="w-full h-full object-cover pointer-events-none" />

      {/* Before Image (Overlay clipped) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      >
        <img
          src={before}
          alt={`${label} Before`}
          className="w-full h-full object-cover pointer-events-none"
          style={{ filter: beforeFilter || 'brightness(0.7) contrast(1.1) saturate(0.8)' }}
        />
      </div>

      {/* Labels */}
      <span className="absolute left-4 top-4 bg-black/75 text-white font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-md z-10">BEFORE</span>
      <span className="absolute right-4 top-4 bg-[#E31B23] text-white font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-md z-10">AFTER</span>

      {/* Slider line and knob */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none z-20"
        style={{ left: `${sliderPos}%`, width: '2px', background: 'white', transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-800 font-bold text-sm">
          ↔
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    vehicle: '',
    year: '',
    service: '',
    details: ''
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone || !quoteForm.email) return;

    setQuoteLoading(true);
    setQuoteError('');

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

      if (scriptUrl && !scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
        // CORS workaround: send as text/plain so no preflight is triggered.
        // Google Apps Script reads the raw body via e.postData.contents
        // and parses it as JSON inside doPost().
        const payload = JSON.stringify({
          submittedAt: new Date().toISOString(),
          name:    quoteForm.name,
          phone:   quoteForm.phone,
          email:   quoteForm.email,
          car:     quoteForm.vehicle,
          service: quoteForm.service,
          date:    quoteForm.date,
          message: quoteForm.details,
          pageUrl: window.location.href,
        });

        await fetch(scriptUrl, {
          method:  'POST',
          mode:    'no-cors',          // opaque response — expected with Apps Script
          headers: { 'Content-Type': 'text/plain' },
          body:    payload,
        });
      }

      // Optimistic success (no-cors responses are always opaque — cannot read status)
      setQuoteSubmitted(true);
      setQuoteForm({ name: '', phone: '', email: '', date: '', vehicle: '', year: '', service: '', details: '' });
      setTimeout(() => setQuoteSubmitted(false), 6000);

    } catch {
      setQuoteError('Network error. Please check your connection and try again.');
    } finally {
      setQuoteLoading(false);
    }
  };


  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <main style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* Navigation */}
      <nav className={`nav ${isScrolled ? 'nav--scrolled' : ''}`} style={{ borderBottom: isScrolled ? '1px solid var(--glass-border)' : '1px solid transparent' }}>
        <div className="nav__inner container" style={{ paddingBlock: '0.5rem' }}>
          {/* Logo */}
          <Link href="/" className="nav__logo" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent-primary)', color: 'white', borderRadius: '6px', width: '38px', height: '38px', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
              A
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-accent-secondary)', letterSpacing: '-0.02em' }}>A-SHINE</span>
              <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '0.18em' }}>AUTO VEHICLE DETAILING</span>
            </div>
          </Link>

          {/* Links */}
          <div className="nav__links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="#" className="nav__link">Home</Link>
            <Link href="#services" className="nav__link">Services</Link>
            <Link href="#about" className="nav__link">About Us</Link>
            <Link href="#gallery" className="nav__link">Gallery</Link>
            <Link href="#reviews" className="nav__link">Reviews</Link>
            <Link href="#pricing" className="nav__link">Pricing</Link>
            <Link href="#contact" className="nav__link">Contact</Link>
          </div>

          {/* Call & Button */}
          <div className="nav__actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="tel:5197295856" className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-primary)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)' }}>
                <Phone size={16} />
              </span>
              (519) 729-5856
            </a>
            <a href="#contact" className="btn btn--primary" style={{ display: 'flex', borderRadius: '6px' }}>
              BOOK NOW
            </a>
            <button
              className="nav__mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ padding: '0.25rem', color: 'var(--color-text-primary)' }}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="mobile-menu" style={{ background: 'var(--color-bg-primary)' }}>
              <div className="mobile-menu__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent-primary)', color: 'white', borderRadius: '4px', width: '28px', height: '28px', fontWeight: 900, fontSize: '1.1rem' }}>
                    A
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>A-SHINE</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)' }}><X /></button>
              </div>
              <Link href="#" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="#services" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link href="#about" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link href="#gallery" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
              <Link href="#reviews" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Reviews</Link>
              <Link href="#pricing" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              <Link href="#contact" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingBlock: '1.5rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="tel:5197295856" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <Phone size={18} style={{ color: 'var(--color-accent-primary)' }} /> (519) 729-5856
                </a>
                <a href="#contact" className="btn btn--primary btn--full" onClick={() => setIsMobileMenuOpen(false)}>
                  BOOK NOW
                </a>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        className="section hero-section-bg"
        style={{
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          paddingBlock: '120px var(--space-12)',
          position: 'relative',
          overflow: 'hidden',
          background: '#ffffff'
        }}
      >
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr', gap: '2rem', alignItems: 'center', position: 'relative', zIndex: 2, width: '100%' }}>

          {/* Hero Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: '580px', position: 'relative', zIndex: 10 }}
          >
            <motion.span variants={fadeIn} style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.2em', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', textTransform: 'uppercase' }}>
              <span style={{ width: '20px', height: '2px', background: 'var(--color-accent-primary)' }}></span>
              PREMIUM MOBILE AUTO DETAILING
            </motion.span>

            <motion.h1
              variants={fadeIn}
              style={{ fontSize: 'clamp(2.2rem, 1.8rem + 3.8vw, 4rem)', fontWeight: 900, lineHeight: 1.1, color: 'var(--color-accent-secondary)', letterSpacing: '-0.02em', textTransform: 'none' }}
            >
              Restore the <span style={{ color: 'var(--color-accent-primary)' }}>Shine</span>.<br />
              Protect the Finish.<br />
              Drive with Pride.
            </motion.h1>

            <motion.p variants={fadeIn} style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: '1.6', maxWidth: '550px' }}>
              Experience premium mobile detailing brought directly to your doorstep. From advanced paint correction and durable ceramic coatings to meticulous interior restoration, we bring back that showroom feel on your schedule.
            </motion.p>

            <motion.div variants={fadeIn} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <a href="#contact" className="btn btn--primary btn--lg" style={{ borderRadius: '6px' }}>
                BOOK APPOINTMENT NOW <ArrowRight size={18} />
              </a>
              <a href="#services" className="btn btn--secondary btn--lg" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px' }}>
                VIEW OUR SERVICES
              </a>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              variants={fadeIn}
              style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
            >
              {[
                { icon: <Star fill="currentColor" size={16} />, title: '5.0 Rating', desc: '380+ Verified Reviews', showBorder: true },
                { icon: <Check size={16} />, title: 'Elite Quality', desc: '380+ Detailed Cars', showBorder: true },
                { icon: <MapPin size={16} />, title: '100% Mobile', desc: 'We Come To You', showBorder: true },
                { icon: <Shield size={16} />, title: 'Fully Insured', desc: 'Complete Peace of Mind', showBorder: false }
              ].map((metric, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', paddingRight: metric.showBorder ? '1.5rem' : '0', borderRight: metric.showBorder ? '1px solid #e2e8f0' : 'none' }} className="hero-metric-item">
                  <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.06)', color: 'var(--color-accent-primary)' }}>
                    {metric.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>{metric.title}</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0 }}>{metric.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Right Column (Car & Overlays) */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', minHeight: '400px' }} className="hero-right-col">
            {/* Porsche Image Container */}
            <div style={{ width: '160%', marginLeft: '-45%', marginTop: '-135px', marginBottom: '-75px', zIndex: 1, position: 'relative', overflow: 'hidden' }}>
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                src="/porsche-hero.png"
                alt="Pristine White Porsche 911"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              {/* Edge Blending Gradients to blend borders with white background */}
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '32%', background: 'linear-gradient(to right, #ffffff, transparent)', zIndex: 3 }} />
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '10%', background: 'linear-gradient(to left, #ffffff, transparent)', zIndex: 3 }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #ffffff, transparent)', zIndex: 3 }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70px', background: 'linear-gradient(to top, #ffffff, transparent)', zIndex: 3 }} />
            </div>

            {/* Floating indicator cards on the right of the car */}
            <div className="hero-floating-cards" style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 3, width: '220px' }}>

              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(227, 27, 35, 0.06)', color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                  <Shield size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Ceramic Coating</h4>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Lasts Up To 5 Years</p>
                </div>
              </div>

              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(227, 27, 35, 0.06)', color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Paint Correction</h4>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>99% Swirl Removal</p>
                </div>
              </div>

              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(227, 27, 35, 0.06)', color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                  <Check size={18} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Interior Detailing</h4>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Deep Steam Clean</p>
                </div>
              </div>

            </div>

            {/* Top Rated Badge at bottom right */}
            <div className="hero-top-rated" style={{ position: 'absolute', bottom: '0', right: '0', padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', zIndex: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', minWidth: '160px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-accent-secondary)', letterSpacing: '0.1em' }}>TOP RATED</span>
              <div style={{ display: 'flex', color: 'var(--color-accent-primary)', gap: '2px', marginBlock: '0.1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
              </div>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>Auto Detailing Service</span>
            </div>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section" style={{ background: 'var(--color-bg-secondary)', paddingBlock: 'var(--space-20)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-16)' }}>
            <span className="section-eyebrow" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>OUR SERVICES</span>
            <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase' }}>
              Detailing Solutions For <span style={{ color: 'var(--color-accent-primary)' }}>Every Vehicle</span>
            </h2>
            <p className="section-description" style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'var(--text-base)' }}>
              We use premium products, advanced techniques, and passion for perfection to deliver unmatched results.
            </p>
          </div>

          <motion.div
            className="services-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
          >
            {[
              { img: '/service-exterior.png', icon: '🚿', title: 'Exterior Detailing', desc: 'Hand wash, decontamination, clay bar, and premium wax coating to deliver a showroom shine.' },
              { img: '/service-interior.png', icon: '🧽', title: 'Interior Detailing', desc: 'Deep steam cleaning, sanitation, and premium conditioning for a fresh, brand-new car feel.' },
              { img: '/service-paint.png', icon: '✨', title: 'Paint Correction', desc: 'Remove scratches, swirl marks, oxidation, and restore your paint surface to flawless perfection.' },
              { img: '/service-ceramic.png', icon: '💎', title: 'Ceramic Coating', desc: 'Long-lasting nano-protection with unbelievable hydrophobic properties and showroom mirror gloss.' },
              { img: '/service-wheels.png', icon: '🎡', title: 'Wheel & Tire Detailing', desc: 'Deep clean wheels, remove brake dust, polish calipers, and apply glossy protective dressing.' },
              { img: '/service-engine.png', icon: '👑', title: 'Engine Bay Detailing', desc: 'Professional cleaning and dressing that safely removes grease and dirt, improving engine appearance.' }
            ].map((srv, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="service-card"
                style={{
                  background: 'var(--color-bg-primary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Image top */}
                <div style={{ width: '100%', height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img src={srv.img} alt={srv.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-accent-secondary)', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
                    {srv.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    {srv.desc}
                  </p>
                  <Link
                    href="#contact"
                    className="flex items-center gap-1.5"
                    style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', marginTop: 'auto', textDecoration: 'none' }}
                  >
                    LEARN MORE <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="section" style={{ paddingBlock: 'var(--space-24)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-16)', alignItems: 'center' }}>

          {/* Left Column - Image */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              {/* Main image */}
              <img
                src="/about-detailer.png"
                alt="Detailer buffing a black sports car"
                className="rounded-2xl shadow-xl"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />

              {/* Floating Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  background: 'var(--color-accent-primary)',
                  color: 'white',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '120px'
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>5+</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center', marginTop: '0.25rem' }}>Years of<br />Experience</span>
              </div>
            </div>
          </div>

          {/* Right Column - Text info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', letterSpacing: '0.15em', color: 'var(--color-accent-primary)' }}>
              ABOUT US
            </span>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase', lineHeight: '1.2' }}>
              We Don't Just Detail Cars.<br />We Care For Them Like Our <span style={{ color: 'var(--color-accent-primary)' }}>Own</span>.
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: 'var(--text-base)' }}>
              A-Shine Auto Mobile Detailing was built on a passion for cars and a commitment to exceptional service. We bring showroom-quality detailing to your doorstep with convenience, honesty, and unmatched attention to detail.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBlock: '0.5rem' }}>
              {[
                'Professional & Trained Detailers',
                'Premium Products & Equipment',
                '100% Mobile Service – We Come To You',
                'Satisfaction Guarantee on Every Service'
              ].map((bullet, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)' }}>
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Founder signature block */}
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.8rem', color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>
                James Carter
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.15rem' }}>
                Founder, A-Shine Auto Mobile Detailing
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Our Gallery Section (Before/After) */}
      <section id="gallery" className="section" style={{ background: 'var(--color-bg-secondary)', paddingBlock: 'var(--space-20)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-16)' }}>
            <span className="section-eyebrow" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>OUR GALLERY</span>
            <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase' }}>
              Real Transformations. <span style={{ color: 'var(--color-accent-primary)' }}>Real Results</span>.
            </h2>
            <p className="section-description" style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'var(--text-base)' }}>
              Drag the slider to see how our premium detailing processes restore and protect your vehicle.
            </p>
          </div>

          {/* Before/After Sliders Grid */}
          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {[
              { before: '/service-exterior.png', after: '/service-exterior.png', beforeFilter: 'brightness(0.65) contrast(0.9) saturate(0.75) blur(1px)', label: 'Exterior Detailing' },
              { before: '/service-interior.png', after: '/service-interior.png', beforeFilter: 'brightness(0.6) saturate(0.6) blur(0.5px)', label: 'Interior Detailing' },
              { before: '/service-paint.png', after: '/service-paint.png', beforeFilter: 'brightness(0.85) contrast(0.8) grayscale(0.2) saturate(0.8)', label: 'Paint Correction' },
              { before: '/service-wheels.png', after: '/service-wheels.png', beforeFilter: 'brightness(0.55) grayscale(0.35)', label: 'Wheel & Tire Detailing' }
            ].map((slide, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <BeforeAfterSlider
                  before={slide.before}
                  after={slide.after}
                  label={slide.label}
                  beforeFilter={slide.beforeFilter}
                />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-accent-secondary)', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {slide.label}
                </h4>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <Link href="#contact" className="btn btn--secondary btn--lg" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px' }}>
              VIEW MORE RESULTS →
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="section" style={{ paddingBlock: 'var(--space-20)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-16)' }}>
            <span className="section-eyebrow" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>CUSTOMER REVIEWS</span>
            <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase' }}>
              See What Our <span style={{ color: 'var(--color-accent-primary)' }}>Clients Say</span>
            </h2>
          </div>

          <div className="marquee-container" style={{ paddingBlock: '1rem', marginTop: '1rem' }}>
            <div className="marquee-track">
              {/* Set 1 */}
              {[
                { text: 'Amazing service! My car looks better than the day I bought it. The team was professional, on time, and super friendly.', name: 'Michael T.', car: 'BMW 330i' },
                { text: 'They came to my office and detailed my car in the parking lot. Super convenient and the results were absolutely worth it!', name: 'Sarah K.', car: 'Audi Q5' },
                { text: 'The ceramic coating is incredible. Water just beads right off and the shine is next level. Highly recommended!', name: 'David R.', car: 'Porsche 911' },
                { text: 'Best detailing service in town. Honest pricing, great communication, and my truck looks brand new inside and out.', name: 'Jason L.', car: 'Chevrolet Silverado' },
                { text: 'Ive tried many detailers but A-Shine is on another level. Attention to detail is unmatched. Will be coming back!', name: 'Emily P.', car: 'Tesla Model 3' }
              ].map((review, i) => (
                <div key={`set1-${i}`} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '14px', boxShadow: 'var(--shadow-sm)', width: '320px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', color: 'var(--color-accent-primary)', gap: '2px' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={15} fill="currentColor" />)}
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    "{review.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {review.name.split(' ')[0][0]}{review.name.split(' ')[1]?.[0] || ''}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>{review.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{review.car}</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Set 2 (Duplicate for loop continuity) */}
              {[
                { text: 'Amazing service! My car looks better than the day I bought it. The team was professional, on time, and super friendly.', name: 'Michael T.', car: 'BMW 330i' },
                { text: 'They came to my office and detailed my car in the parking lot. Super convenient and the results were absolutely worth it!', name: 'Sarah K.', car: 'Audi Q5' },
                { text: 'The ceramic coating is incredible. Water just beads right off and the shine is next level. Highly recommended!', name: 'David R.', car: 'Porsche 911' },
                { text: 'Best detailing service in town. Honest pricing, great communication, and my truck looks brand new inside and out.', name: 'Jason L.', car: 'Chevrolet Silverado' },
                { text: 'Ive tried many detailers but A-Shine is on another level. Attention to detail is unmatched. Will be coming back!', name: 'Emily P.', car: 'Tesla Model 3' }
              ].map((review, i) => (
                <div key={`set2-${i}`} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '14px', boxShadow: 'var(--shadow-sm)', width: '320px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', color: 'var(--color-accent-primary)', gap: '2px' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={15} fill="currentColor" />)}
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    "{review.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {review.name.split(' ')[0][0]}{review.name.split(' ')[1]?.[0] || ''}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>{review.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{review.car}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section" style={{ background: 'var(--color-bg-secondary)', paddingBlock: 'var(--space-20)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-16)' }}>
            <span className="section-eyebrow" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>PRICING</span>
            <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase' }}>
              Choose the <span style={{ color: 'var(--color-accent-primary)' }}>Perfect Package</span>
            </h2>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>

            {/* Basic Detail */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BASIC DETAIL</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBlock: '0.5rem 1rem', height: '36px' }}>Essential care for a clean, fresh ride.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$149</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>STARTING AT</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                {['Exterior Hand Wash', 'Interior Vacuuming', 'Dashboard & Console Wipe', 'Window Cleaning'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--color-accent-primary)' }} strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', marginTop: 'auto' }}>
                BOOK NOW →
              </Link>
            </div>

            {/* Premium Detail */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PREMIUM DETAIL</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBlock: '0.5rem 1rem', height: '36px' }}>Our most popular full service package.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$249</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>STARTING AT</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Everything in Basic, Plus:</span>
                {['Clay Bar Treatment', 'Interior Deep Cleaning', 'Leather Conditioning', 'Door Jambs & Trunk Cleaned', 'High Gloss Tire Dressing'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--color-accent-primary)' }} strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', marginTop: 'auto' }}>
                BOOK NOW →
              </Link>
            </div>

            {/* Signature Detail (Featured) */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'var(--color-bg-primary)', border: '2px solid var(--color-accent-primary)', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent-primary)', color: 'white', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                MOST POPULAR
              </div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SIGNATURE DETAIL</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBlock: '0.5rem 1rem', height: '36px' }}>The ultimate inside & out transformation.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$399</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>STARTING AT</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Everything in Premium, Plus:</span>
                {['1-Step Paint Correction (Light)', 'One-Stop Polish', 'Premium Wax Protection', 'Engine Bay Cleaning', 'Interior Steam Cleaning', 'Odor Elimination Treatment'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--color-accent-primary)' }} strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="#contact" className="btn btn--primary btn--full" style={{ borderRadius: '6px', marginTop: 'auto' }}>
                BOOK NOW →
              </Link>
            </div>

            {/* Ceramic Coating */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CERAMIC COATING</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBlock: '0.5rem 1rem', height: '36px' }}>Long-lasting protection for your vehicle.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$699</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>STARTING AT</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Everything in Signature, Plus:</span>
                {['2-Step Paint Correction', 'Professional Ceramic Coating', '9H Hardness Finish', 'Hydrophobic Finish', 'Up to 5 Years Protection'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--color-accent-primary)' }} strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', marginTop: 'auto' }}>
                BOOK NOW →
              </Link>
            </div>

          </div>

          {/* Trust Mappings Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--glass-border)', marginTop: '4rem', paddingTop: '2rem' }}>
            {[
              { icon: '🚗', title: '100% Mobile Service', desc: 'We come to you - home, office, or anywhere.' },
              { icon: '🛡️', title: 'Licensed & Insured', desc: 'Fully insured for your peace of mind.' },
              { icon: '⭐', title: 'Premium Products', desc: 'Industry-leading products for the best results.' },
              { icon: '🕒', title: 'On-Time & Reliable', desc: 'We respect your time and always deliver.' },
              { icon: '🤝', title: 'Satisfaction Guarantee', desc: 'Not happy? We\'ll make it right. That\'s our promise.' }
            ].map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flex: '1 1 200px' }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{pt.icon}</span>
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>{pt.title}</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.15rem' }}>{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Contact & Free Quote Section */}
      <section id="contact" className="section" style={{ paddingBlock: 'var(--space-24)', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-16)', alignItems: 'start' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', letterSpacing: '0.15em', color: 'var(--color-accent-primary)' }}>
              GET IN TOUCH
            </span>
            <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
              We're Here<br />To Help
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: '1.6', margin: 0 }}>
              Have questions or ready to book your detailing service? Reach out to us today – we're just a call or message away!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CALL US</span>
                  <a href="tel:5197295856" style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                    (519) 729-5856
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.08)', color: '#16a34a' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>WHATSAPP US</span>
                  <a href="https://wa.me/15197295856" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                    (519) 729-5856
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EMAIL US</span>
                  <a href="mailto:info@ashinedetailing.com" style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                    info@ashinedetailing.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SERVICE AREA</span>
                  <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    54 Woodbine Avenue, Kitchener, Ont N2R 1V1
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Free Quote Form */}
          <div style={{ position: 'relative' }}>
            <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 2 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem', margin: 0 }}>
                Get a Free Quote
              </h3>

              <AnimatePresence mode="wait">
                {quoteSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', paddingBlock: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={28} strokeWidth={3} />
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Quote Request Sent!</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      Thank you! We have received your request and our detailing team will get back to you with a custom quote within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div className="input-group">
                        <label className="input-label input-label--required">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          className="input-field"
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label input-label--required">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="(555) 000-0000"
                          className="input-field"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div className="input-group">
                        <label className="input-label input-label--required">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          className="input-field"
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Preferred Date</label>
                        <input
                          type="date"
                          className="input-field"
                          value={quoteForm.date}
                          onChange={(e) => setQuoteForm({ ...quoteForm, date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div className="input-group">
                        <label className="input-label">Vehicle Make & Model</label>
                        <input
                          type="text"
                          placeholder="e.g. Tesla Model 3"
                          className="input-field"
                          value={quoteForm.vehicle}
                          onChange={(e) => setQuoteForm({ ...quoteForm, vehicle: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Year</label>
                        <input
                          type="number"
                          placeholder="e.g. 2023"
                          className="input-field"
                          value={quoteForm.year}
                          onChange={(e) => setQuoteForm({ ...quoteForm, year: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Service Needed</label>
                      <select
                        className="input-field"
                        style={{ appearance: 'none', background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23475569\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E") no-repeat right 1rem center / 1.2rem', paddingRight: '2.5rem' }}
                        value={quoteForm.service}
                        onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                      >
                        <option value="">Select a package...</option>
                        <option value="basic">Basic Detail ($149+)</option>
                        <option value="premium">Premium Detail ($249+)</option>
                        <option value="signature">Signature Detail ($399+)</option>
                        <option value="ceramic">Ceramic Coating ($699+)</option>
                        <option value="other">Other / Custom Details</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Additional Details (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us more about your vehicle type, condition, or specific requests..."
                        className="input-field"
                        style={{ resize: 'vertical' }}
                        value={quoteForm.details}
                        onChange={(e) => setQuoteForm({ ...quoteForm, details: e.target.value })}
                      />
                    </div>

                    {/* Error message */}
                    {quoteError && (
                      <div style={{ background: 'rgba(220, 38, 38, 0.06)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚠️</span> {quoteError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn--primary btn--lg"
                      disabled={quoteLoading}
                      style={{ borderRadius: '6px', marginTop: '0.5rem', opacity: quoteLoading ? 0.75 : 1, cursor: quoteLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {quoteLoading ? (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          SENDING…
                        </>
                      ) : (
                        'GET MY QUOTE →'
                      )}
                    </button>

                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', display: 'block', marginTop: '0.25rem' }}>
                      🔒 We respect your privacy. Your information is safe with us.
                    </span>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ background: '#0a0f1d', borderTop: '1px solid rgba(255,255,255,0.06)', paddingBlock: 'var(--space-20) var(--space-8)', color: '#94a3b8' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>

          {/* Column 1 - Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent-primary)', color: 'white', borderRadius: '4px', width: '32px', height: '32px', fontWeight: 900, fontSize: '1.2rem' }}>
                A
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>A-SHINE</span>
                <span style={{ fontSize: '0.45rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.15em' }}>AUTO VEHICLE DETAILING</span>
              </div>
            </Link>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
              Premium mobile auto detailing services. We bring showroom quality right to your doorstep, with unmatched focus and care.
            </p>
            {/* Social handles mockup */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              {['facebook', 'instagram', 'youtube'].map((social) => (
                <span key={social} style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', cursor: 'pointer', textTransform: 'capitalize' }}>
                  {social}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0, margin: 0 }}>
              <li><Link href="#" style={{ color: '#64748b', fontSize: '0.85rem' }}>Home</Link></li>
              <li><a href="#services" style={{ color: '#64748b', fontSize: '0.85rem' }}>Services</a></li>
              <li><a href="#about" style={{ color: '#64748b', fontSize: '0.85rem' }}>About Us</a></li>
              <li><a href="#gallery" style={{ color: '#64748b', fontSize: '0.85rem' }}>Gallery</a></li>
              <li><a href="#reviews" style={{ color: '#64748b', fontSize: '0.85rem' }}>Reviews</a></li>
              <li><a href="#pricing" style={{ color: '#64748b', fontSize: '0.85rem' }}>Pricing</a></li>
              <li><a href="#contact" style={{ color: '#64748b', fontSize: '0.85rem' }}>Contact</a></li>
            </ul>
          </div>

          {/* Column 3 - Services links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0, margin: 0 }}>
              <li><Link href="#contact" style={{ color: '#64748b', fontSize: '0.85rem' }}>Exterior Detailing</Link></li>
              <li><Link href="#contact" style={{ color: '#64748b', fontSize: '0.85rem' }}>Interior Detailing</Link></li>
              <li><Link href="#contact" style={{ color: '#64748b', fontSize: '0.85rem' }}>Paint Correction</Link></li>
              <li><Link href="#contact" style={{ color: '#64748b', fontSize: '0.85rem' }}>Ceramic Coating</Link></li>
              <li><Link href="#contact" style={{ color: '#64748b', fontSize: '0.85rem' }}>Wheel & Tire Detailing</Link></li>
              <li><Link href="#contact" style={{ color: '#64748b', fontSize: '0.85rem' }}>Engine Bay Detailing</Link></li>
            </ul>
          </div>

          {/* Column 4 - Hours & CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Monday - Friday: 8:00 AM - 8:00 PM</span>
              <span>Saturday: 9:00 AM - 6:00 PM</span>
              <span>Sunday: 10:00 AM - 4:00 PM</span>
            </div>
            <a href="#contact" className="btn btn--primary" style={{ borderRadius: '6px', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
              BOOK NOW →
            </a>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '3rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            © 2026 A-SHINE Auto Vehicle Detailing. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748b', cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ color: '#64748b', cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons for Quick Contact */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 9999 }} className="floating-contact-buttons">
        {/* WhatsApp Us Button */}
        <a 
          href="https://wa.me/15197295856" 
          target="_blank" 
          rel="noopener noreferrer" 
          title="WhatsApp Us"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '52px', 
            height: '52px', 
            borderRadius: '50%', 
            background: '#25D366', 
            color: '#ffffff', 
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)', 
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.4)';
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.885-6.948C16.536 2.008 14.09 1.01 11.482 1.01 6.047 1.01 1.62 5.382 1.617 10.81c-.001 1.682.449 3.323 1.302 4.758l-.99 3.613 3.71-.973zm12.355-6.643c-.326-.162-1.924-.949-2.222-1.057-.297-.108-.513-.162-.73.162-.217.324-.838 1.056-1.027 1.272-.19.217-.378.244-.704.082-.326-.162-1.378-.508-2.625-1.623-.97-.866-1.625-1.937-1.815-2.262-.19-.325-.02-.501.143-.662.147-.146.326-.38.489-.57.162-.191.217-.325.326-.541.109-.217.054-.407-.027-.57-.081-.162-.73-1.758-1.002-2.407-.265-.637-.534-.55-.73-.56-.189-.01-.406-.01-.622-.01-.217 0-.569.082-.867.407-.298.324-1.137 1.112-1.137 2.71 0 1.599 1.163 3.14 1.326 3.356.163.217 2.288 3.494 5.542 4.896.774.333 1.379.533 1.851.683.778.247 1.487.213 2.047.129.624-.093 1.924-.787 2.196-1.547.271-.76.271-1.41.19-1.547-.081-.136-.298-.218-.624-.38z"/>
          </svg>
        </a>

        {/* Call Us Button */}
        <a 
          href="tel:5197295856" 
          title="Call Us"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '52px', 
            height: '52px', 
            borderRadius: '50%', 
            background: '#E31B23', 
            color: '#ffffff', 
            boxShadow: '0 4px 14px rgba(227, 27, 35, 0.4)', 
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(227, 27, 35, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(227, 27, 35, 0.4)';
          }}
        >
          <Phone size={22} fill="currentColor" />
        </a>
      </div>
    </main>
  );
}
