import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 5;

/**
 * Health check endpoint para verificar conectividade
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'voltris-license-api'
  });
}