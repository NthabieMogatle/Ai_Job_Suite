'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';

const GUMROAD_URL = 'https://elevehired.gumroad.com/l/pllrsk';

const included = [
  'Unlimited cover letter generations',
  'Unlimited resume generations',
  'Unlimited LinkedIn summary generations',
  'ATS Score Analysis on every resume',
  'Auto-improve from ATS tips',
  'Interview prep & answer guide',
  'LinkedIn profile optimization tips',
  '4 premium resume templates',
  'One-click PDF download',
  'Lifetime access — no subscription',
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(123,111,255,0.08) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#7B6FFF] bg-[#7B6FFF]/10 border border-[#7B6FFF]/20 px-3 py-1.5 rounded-full uppercase tracking-wider mb-6">
            <Zap size={12} />
            Simple pricing
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            One price.{' '}
            <span className="gradient-text">Everything included.</span>
          </h2>
          <p className="text-[#7E7D9A] text-lg mb-12">
            No subscriptions. No per-generation fees. Pay once, use forever.
          </p>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Animated gradient border */}
          <div
            className="absolute -inset-px rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(123,111,255,0.6) 0%, rgba(168,146,255,0.2) 50%, rgba(78,232,181,0.4) 100%)',
              zIndex: -1,
            }}
          />

          <div
            className="rounded-3xl p-8 md:p-10"
            style={{ background: 'linear-gradient(145deg, #0C0E1A, #121528)' }}
          >
            {/* Price */}
            <div className="mb-8">
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-2xl text-[#7E7D9A] font-medium mt-2">$</span>
                <span
                  className="text-7xl font-bold text-white"
                  style={{ fontFamily: 'Space Grotesk', lineHeight: 1 }}
                >
                  29
                </span>
              </div>
              <div className="text-sm text-[#7E7D9A] uppercase tracking-widest font-medium">
                One-time payment · Lifetime access
              </div>
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle size={15} className="text-[#4EE8B5] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#B8B7D0]">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center text-base py-4 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #7B6FFF, #A892FF)',
                boxShadow: '0 16px 40px rgba(123,111,255,0.35)',
              }}
            >
              <Zap size={18} />
              Get Instant Access — $29
              <ArrowRight size={16} />
            </a>

            <p className="text-xs text-[#4A4A60] mt-4">
              Secure payment via Gumroad · Instant access after purchase · Premium code in your receipt
            </p>
          </div>
        </motion.div>

        {/* Free tier note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm text-[#7E7D9A] mt-8"
        >
          Not ready? Try 2 free generations — no payment required.{' '}
          <a href="#generator" className="text-[#7B6FFF] hover:text-[#A892FF] transition-colors">
            Start free →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
