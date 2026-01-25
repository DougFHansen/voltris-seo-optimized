"use client";
import { NotificationProvider } from "@/components/notifications/NotificationContext";
import { Toaster } from 'react-hot-toast';

export default function ClientNotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A22',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#00FF94',
              secondary: '#1A1A22',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF4B6B',
              secondary: '#1A1A22',
            },
          },
        }}
      />
    </NotificationProvider>
  );
}