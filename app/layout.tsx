import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from './context';

export const metadata: Metadata = {
  title: 'Travellir Management',
  description: 'Property & Vendor Management Dashboard for Short-Term Rentals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 font-sans antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
