import {Analytics} from '@vercel/analytics/next';
import type {Metadata, Viewport} from 'next';
import {Geist} from 'next/font/google';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/sonner';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: 'Toskio · Agende o cuidado para seu pet',
  description:
    'Agende de forma rápida uma sessão de banho e tosa para o seu pet. Escolha a data, o horário e preencha seus dados.',
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: 'white'},
    {media: '(prefers-color-scheme: dark)', color: 'black'},
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="pt"
      className={`${geist.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
