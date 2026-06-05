"use client";

import dynamic from 'next/dynamic';

const OptimizerMockup = dynamic(() => import('@/components/OptimizerMockup'), {
    loading: () => <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl" />,
    ssr: false
});

export default function OptimizerMockupWrapper() {
    return <OptimizerMockup />;
}
