import type { Metadata } from 'next';
import localFont from 'next/font/local'
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SocketIoProvider } from '@/lib/ws/provider';
import { CLientProvider } from '@/components/providers/ClientProvider';
import { Toaster } from 'sonner';

const font = localFont({
  src: [
    {
      path: '../../public/fonts/XiaolaiMonoSC-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/XiaolaiMonoSC-without-Hangul-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-xiaolai-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'aaChat',
  description: 'aaChat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.variable} antialiased`}
      >
        <CLientProvider>

        <SocketIoProvider>{children}
                              <Toaster
                      position="top-right"
                      richColors
                      className="bg-transparent pointer-events-auto!"
                      duration={60000}
                      // style={{ pointerEvents: "auto" }}
                    />
        </SocketIoProvider>
        </CLientProvider>
      </body>
    </html>
  );
}
