import { Zap } from 'lucide-react';

const GUMROAD_URL = 'https://elevehired.gumroad.com/l/pllrsk';

export default function Footer() {
  return (
    <footer className="relative border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Élève
            </span>
            <span className="text-[10px] font-medium text-[#7B6FFF] bg-[#7B6FFF]/10 border border-[#7B6FFF]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              AI
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#7E7D9A]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#generator" className="hover:text-white transition-colors">Try It Free</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* CTA */}
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

        <div
          className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#4A4A60]"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span>© {new Date().getFullYear()} Élève Emporium. All rights reserved.</span>
          <span>Powered by Claude AI · Built by Élève Emporium</span>
        </div>
      </div>
    </footer>
  );
}
