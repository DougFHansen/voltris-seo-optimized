import { NextResponse } from 'next/server';

const SITEMAP_URL = 'https://voltris.com.br/sitemap.xml';
const GOOGLE_PING = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
const BING_PING = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

export async function POST() {
  const results: Record<string, string> = {};
  try {
    const googleRes = await fetch(GOOGLE_PING);
    results.google = googleRes.ok ? 'OK' : 'FAIL';
  } catch (e) {
    results.google = 'ERROR';
  }
  try {
    const bingRes = await fetch(BING_PING);
    results.bing = bingRes.ok ? 'OK' : 'FAIL';
  } catch (e) {
    results.bing = 'ERROR';
  }
  return NextResponse.json({ status: 'done', ...results });
} 