import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'OpenClaw Command Center',
  description: 'Real-time visibility into your AI agent operations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Sidebar />
        <main className="ml-60 min-h-screen p-6">{children}</main>
      </body>
    </html>
  );
}
