import { Metadata } from 'next';
import { metadata as pageMetadata } from './page-metadata';

export const metadata: Metadata = pageMetadata;

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 