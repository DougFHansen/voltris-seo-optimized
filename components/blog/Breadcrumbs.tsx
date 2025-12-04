'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const formatLabel = (segment: string) => {
    // Substitui hífens por espaços e capitaliza a primeira letra
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const normalizeCategory = (category: string) => {
    return category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const breadcrumbs = segments.map((segment, index) => {
    let href;
    if (segments[index - 1] === 'category') {
      // Se o segmento anterior for 'category', normaliza o segmento atual
      href = `/${segments.slice(0, index).join('/')}/${normalizeCategory(segment)}`;
    } else {
      href = `/${segments.slice(0, index + 1).join('/')}`;
    }
    const label = formatLabel(segment);
    const isLast = index === segments.length - 1;

    return {
      href,
      label,
      isLast
    };
  });

  return (
    <nav className="py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Home
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <span className="mx-2 text-gray-500">/</span>
            {breadcrumb.isLast ? (
              <span className="text-[#8B31FF]">{breadcrumb.label}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 