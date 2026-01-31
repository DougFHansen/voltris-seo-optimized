import Script from 'next/script';

type JsonLdProps = {
    type: string;
    data: Record<string, any>;
    id?: string;
};

export default function JsonLd({ type, data, id }: JsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data,
    };

    return (
        <Script
            id={id || `json-ld-${type}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            strategy="afterInteractive"
        />
    );
}
