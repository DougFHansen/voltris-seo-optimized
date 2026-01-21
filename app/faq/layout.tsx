import { metadata as faqMetadata } from './metadata';

export const metadata = faqMetadata;

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
