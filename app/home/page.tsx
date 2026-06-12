"use client";

import HomeHubClient from './HomeHubClient';

export default function Page() {
  return (
    <main className="min-h-screen font-sans selection:bg-[#31A8FF]/30">
      <h1 className="sr-only">Home</h1>
      <HomeHubClient />
    </main>
  );
}
