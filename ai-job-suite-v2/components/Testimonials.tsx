'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "I went from getting zero callbacks to three interview invitations in one week. The ATS score feature alone is worth the price — it told me exactly what to fix.",
    name: "Nomvula K.",
    role: "Software Developer, Johannesburg",
    stars: 5,
  },
  {
    quote: "The cover letters sound genuinely human. Every recruiter who responded said my application stood out. I've tried other AI tools — this is different.",
    name: "Marcus T.",
    role: "Marketing Analyst, Toronto",
    stars: 5,
  },
  {
    quote: "I was skeptical that AI could match my industry's language. It nailed the healthcare terminology and the interview questions were scarily accurate.",
    name: "Priya S.",
    role: "Registered Nurse, London",
    stars: 5,
  },
  {
    quote: "Switched careers after 10 years. Élève helped me frame my experience for a completely new field. Got an offer within 6 weeks.",
    name: "David R.",
    role: "Finance → Product Manager",
    stars: 5,
  },
  {
    quote: "The LinkedIn summary generator is underrated. My profile views doubled after I updated my About section using this tool.",
    name: "Ayasha M.",
    role: "UX Designer, New York",
    stars: 5,
  },
  {
    quote: "Best $29 I've ever spent. Seriously. The resume templates look professional without looking generated. I got compliments on the formatting.",
    name: "Liam O.",
    role: "Civil Engineer, Dublin",
    stars: 5,
  },
];

// ⚠️ PLACEHOLDER: These testimonials are fabricated for demonstration.
// Replace with real customer reviews before deploying.

export default function Testimonials() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(123,111,255,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Trusted by job seekers{' '}
            <span className="gradient-text">worldwide.</span>
          </h2>
          <p className="text-[#7E7D9A] text-lg">
            Real results from real people — in every industry, at every level.
          </p>
          <p className="text-xs text-[#4A4A60] mt-2">
            ⚠ Sample testimonials shown — replace with verified reviews before launch.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(145deg, #0C0E1A, #121528)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} size={13} className="fill-[#7B6FFF] text-[#7B6FFF]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-[#B8B7D0] leading-relaxed mb-5 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(123,111,255,0.2)', color: '#A892FF' }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-[#7E7D9A]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
