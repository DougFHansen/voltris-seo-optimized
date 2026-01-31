import { metadata as guiasMetadata } from './metadata';
import AdSense from "@/components/AdSense";

export const metadata = guiasMetadata;

export default function GuiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdSense pId="ca-pub-9217408182316735" />
      {children}
    </>
  );
}

