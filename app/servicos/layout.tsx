import { Metadata } from 'next';
import { metadata as ptMetadata } from './metadata';

export const metadata: Metadata = ptMetadata;

export default function ServicosLayout({ children }: { children: React.ReactNode }) {
    return children;
}
