'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import GuiasClient from './GuiasClient';
import { GuideMetadata } from '@/lib/guides';

interface GuiasPageClientProps {
  initialGuides: GuideMetadata[];
}

export default function GuiasPageClient({ initialGuides }: GuiasPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      {/* Search Bar renderizado no Hero section */}
      <SearchBar onSearchChange={setSearchTerm} searchTerm={searchTerm} />

      {/* GuiasClient renderiza category filter e lista de guias (sem search bar) */}
      <GuiasClient initialGuides={initialGuides} searchTerm={searchTerm} />
    </>
  );
}
