import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
      aria-label="Breadcrumb"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <span
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
      >
        <Link
          href="/"
          itemProp="item"
          className="flex items-center hover:text-[#31A8FF] transition-colors"
          aria-label="Página inicial"
        >
          <Home className="w-4 h-4" />
          <span itemProp="name" className="sr-only">Início</span>
        </Link>
        <meta itemProp="position" content="1" />
      </span>

      {items.map((item, index) => {
        const position = index + 2;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.href ? (
                <>
                  <Link
                    href={item.href}
                    itemProp="item"
                    className="hover:text-[#31A8FF] transition-colors"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <meta itemProp="position" content={position.toString()} />
                </>
              ) : (
                <>
                  <span className="text-gray-900 font-medium" aria-current="page" itemProp="name">
                    {item.label}
                  </span>
                  <meta itemProp="position" content={position.toString()} />
                </>
              )}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
}