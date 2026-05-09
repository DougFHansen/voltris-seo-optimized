'use client';

import { Search } from 'lucide-react';
import { useSearch } from './SearchContext';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="w-full px-2 md:px-4 lg:px-6 mb-8 relative z-20">
      <div className="relative group max-w-3xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
        <input
          type="text"
          placeholder="Pesquise por erro, jogo ou componente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="relative w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-lg transition-all min-h-[56px] shadow-sm"
          autoFocus
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors pointer-events-none" />
      </div>
    </div>
  );
}
