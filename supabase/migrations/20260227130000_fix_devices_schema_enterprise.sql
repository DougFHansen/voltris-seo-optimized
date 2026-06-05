-- MIGRATION: 20260227130000_fix_devices_schema_enterprise.sql
-- PURPOSE: Add missing columns for enterprise monitoring and stability

-- Add status column to track online/offline state
ALTER TABLE IF EXISTS public.devices 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'offline';

-- Add last_heartbeat to track connectivity health
ALTER TABLE IF EXISTS public.devices 
ADD COLUMN IF NOT EXISTS last_heartbeat_at TIMESTAMPTZ;

-- Add app_version to devices table to avoid InternalServerError 
-- (The API expects this for device profiling)
ALTER TABLE IF EXISTS public.devices 
ADD COLUMN IF NOT EXISTS app_version TEXT;

-- Index for performance on monitoring queries
CREATE INDEX IF NOT EXISTS idx_devices_machine_id ON public.devices(machine_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON public.devices(status);
