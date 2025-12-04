"use client";

import ReactQueryProvider from "@/app/ReactQueryProvider";
import PWAInstall from "@/components/PWAInstall";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";

export default function ClientComponents({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}
      <PWAInstall />
      <GoogleAnalytics />
      <CookieBanner />
    </ReactQueryProvider>
  );
} 