import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Élève — AI Resume & Cover Letter Generator',
  description: 'ATS-optimized resumes and cover letters in seconds. Designed to open doors, not get filtered out. One-time payment, lifetime access.',
  keywords: 'AI resume generator, cover letter generator, ATS optimization, job application, LinkedIn summary',
  openGraph: {
    title: 'Élève — AI Resume & Cover Letter Generator',
    description: 'ATS-optimized resumes and cover letters in seconds. $29 one-time payment.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
