import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css'; 
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Firebase Auth",
  description: "Firebase Authentication Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <AuthProvider>
          <MantineProvider>
            {children}
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}