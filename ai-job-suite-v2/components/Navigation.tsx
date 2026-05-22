'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const GUMROAD_URL = 'https://elevehired.gumroad.com/l/pllrsk';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Try It', href: '#generator' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#06070F]/85 backdrop-blur-xl border-b border-white/[0.04]' : 'bg-transparent'
      }`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span
            className="text-xl font-bold tracking-tight text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Élève
          </span>
          <span className="text-[10px] font-medium text-[#7B6FFF] bg-[#7B6FFF]/10 border border-[#7B6FFF]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            AI
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-[#7E7D9A] hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#generator"
            className="px-4 py-2 text-sm text-[#7E7D9A] hover:text-white transition-colors"
          >
            Try free
          </a>
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2 px-5"
          >
            <Zap size={14} />
            Get Access — $29
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[#7E7D9A] hover:text-white hover:bg-white/[0.04] transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0C0E1A]/95 backdrop-blur-xl border-b border-white/[0.04]"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-sm text-[#7E7D9A] hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 pt-3 border-t border-white/[0.04]">
                <a
                  href={GUMROAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center text-sm"
                >
                  <Zap size={14} />
                  Get Access — $29
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
