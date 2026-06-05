import React from 'react';
import Link from 'next/link';
import { Zap, Download, CheckCircle, XCircle } from 'lucide-react';
import { getComparisonData } from '@/lib/comparisonData';

interface ComparisonTableProps {
  category: string;
}

export default function ComparisonTable({ category }: ComparisonTableProps) {
  const comparisonData = getComparisonData(category);
  
  return (
    <div className="my-12 bg-gradient-to-br from-white to-gray-50 rounded-[2.5rem] p-8 md:p-12 border border-gray-200 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
          {comparisonData.title}
        </h3>
        <p className="text-gray-600 text-lg">{comparisonData.description}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-4 md:p-6 font-black text-gray-900 text-sm uppercase tracking-wider">Métrica</th>
              <th className="text-center p-4 md:p-6 font-black text-gray-500 text-sm uppercase tracking-wider">Manual</th>
              <th className="text-center p-4 md:p-6 font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-sm uppercase tracking-wider">
                Voltris Optimizer
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.rows.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                <td className="p-4 md:p-6 font-bold text-gray-900">{row.metric}</td>
                <td className="p-4 md:p-6 text-center text-gray-500 flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  {row.manual}
                </td>
                <td className="p-4 md:p-6 text-center font-black text-blue-600 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {row.optimizer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-6 font-medium">
          * Resultados baseados em testes com 10.000+ usuários em 2026
        </p>
        <Link
          href="/voltrisoptimizer"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
        >
          <span>Baixar Voltris Optimizer</span>
          <Download className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
