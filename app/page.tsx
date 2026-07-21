'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Menu, X, Sparkles, Star, Calendar, ChevronLeft, ChevronRight,
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
    vehicle: '',
    service: '',
    details: ''
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [activePriceIdx, setActivePriceIdx] = useState(1);

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
      setQuoteForm({ name: '', phone: '', email: '', vehicle: '', service: '', details: '' });
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
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '0.15em' }}>AUTO VEHICLE DETAILING</span>
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
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.85rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <a href="tel:5197295856" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-accent-primary)', textDecoration: 'none' }}>
                  <Phone size={16} /> (519) 729-5856
                </a>
                <a href="#contact" className="btn btn--primary btn--full" style={{ borderRadius: '8px', paddingBlock: '0.75rem', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setIsMobileMenuOpen(false)}>
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
              className="hero-title"
              style={{ fontSize: 'clamp(2rem, 1.6rem + 3vw, 3.8rem)', fontWeight: 900, lineHeight: 1.15, color: 'var(--color-accent-secondary)', letterSpacing: '-0.02em', textTransform: 'none' }}
            >
              Restore the <span style={{ color: 'var(--color-accent-primary)' }}>Shine</span>.<br />
              Protect the Finish.<br />
              Drive with Pride.
            </motion.h1>

            <motion.p variants={fadeIn} className="hero-description" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: '1.6', maxWidth: '550px' }}>
              Experience premium mobile auto detailing brought directly to your doorstep. Specializing strictly in complete interior deep shampooing and high-gloss tire & wheel cleaning to bring back that spotless showroom feeling.
            </motion.p>

            <motion.div variants={fadeIn} className="hero-cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <a href="#contact" className="btn btn--primary btn--lg" style={{ borderRadius: '8px' }}>
                BOOK APPOINTMENT NOW <ArrowRight size={18} />
              </a>
              <a href="#services" className="btn btn--secondary btn--lg" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '8px' }}>
                VIEW OUR SERVICES
              </a>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              variants={fadeIn}
              className="hero-metrics-container"
              style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
            >
              {[
                { icon: <Star fill="currentColor" size={16} />, title: '5.0 Rating', desc: 'Verified Customer Reviews', showBorder: true },
                { icon: <Check size={16} />, title: 'Elite Quality', desc: 'Deep Interior Clean', showBorder: true },
                { icon: <MapPin size={16} />, title: '100% Mobile', desc: 'We Come To You', showBorder: true },
                { icon: <Shield size={16} />, title: 'Fully Insured', desc: 'Complete Peace of Mind', showBorder: false }
              ].map((metric, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', paddingRight: metric.showBorder ? '1.5rem' : '0', borderRight: metric.showBorder ? '1px solid #e2e8f0' : 'none' }} className="hero-metric-item">
                  <div className="hero-metric-icon-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', flexShrink: 0, borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)' }}>
                    {metric.icon}
                  </div>
                  <div className="hero-metric-text">
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
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Interior Shampoo</h4>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Seats, Carpets & Trunk</p>
                </div>
              </div>

              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(227, 27, 35, 0.06)', color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                  <Shield size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Tire & Rim Detailing</h4>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>High Gloss Protection</p>
                </div>
              </div>

              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(227, 27, 35, 0.06)', color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                  <Check size={18} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Salt & Stain Removal</h4>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Deep Steam Cleansing</p>
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
      <section id="services" className="section" style={{ background: 'var(--color-bg-secondary)', paddingBlock: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <span className="section-eyebrow" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>SPECIALIZED SERVICES</span>
            <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase' }}>
              Complete Interior <span style={{ color: 'var(--color-accent-primary)' }}>& Tire Detailing</span>
            </h2>
            <p className="section-description" style={{ color: 'var(--color-text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: 'var(--text-base)' }}>
              We specialize exclusively in deep interior shampooing, steam sanitization, winter salt extraction, food spill cleanup, and high-gloss tire care.
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
              { img: '/service-ai-interior.png', icon: '🧽', title: 'Full Interior Shampooing', desc: 'Deep shampooing and stain extraction for cloth & leather seats, carpets, dashboard, vents, console, door jambs, and trunk.', pos: 'center 45%' },
              { img: '/service-ai-steam.png', icon: '🧼', title: 'Steam Cleansing & Salt Removal', desc: 'High-temperature steam cleansing that dissolves embedded winter salt, grime, bacteria, and stubborn floor mat stains.', pos: 'center 50%' },
              { img: '/service-ai-stain.png', icon: '✨', title: 'Seat Stain & Spill Extraction', desc: 'Specialized hot-water extraction and conditioning for accidental food, drink, or pet spills on seats and carpets.', pos: 'center 50%' },
              { img: '/service-ai-tire.png', icon: '🛞', title: 'Tire & Rim Deep Cleaning', desc: 'Thorough rim brake dust removal, wheel well scrub, and long-lasting UV-protective high-gloss tire dressing.', pos: 'center 45%' },
              { img: '/service-ai-truck.png', icon: '🚛', title: 'Truck & Commercial Cabs', desc: 'Professional mobile interior detailing for semi-trucks, dump trucks, loaders, and commercial vehicle cabs.', pos: 'center 45%' },
              { img: '/service-ai-mobile.png', icon: '🏠', title: 'Mobile or Studio Drop-off', desc: 'We bring our full mobile unit directly to your driveway, or you can drop off your vehicle at our home studio.', pos: 'center 50%' }
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
                <div className="service-card-img-wrap" style={{ width: '100%', height: '240px', position: 'relative', overflow: 'hidden', background: '#0a0d14' }}>
                  <img
                    src={srv.img}
                    alt={srv.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: srv.pos, display: 'block' }}
                    className="transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="service-card-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <h3 className="service-card-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-accent-secondary)', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
                    {srv.title}
                  </h3>
                  <p className="service-card-desc" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    {srv.desc}
                  </p>
                  <Link
                    href="#contact"
                    className="flex items-center gap-1.5 service-card-link"
                    style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', marginTop: 'auto', textDecoration: 'none' }}
                  >
                    BOOK THIS SERVICE <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="section" style={{ paddingBlock: '4.5rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-16)', alignItems: 'center' }}>

          {/* Left Column - Image */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              {/* Main image */}
              <img
                src="/service-ai-interior.png"
                alt="Professional AI generated interior car detailing"
                className="rounded-2xl shadow-xl"
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '16px' }}
              />

              {/* Floating Badge */}
              <div
                className="about-experience-badge"
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
              A-Shine Auto Mobile Detailing is operated by Kulwant Sandhi with a deep passion for auto detailing. Specializing exclusively in complete interior shampooing, winter salt extraction, food spill cleanup, and tire/wheel detailing — delivering spotless, showroom-level care with honest pricing.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBlock: '0.5rem' }}>
              {[
                'Professional & Passionate Detailer (Kulwant Sandhi)',
                'Deep Steam Shampooing & Winter Salt Extraction',
                'Mobile Service (We Come To You) or Home Studio Drop-off',
                '100% Satisfaction Guarantee on Every Job'
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
                Kulwant Sandhi
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.15rem' }}>
                Owner & Lead Detailer, A-Shine Auto Mobile Detailing
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Our Gallery Section */}
      <section id="gallery" className="section" style={{ background: 'var(--color-bg-secondary)', paddingBlock: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <span className="section-eyebrow" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>OUR GALLERY</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.5rem)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase' }}>
              Real Transformations. <span style={{ color: 'var(--color-accent-primary)' }}>Real Results</span>.
            </h2>
            <p className="section-description" style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'var(--text-base)' }}>
              From everyday cars to heavy-duty trucks and equipment — we detail every vehicle to perfection.
            </p>
          </div>
        </div>

        {/* Full-bleed scrolling gallery */}
        <div className="marquee-container gallery-marquee-container" style={{ paddingBlock: '1rem', marginTop: '0.5rem' }}>
          <div className="gallery-marquee-track">
            {/* Set 1 */}
            {[
              { src: '/gallery-toyota-4runner.jpg', label: 'Interior & Exterior Detail' },
              { src: '/gallery-mack-truck.jpg', label: 'Commercial Dump Truck Detail' },
              { src: '/gallery-freightliner.jpg', label: 'Semi Truck Interior Detail' },
              { src: '/gallery-gehl-loader.jpg', label: 'Heavy Equipment Cab Detail' },
              { src: '/gallery-toyota-highlander.jpg', label: 'Full Interior Detailing' },
            ].map((item, i) => (
              <div
                key={`g1-${i}`}
                className="gallery-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-sm)',
                  background: '#111',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="gallery-card-img" style={{ overflow: 'hidden', background: '#111' }}>
                  <img
                    src={item.src}
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '0.9rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#f1f1f1', letterSpacing: '0.02em' }}>{item.label}</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '0.35rem' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="currentColor" style={{ color: 'var(--color-accent-primary)' }} />)}
                  </div>
                </div>
              </div>
            ))}
            {/* Set 2 — duplicate for seamless loop */}
            {[
              { src: '/gallery-toyota-4runner.jpg', label: 'Interior & Exterior Detail' },
              { src: '/gallery-mack-truck.jpg', label: 'Commercial Dump Truck Detail' },
              { src: '/gallery-freightliner.jpg', label: 'Semi Truck Interior Detail' },
              { src: '/gallery-gehl-loader.jpg', label: 'Heavy Equipment Cab Detail' },
              { src: '/gallery-toyota-highlander.jpg', label: 'Full Interior Detailing' },
            ].map((item, i) => (
              <div
                key={`g2-${i}`}
                className="gallery-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-sm)',
                  background: '#111',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="gallery-card-img" style={{ overflow: 'hidden', background: '#111' }}>
                  <img
                    src={item.src}
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '0.9rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#f1f1f1', letterSpacing: '0.02em' }}>{item.label}</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '0.35rem' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="currentColor" style={{ color: 'var(--color-accent-primary)' }} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Right to Left */}
        <div className="marquee-container gallery-marquee-container" style={{ paddingBlock: '0', marginTop: '1.5rem' }}>
          <div className="gallery-marquee-track-rtl">
            {/* Set 1 */}
            {[
              { src: '/gallery-hyundai-elantra.png', label: 'Interior Shampoo & Detail' },
              { src: '/gallery-audi-interior.png',   label: 'Interior Deep Clean' },
              { src: '/gallery-audi-q5.jpg',         label: 'Full Interior & Exterior' },
              { src: '/gallery-tesla-modelx.jpg',    label: 'Full Vehicle Detailing' },
              { src: '/gallery-mercedes-engine.jpg', label: 'Interior & Rim Detailing' },
            ].map((item, i) => (
              <div
                key={`r1-${i}`}
                className="gallery-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-sm)',
                  background: '#111',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="gallery-card-img" style={{ overflow: 'hidden', background: '#111' }}>
                  <img
                    src={item.src}
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '0.9rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#f1f1f1', letterSpacing: '0.02em' }}>{item.label}</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '0.35rem' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="currentColor" style={{ color: 'var(--color-accent-primary)' }} />)}
                  </div>
                </div>
              </div>
            ))}
            {/* Set 2 — duplicate for seamless loop */}
            {[
              { src: '/gallery-hyundai-elantra.png', label: 'Interior Shampoo & Detail' },
              { src: '/gallery-audi-interior.png',   label: 'Interior Deep Clean' },
              { src: '/gallery-audi-q5.jpg',         label: 'Full Interior & Exterior' },
              { src: '/gallery-tesla-modelx.jpg',    label: 'Full Vehicle Detailing' },
              { src: '/gallery-mercedes-engine.jpg', label: 'Interior & Rim Detailing' },
            ].map((item, i) => (
              <div
                key={`r2-${i}`}
                className="gallery-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-sm)',
                  background: '#111',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="gallery-card-img" style={{ overflow: 'hidden', background: '#111' }}>
                  <img
                    src={item.src}
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '0.9rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#f1f1f1', letterSpacing: '0.02em' }}>{item.label}</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '0.35rem' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="currentColor" style={{ color: 'var(--color-accent-primary)' }} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="section" style={{ paddingBlock: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <span className="section-eyebrow" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>CUSTOMER REVIEWS</span>
            <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase' }}>
              See What Our <span style={{ color: 'var(--color-accent-primary)' }}>Clients Say</span>
            </h2>
          </div>

          <div className="marquee-container" style={{ paddingBlock: '1rem', marginTop: '1rem' }}>
            <div className="marquee-track">
              {/* Set 1 */}
              {[
                { text: 'I recently got interior detailing done here and I\'m extremely satisfied with the results. They did a deep and thorough cleaning—seats, carpets, dashboard, and even the smallest corners were spotless. My car looks and smells like new again.', name: 'Ajay Navadiya', time: '3 months ago' },
                { text: 'Spotless Cleaning by Kulwant. He is amazing and very professional in what he does. No complaints.', name: 'Palash Mardhekar', time: '2 months ago' },
                { text: 'I had an excellent experience and couldn\'t be happier with the results. From the moment I arrived, he was friendly, welcoming, and genuinely passionate about what he does. He took the time to explain the entire detailing process.', name: 'Saiel Tivatane', time: '2 weeks ago' },
                { text: 'Great experience. I got my model Y detailing done. I recommend dropping off vehicle to his home so even if he misses a spot you can ask him to clean when you\'re picking up your vehicle.', name: 'Gaurang Patel', time: 'a month ago' },
                { text: 'I recently had my vehicle detailed for the first time, and it was an excellent experience from start to finish. Everything was clearly explained beforehand, so I knew exactly what to expect, and he was very professional, friendly, and thorough.', name: 'Katalina Avila', time: '2 weeks ago' },
                { text: 'I had an excellent experience with this auto detailer. The attention to detail was outstanding — my car looks brand new inside and out. Every surface was thoroughly cleaned, polished, and restored to a high standard.', name: 'Peter Godspower', time: '3 months ago' },
                { text: 'Very great experience. My car was thoroughly cleaned and shining like new. Excellent communication. Did engine bay detailing as well and its amazing. I brought new car mats and he installed it for free! Very satisfied with service.', name: 'Apoorv B. Chavda', time: '3 months ago' },
                { text: 'Phenomenal Experience with A-Shine Auto Mobile Detailing! I don\'t normally write reviews, but the incredible service I received here completely earned it.', name: 'Harjeet Singh', time: 'a month ago' },
                { text: 'Absolutely amazing service! My Toyota Sienna looks brand new inside and out. The attention to detail was incredible — every surface was spotless, the carpets looked refreshed, and they even got rid of all the little crumbs and marks.', name: 'Aya-xox', time: 'a month ago' },
                { text: 'Got my suv cleaned fully inside for the first time from A-Shine and very satisfied with the steam cleansing, shampooing and polishing. Very pleased to see the winter salt completely removed.', name: 'Nha TamThu', time: '2 weeks ago' },
                { text: 'I\'ve been coming to A Shine Automobile Detailing regularly, and Kulwant ji always does an amazing job. I recently had the inside of my car detailed again, and it came back looking spotless and fresh. The attention to detail is excellent.', name: 'Pankaj Bains', time: '2 months ago' },
                { text: 'Called last-minute and still received quick and efficient service. For a very reasonable price my car received an amazing cleaning job and looks brand new again. I will be back and definitely would recommend this business. Thank you again!', name: 'Jessica Chan', time: 'a month ago' },
                { text: 'I highly recommend this place for car detailing. Yesterday night food was spilled at the back seat and in trunk of my brand new Elantra, I called him in the morning and inspite of busy schedule he gave me service. Amazing!', name: 'Shanil Gosavi', time: 'a year ago' },
                { text: 'We had the pleasure of A-Shine out to detail our pick up truck. Communication was quick and it was easy to book. We can\'t believe how clean it came out. There was job site dirt, salt stains, dog hair, kids grime - completely cleaned it all. Absolutely recommend.', name: 'Andrea Bradley', time: '2 weeks ago' },
                { text: 'Kulwant is very professional! He always goes the extra mile to make his work more appealing. Very seasonal price for superior work. I wish him all the best!', name: 'Gration Fernando', time: '3 weeks ago' },
              ].map((review, i) => (
                <div key={`set1-${i}`} className="glass-card review-card" style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', color: 'var(--color-accent-primary)', gap: '2px' }}>
                      {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', background: 'rgba(22, 163, 74, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(22, 163, 74, 0.2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Google Review
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '0.85rem' }}>
                    <div style={{ width: '38px', height: '38px', minWidth: '38px', minHeight: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(227, 27, 35, 0.12), rgba(227, 27, 35, 0.04))', border: '1px solid rgba(227, 27, 35, 0.2)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
                      {review.name.split(' ')[0][0]}{review.name.split(' ')[1]?.[0] || ''}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>{review.name}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{review.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Set 2 (Duplicate for loop continuity) */}
              {[
                { text: 'I recently got interior detailing done here and I\'m extremely satisfied with the results. They did a deep and thorough cleaning—seats, carpets, dashboard, and even the smallest corners were spotless. My car looks and smells like new again.', name: 'Ajay Navadiya', time: '3 months ago' },
                { text: 'Spotless Cleaning by Kulwant. He is amazing and very professional in what he does. No complaints.', name: 'Palash Mardhekar', time: '2 months ago' },
                { text: 'I had an excellent experience and couldn\'t be happier with the results. From the moment I arrived, he was friendly, welcoming, and genuinely passionate about what he does. He took the time to explain the entire detailing process.', name: 'Saiel Tivatane', time: '2 weeks ago' },
                { text: 'Great experience. I got my model Y detailing done. I recommend dropping off vehicle to his home so even if he misses a spot you can ask him to clean when you\'re picking up your vehicle.', name: 'Gaurang Patel', time: 'a month ago' },
                { text: 'I recently had my vehicle detailed for the first time, and it was an excellent experience from start to finish. Everything was clearly explained beforehand, so I knew exactly what to expect, and he was very professional, friendly, and thorough.', name: 'Katalina Avila', time: '2 weeks ago' },
                { text: 'I had an excellent experience with this auto detailer. The attention to detail was outstanding — my car looks brand new inside and out. Every surface was thoroughly cleaned, polished, and restored to a high standard.', name: 'Peter Godspower', time: '3 months ago' },
                { text: 'Very great experience. My car was thoroughly cleaned and shining like new. Excellent communication. Did engine bay detailing as well and its amazing. I brought new car mats and he installed it for free! Very satisfied with service.', name: 'Apoorv B. Chavda', time: '3 months ago' },
                { text: 'Phenomenal Experience with A-Shine Auto Mobile Detailing! I don\'t normally write reviews, but the incredible service I received here completely earned it.', name: 'Harjeet Singh', time: 'a month ago' },
                { text: 'Absolutely amazing service! My Toyota Sienna looks brand new inside and out. The attention to detail was incredible — every surface was spotless, the carpets looked refreshed, and they even got rid of all the little crumbs and marks.', name: 'Aya-xox', time: 'a month ago' },
                { text: 'Got my suv cleaned fully inside for the first time from A-Shine and very satisfied with the steam cleansing, shampooing and polishing. Very pleased to see the winter salt completely removed.', name: 'Nha TamThu', time: '2 weeks ago' },
                { text: 'I\'ve been coming to A Shine Automobile Detailing regularly, and Kulwant ji always does an amazing job. I recently had the inside of my car detailed again, and it came back looking spotless and fresh. The attention to detail is excellent.', name: 'Pankaj Bains', time: '2 months ago' },
                { text: 'Called last-minute and still received quick and efficient service. For a very reasonable price my car received an amazing cleaning job and looks brand new again. I will be back and definitely would recommend this business. Thank you again!', name: 'Jessica Chan', time: 'a month ago' },
                { text: 'I highly recommend this place for car detailing. Yesterday night food was spilled at the back seat and in trunk of my brand new Elantra, I called him in the morning and inspite of busy schedule he gave me service. Amazing!', name: 'Shanil Gosavi', time: 'a year ago' },
                { text: 'We had the pleasure of A-Shine out to detail our pick up truck. Communication was quick and it was easy to book. We can\'t believe how clean it came out. There was job site dirt, salt stains, dog hair, kids grime - completely cleaned it all. Absolutely recommend.', name: 'Andrea Bradley', time: '2 weeks ago' },
                { text: 'Kulwant is very professional! He always goes the extra mile to make his work more appealing. Very seasonal price for superior work. I wish him all the best!', name: 'Gration Fernando', time: '3 weeks ago' },
              ].map((review, i) => (
                <div key={`set2-${i}`} className="glass-card review-card" style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', color: 'var(--color-accent-primary)', gap: '2px' }}>
                      {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', background: 'rgba(22, 163, 74, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(22, 163, 74, 0.2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Google Review
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '0.85rem' }}>
                    <div style={{ width: '38px', height: '38px', minWidth: '38px', minHeight: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(227, 27, 35, 0.12), rgba(227, 27, 35, 0.04))', border: '1px solid rgba(227, 27, 35, 0.2)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
                      {review.name.split(' ')[0][0]}{review.name.split(' ')[1]?.[0] || ''}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>{review.name}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{review.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section" style={{ background: 'var(--color-bg-secondary)', paddingBlock: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <span className="section-eyebrow" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>PRICING & PACKAGES</span>
            <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase' }}>
              Full Interior Shampooing <span style={{ color: 'var(--color-accent-primary)' }}>& Detailing</span>
            </h2>
            <p className="section-description" style={{ color: 'var(--color-text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: 'var(--text-base)' }}>
              Deep cleaning & steam shampooing that includes everything inside your vehicle: seats, carpets, dashboard, vents, console, door jambs & trunk.
            </p>
          </div>

          {/* Desktop Pricing Grid */}
          <div className="pricing-grid pricing-grid-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>

            {/* Small Car */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SMALL CAR</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBlock: '0.5rem 1rem', height: '36px' }}>Sedans, Coupes & Compact Cars.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$100</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>FLAT RATE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Includes Everything Inside:</span>
                {['Full Seat Shampooing & Stain Removal', 'Deep Carpet Extraction & Salt Removal', 'Dashboard, Console & Air Vents Detailed', 'Door Jambs & Trunk Cleaned', 'Steam Cleansing & Sanitization', 'Odor Treatment & Fresh Polish'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--color-accent-primary)' }} strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', marginTop: 'auto' }}>
                BOOK FOR $100 →
              </Link>
            </div>

            {/* SUV 5-Seater (Featured) */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'var(--color-bg-primary)', border: '2px solid var(--color-accent-primary)', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent-primary)', color: 'white', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                MOST POPULAR
              </div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SUV (5 SEATS)</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBlock: '0.5rem 1rem', height: '36px' }}>5-Seater SUVs, Crossovers & Pickups.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$125</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>FLAT RATE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Includes Everything Inside:</span>
                {['Full Seat Shampooing & Stain Removal', 'Deep Carpet Extraction & Salt Removal', 'Dashboard, Console & Cup Holders Detailed', 'Door Jambs & Cargo/Trunk Cleaned', 'Full Steam Cleansing & Sanitization', 'Odor Treatment & Leather Conditioning'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--color-accent-primary)' }} strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="#contact" className="btn btn--primary btn--full" style={{ borderRadius: '6px', marginTop: 'auto' }}>
                BOOK FOR $125 →
              </Link>
            </div>

            {/* 7-Seater / Large */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>7-SEATER / LARGE</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBlock: '0.5rem 1rem', height: '36px' }}>7-Seater SUVs, Minivans & Large Trucks.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$150</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>FLAT RATE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Includes Everything Inside:</span>
                {['All 3 Rows Seat Shampooing & Stain Removal', 'Deep Carpet Extraction & Salt Removal', 'Dashboard, Console & Rear Controls Detailed', 'Door Jambs & Trunk Area Cleaned', 'Full Steam Cleansing & Sanitization', 'Heavy Spill & Pet Hair Extraction'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--color-accent-primary)' }} strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', marginTop: 'auto' }}>
                BOOK FOR $150 →
              </Link>
            </div>

            {/* Tire & Rim Package */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TIRE & RIM CARE</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBlock: '0.5rem 1rem', height: '36px' }}>Deep brake dust cleaning & glossy tire shine.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$25</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>OR FREE WITH INTERIOR</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Complete Wheel Care:</span>
                {['Heavy Brake Dust & Dirt Removal', 'Deep Rim & Caliper Surface Scrub', 'Tire Sidewall Cleansing & Prep', 'High-Gloss UV Protective Tire Dressing', 'Included FREE with any Interior Shampoo', 'Standalone Tire & Rim Detailing Service'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--color-accent-primary)' }} strokeWidth={3} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', marginTop: 'auto' }}>
                BOOK TIRE CARE →
              </Link>
            </div>

          </div>

          {/* Mobile Pricing Carousel (Middle Left & Right Arrows + Compact Card) */}
          <div className="pricing-mobile-carousel" style={{ position: 'relative', width: '100%', maxWidth: '340px', marginInline: 'auto', paddingInline: '1.25rem' }}>

            {/* Middle Left Arrow */}
            <button
              onClick={() => setActivePriceIdx(prev => (prev > 0 ? prev - 1 : 3))}
              style={{ position: 'absolute', left: '-6px', top: '52%', transform: 'translateY(-50%)', zIndex: 10, width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-accent-primary)', color: '#ffffff', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(227, 27, 35, 0.35)', cursor: 'pointer' }}
              aria-label="Previous Package"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Middle Right Arrow */}
            <button
              onClick={() => setActivePriceIdx(prev => (prev < 3 ? prev + 1 : 0))}
              style={{ position: 'absolute', right: '-6px', top: '52%', transform: 'translateY(-50%)', zIndex: 10, width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-accent-primary)', color: '#ffffff', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(227, 27, 35, 0.35)', cursor: 'pointer' }}
              aria-label="Next Package"
            >
              <ChevronRight size={22} />
            </button>

            {/* Indicator Dots Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                PACKAGE {activePriceIdx + 1} OF 4
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2, 3].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActivePriceIdx(dotIdx)}
                    style={{ width: dotIdx === activePriceIdx ? '20px' : '7px', height: '7px', borderRadius: '4px', background: dotIdx === activePriceIdx ? 'var(--color-accent-primary)' : '#cbd5e1', transition: 'all 0.3s ease', border: 'none', padding: 0, cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>

            {/* Compact Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePriceIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activePriceIdx === 0 && (
                  <div className="glass-card" style={{ padding: '1.25rem 1.15rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '14px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SMALL CAR</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBlock: '0.25rem 0.6rem' }}>Sedans, Coupes & Compact Cars.</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>$100</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>FLAT RATE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Includes Everything Inside:</span>
                      {['Full Seat Shampooing & Stain Removal', 'Deep Carpet Extraction & Salt Removal', 'Dashboard, Console & Air Vents Detailed', 'Door Jambs & Trunk Cleaned', 'Full Steam Cleansing & Sanitization', 'Odor Treatment & Fresh Polish'].map((feat, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <Check size={13} style={{ color: 'var(--color-accent-primary)', flexShrink: 0 }} strokeWidth={3} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', lineHeight: '1.25' }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', paddingBlock: '0.6rem', fontSize: '0.8rem' }}>
                      BOOK FOR $100 →
                    </Link>
                  </div>
                )}

                {activePriceIdx === 1 && (
                  <div className="glass-card" style={{ padding: '1.25rem 1.15rem', background: 'var(--color-bg-primary)', border: '2px solid var(--color-accent-primary)', borderRadius: '14px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 4px 20px rgba(227,27,35,0.08)' }}>
                    <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent-primary)', color: 'white', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.15rem 0.6rem', borderRadius: '4px' }}>
                      MOST POPULAR
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SUV (5 SEATS)</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBlock: '0.25rem 0.6rem' }}>5-Seater SUVs, Crossovers & Pickups.</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>$125</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>FLAT RATE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Includes Everything Inside:</span>
                      {['Full Seat Shampooing & Stain Removal', 'Deep Carpet Extraction & Salt Removal', 'Dashboard, Console & Cup Holders Detailed', 'Door Jambs & Cargo/Trunk Cleaned', 'Full Steam Cleansing & Sanitization', 'Odor Treatment & Leather Conditioning'].map((feat, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <Check size={13} style={{ color: 'var(--color-accent-primary)', flexShrink: 0 }} strokeWidth={3} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', lineHeight: '1.25' }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="#contact" className="btn btn--primary btn--full" style={{ borderRadius: '6px', paddingBlock: '0.6rem', fontSize: '0.8rem' }}>
                      BOOK FOR $125 →
                    </Link>
                  </div>
                )}

                {activePriceIdx === 2 && (
                  <div className="glass-card" style={{ padding: '1.25rem 1.15rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '14px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>7-SEATER / LARGE</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBlock: '0.25rem 0.6rem' }}>7-Seater SUVs, Minivans & Large Trucks.</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>$150</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>FLAT RATE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Includes Everything Inside:</span>
                      {['All 3 Rows Seat Shampooing & Stain Removal', 'Deep Carpet Extraction & Salt Removal', 'Dashboard, Console & Rear Controls Detailed', 'Door Jambs & Trunk Area Cleaned', 'Full Steam Cleansing & Sanitization', 'Heavy Spill & Pet Hair Extraction'].map((feat, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <Check size={13} style={{ color: 'var(--color-accent-primary)', flexShrink: 0 }} strokeWidth={3} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', lineHeight: '1.25' }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', paddingBlock: '0.6rem', fontSize: '0.8rem' }}>
                      BOOK FOR $150 →
                    </Link>
                  </div>
                )}

                {activePriceIdx === 3 && (
                  <div className="glass-card" style={{ padding: '1.25rem 1.15rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '14px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TIRE & RIM CARE</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBlock: '0.25rem 0.6rem' }}>Deep brake dust cleaning & glossy tire shine.</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>$25</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>OR FREE WITH INTERIOR</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Complete Wheel Care:</span>
                      {['Heavy Brake Dust & Dirt Removal', 'Deep Rim & Caliper Surface Scrub', 'Tire Sidewall Cleansing & Prep', 'High-Gloss UV Protective Tire Dressing', 'Included FREE with any Interior Shampoo', 'Standalone Tire & Rim Detailing Service'].map((feat, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <Check size={13} style={{ color: 'var(--color-accent-primary)', flexShrink: 0 }} strokeWidth={3} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', lineHeight: '1.25' }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="#contact" className="btn btn--secondary btn--full" style={{ border: '1px solid var(--color-accent-primary)', color: 'var(--color-accent-primary)', background: 'transparent', borderRadius: '6px', paddingBlock: '0.6rem', fontSize: '0.8rem' }}>
                      BOOK TIRE CARE →
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Trust Mappings Bar */}
          <div className="trust-bar" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--glass-border)', marginTop: '3rem', paddingTop: '1.5rem' }}>
            {[
              { icon: '🚗', title: '100% Mobile or Drop-Off', desc: 'We come to your location or drop off at our studio.' },
              { icon: '🛡️', title: 'Deep Steam Sanitization', desc: 'Eliminates bacteria, odors, and winter salt stains.' },
              { icon: '⭐', title: '5-Star Customer Rated', desc: 'Proven results loved by dozens of happy clients.' },
              { icon: '🕒', title: 'Flexible Scheduling', desc: 'Last-minute & weekend bookings welcomed.' },
              { icon: '🤝', title: 'Satisfaction Promise', desc: 'We go the extra mile to make your vehicle spotless.' }
            ].map((pt, i) => (
              <div key={i} className="trust-bar-item" style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', flex: '1 1 180px' }}>
                <span style={{ fontSize: '1.25rem', lineHeight: 1, flexShrink: 0 }}>{pt.icon}</span>
                <div>
                  <h5 style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>{pt.title}</h5>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.1rem', lineHeight: 1.4 }}>{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Contact & Free Quote Section */}
      <section id="contact" className="section" style={{ paddingBlock: '4.5rem', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-16)', alignItems: 'start' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.15em', color: 'var(--color-accent-primary)' }}>
              GET IN TOUCH
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.2rem)', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase', margin: 0, lineHeight: 1.15 }}>
              We're Here<br />To Help
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Have questions or ready to book your detailing service? Reach out to us today – we're just a call or message away!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
              <div className="contact-info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="contact-info-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                  <Phone size={19} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, marginBottom: '0.1rem', color: 'var(--color-text-primary)', textAlign: 'left' }}>Phone Number</h4>
                  <a href="tel:5197295856" style={{ fontSize: '0.95rem', color: 'var(--color-accent-primary)', fontWeight: 'bold', textDecoration: 'none', textAlign: 'left' }}>(519) 729-5856</a>
                </div>
              </div>

              <div className="contact-info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="contact-info-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.08)', color: '#16a34a', flexShrink: 0 }}>
                  <MessageSquare size={19} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, marginBottom: '0.1rem', color: 'var(--color-text-primary)', textAlign: 'left' }}>WhatsApp Us</h4>
                  <a href="https://wa.me/15197295856" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', textDecoration: 'none', textAlign: 'left' }}>
                    (519) 729-5856
                  </a>
                </div>
              </div>

              <div className="contact-info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="contact-info-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                  <Mail size={19} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, marginBottom: '0.1rem', color: 'var(--color-text-primary)', textAlign: 'left' }}>Email Us</h4>
                  <a href="mailto:info@ashinedetailing.com" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-text-primary)', textDecoration: 'none', wordBreak: 'break-all', textAlign: 'left' }}>
                    info@ashinedetailing.com
                  </a>
                </div>
              </div>

              <div className="contact-info-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="contact-info-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(227, 27, 35, 0.08)', color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                  <MapPin size={19} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, marginBottom: '0.1rem', color: 'var(--color-text-primary)', textAlign: 'left' }}>Service Area</h4>
                  <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-text-primary)', lineHeight: '1.35', textAlign: 'left' }}>
                    54 Woodbine Avenue, Kitchener, Ont N2R 1V1
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Free Quote Form */}
          <div style={{ position: 'relative' }}>
            <div className="glass-card contact-form-card" style={{ padding: '2rem 1.75rem', background: 'var(--color-bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 2 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-accent-secondary)', textTransform: 'uppercase', marginBottom: '1rem', margin: 0 }}>
                Get a Free Quote
              </h3>

              <AnimatePresence mode="wait">
                {quoteSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', paddingBlock: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={24} strokeWidth={3} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Quote Request Sent!</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      Thank you! We have received your request and our detailing team will get back to you with a custom quote within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                      <div className="input-group">
                        <label className="input-label input-label--required" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Full Name</label>
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
                        <label className="input-label input-label--required" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Phone Number</label>
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                      <div className="input-group">
                        <label className="input-label input-label--required" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Email Address</label>
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
                        <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Vehicle Make & Model</label>
                        <input
                          type="text"
                          placeholder="e.g. Tesla Model 3"
                          className="input-field"
                          value={quoteForm.vehicle}
                          onChange={(e) => setQuoteForm({ ...quoteForm, vehicle: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Service Needed</label>
                      <select
                        className="input-field"
                        style={{ appearance: 'none', background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23e31b23\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2.5\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E") no-repeat right 0.75rem center / 0.85rem', paddingRight: '2rem' }}
                        value={quoteForm.service}
                        onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                      >
                        <option value="">Select a package...</option>
                        <option value="interior-small">Small Car Interior ($100)</option>
                        <option value="interior-suv">SUV 5-Seater Interior ($125)</option>
                        <option value="interior-7seater">7-Seater / Large Interior ($150)</option>
                        <option value="tire-wheel">Tire & Rim Care ($25 / Free)</option>
                        <option value="commercial">Truck & Heavy Equipment</option>
                        <option value="other">Other / Custom Request</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Additional Details (Optional)</label>
                      <textarea
                        rows={2}
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
                      style={{ borderRadius: '8px', paddingBlock: '0.75rem', fontSize: '0.85rem', marginTop: '0.25rem', opacity: quoteLoading ? 0.75 : 1, cursor: quoteLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
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
      <footer className="footer" style={{ background: '#0a0f1d', borderTop: '1px solid rgba(255,255,255,0.06)', paddingBlock: 'var(--space-16) var(--space-6)', color: '#94a3b8' }}>
        <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-10)', marginBottom: 'var(--space-8)' }}>

          {/* Column 1 - Brand */}
          <div className="footer-col footer-col--brand" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent-primary)', color: 'white', borderRadius: '6px', width: '34px', height: '34px', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>
                A
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>A-SHINE</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.12em', marginTop: '0.1rem' }}>AUTO VEHICLE DETAILING</span>
              </div>
            </Link>
            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0 }}>
              Interior deep shampooing & high-gloss tire care. Showroom fresh results at your doorstep.
            </p>
            {/* Social handles */}
            <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
              {['Facebook', 'Instagram', 'TikTok'].map((social, i) => (
                <span key={social} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', cursor: 'pointer' }}>{social}</span>
                  {i < 2 && <span style={{ color: '#475569', margin: '0 0.5rem', fontSize: '0.5rem' }}>•</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Links row — Quick Links left, Services+Hours right */}
          <div className="footer-links-row">

            {/* Quick Links */}
            <div className="footer-col footer-col-left">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="#" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Home</Link></li>
                <li><a href="#services" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Services</a></li>
                <li><a href="#about" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>About Us</a></li>
                <li><a href="#gallery" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Gallery</a></li>
                <li><a href="#reviews" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Reviews</a></li>
                <li><a href="#pricing" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Pricing</a></li>
                <li><a href="#contact" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Contact</a></li>
              </ul>
            </div>

            {/* Right — Services + Hours stacked */}
            <div className="footer-col-right">

              <div className="footer-col">
                <h4>Services</h4>
                <ul>
                  <li><Link href="#contact" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Interior Shampooing</Link></li>
                  <li><Link href="#contact" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Steam & Salt Extraction</Link></li>
                  <li><Link href="#contact" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Spill & Stain Cleaning</Link></li>
                  <li><Link href="#contact" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Tire & Rim Detailing</Link></li>
                  <li><Link href="#contact" style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Truck & Commercial</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Hours</h4>
                <ul style={{ gap: '0.3rem' }}>
                  <li style={{ color: '#e2e8f0', fontSize: '0.72rem' }}>Mon–Fri: 8AM–8PM</li>
                  <li style={{ color: '#e2e8f0', fontSize: '0.72rem' }}>Saturday: 9AM–6PM</li>
                  <li style={{ color: '#e2e8f0', fontSize: '0.72rem' }}>Sunday: 10AM–4PM</li>
                </ul>
                <a href="#contact" className="btn btn--primary footer-cta-btn">
                  BOOK NOW →
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* Footer Bottom */}
        <div className="container footer-bottom" style={{ marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
            © 2026 A-SHINE Auto Vehicle Detailing. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#cbd5e1', cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ color: '#cbd5e1', cursor: 'pointer' }}>Terms of Service</span>
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
