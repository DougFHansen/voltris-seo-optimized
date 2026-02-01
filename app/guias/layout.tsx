import { metadata as guiasMetadata } from './metadata';

export const metadata = guiasMetadata;

export default function GuiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

