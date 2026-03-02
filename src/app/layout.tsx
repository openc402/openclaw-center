import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'OpenClaw Command Center',
  description: 'Real-time visibility into your AI agent operations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <AuthGuard>
            <Sidebar />
            <main className="md:ml-60 min-h-screen p-4 md:p-6 pt-16 md:pt-6">{children}</main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
