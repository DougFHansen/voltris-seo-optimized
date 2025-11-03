"use client";
import { NotificationProvider } from "@/components/notifications/NotificationContext";

export default function ClientNotificationProvider({ children }: { children: React.ReactNode }) {
  return <NotificationProvider>{children}</NotificationProvider>;
} 