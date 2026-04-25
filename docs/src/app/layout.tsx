import '@/lib/react-native-polyfill';
import { RootProvider } from 'fumadocs-ui/provider';
import "fumadocs-ui/style.css"; 
import './globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <RootProvider
          theme={{
            defaultTheme: 'dark',
            attribute: 'class',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
