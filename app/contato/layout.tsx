import { metadata as contatoMetadata } from './metadata';

export const metadata = contatoMetadata;

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

