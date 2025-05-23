import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import './globals.css';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Testify - Instant Testimonial Wall',
  description:
    'Easily collect and display customer testimonials on your website.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning to html to mitigate general hydration errors
    <html lang="en" suppressHydrationWarning>
      {/* Add suppressHydrationWarning to body specifically for extension-related attribute mismatches */}
      <body
        suppressHydrationWarning
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased`,
          'flex min-h-screen flex-col'
        )}
      >
        <AuthProvider>
          <main className="flex-grow">{children}</main>
          <Toaster /> {/* Add Toaster here */}
        </AuthProvider>
      </body>
    </html>
  );
}
