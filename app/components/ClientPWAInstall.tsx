"use client";
import { usePathname } from "next/navigation";
import PWAInstall from "@/components/PWAInstall";

export default function ClientPWAInstall() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <PWAInstall />;
} 