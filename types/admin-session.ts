export type SessionStatus = 'active' | 'idle' | 'completed' | 'timeout';

export interface AdminSession {
    id: string;
    device_id: string;
    status: SessionStatus;
    started_at: string;
    last_heartbeat_at: string;
    duration_seconds: number;
    app_version: string;

    // Joined fields
    device?: {
        machine_id: string;
        hostname: string;
        os_version: string;
        company?: {
            name: string;
            plan_type: string;
        } | null;
        profile?: any; // To allow profile access
    };

    last_activity?: {
        type: string;
        name: string;
        time: string;
    } | null;

    health_score?: number | null;

    // Calculated for UI
    is_online: boolean;
}

export interface AdminDashboardStats {
    active_now: number; // Active + Idle
    idle_now: number;
    peak_concurrent_24h: number;
    total_sessions_today: number;
    active_companies: number;
}
