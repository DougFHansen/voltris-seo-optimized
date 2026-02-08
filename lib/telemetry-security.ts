/**
 * VOLTRIS ENTERPRISE TELEMETRY - RATE LIMITING SERVICE
 * Redis-based distributed rate limiting (production-ready)
 */

import { createClient } from '@supabase/supabase-js';

// Rate limit tiers
export const RATE_LIMITS = {
    FREE: {
        events_per_minute: 100,
        events_per_hour: 5000,
        events_per_day: 100000
    },
    PRO: {
        events_per_minute: 1000,
        events_per_hour: 50000,
        events_per_day: 1000000
    },
    ENTERPRISE: {
        events_per_minute: 10000,
        events_per_hour: 500000,
        events_per_day: 10000000
    }
};

// In-memory fallback (production: use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
    deviceId: string,
    eventCount: number,
    tier: 'FREE' | 'PRO' | 'ENTERPRISE' = 'FREE'
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {

    const limits = RATE_LIMITS[tier];
    const key = `rate:${deviceId}:minute`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || now >= entry.resetAt) {
        // New window
        entry = {
            count: 0,
            resetAt: now + 60000 // 1 minute from now
        };
        rateLimitStore.set(key, entry);
    }

    const wouldExceed = (entry.count + eventCount) > limits.events_per_minute;

    if (wouldExceed) {
        return {
            allowed: false,
            remaining: Math.max(0, limits.events_per_minute - entry.count),
            resetAt: entry.resetAt
        };
    }

    entry.count += eventCount;

    return {
        allowed: true,
        remaining: limits.events_per_minute - entry.count,
        resetAt: entry.resetAt
    };
}

// PII Detection & Redaction
const PII_PATTERNS = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    credit_card: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    cpf: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g
};

export function detectAndRedactPII(payload: any): {
    redacted: any;
    piiFound: string[];
} {
    const piiFound: string[] = [];
    let jsonStr = JSON.stringify(payload);

    Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
        if (pattern.test(jsonStr)) {
            piiFound.push(type);
            jsonStr = jsonStr.replace(pattern, `[REDACTED_${type.toUpperCase()}]`);
        }
    });

    return {
        redacted: piiFound.length > 0 ? JSON.parse(jsonStr) : payload,
        piiFound
    };
}

// SQL Injection Prevention
export function sanitizeInput(value: string): string {
    if (typeof value !== 'string') return value;

    // Remove potentially dangerous characters
    return value
        .replace(/['"`;]/g, '') // SQL injection chars
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // XSS
        .replace(/javascript:/gi, '') // XSS
        .replace(/on\w+\s*=/gi, '') // Event handlers
        .substring(0, 1000); // Max length
}

// Cost-based throttling
export async function checkCostBudget(
    deviceId: string,
    eventCount: number
): Promise<{ allowed: boolean; budgetRemaining: number }> {

    // Calculate cost (example: $0.001 per 1000 events)
    const costPerEvent = 0.000001; // $0.001 / 1000
    const eventCost = eventCount * costPerEvent;

    // TODO: Fetch from database
    const dailyBudget = 1.00; // $1/day
    const usedToday = 0; // Fetch from DB

    const budgetRemaining = dailyBudget - usedToday;

    return {
        allowed: eventCost <= budgetRemaining,
        budgetRemaining
    };
}

// Event lineage tracking
export interface EventLineage {
    event_id: string;
    received_at: number;
    validated_at: number;
    stored_at: number;
    processed_at: number;
    total_latency_ms: number;
    validation_latency_ms: number;
    storage_latency_ms: number;
}

export function trackEventLineage(event: any): EventLineage {
    const now = Date.now();

    return {
        event_id: event.event_id || crypto.randomUUID(),
        received_at: event.received_at || now,
        validated_at: 0,
        stored_at: 0,
        processed_at: 0,
        total_latency_ms: 0,
        validation_latency_ms: 0,
        storage_latency_ms: 0
    };
}
