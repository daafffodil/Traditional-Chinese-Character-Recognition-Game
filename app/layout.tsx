import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Traditional Chinese Character Recognition Game',
  description: 'A friendly character recognition game for primary school students.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
