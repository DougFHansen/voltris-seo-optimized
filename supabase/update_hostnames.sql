-- =========================================================================
-- UPDATE HOSTNAMES - Fix "Unknown" devices with actual computer names
-- =========================================================================

-- Update devices table with actual hostnames from Windows environment
-- This will set the hostname to the machine name from the installation

-- Option 1: If you know the hostname, update manually
-- UPDATE devices 
-- SET hostname = 'DESKTOP-65TSNJ8' 
-- WHERE machine_id = '612f0f8d-8780-42f9-8daf-3bdffe299bc6';

-- Option 2: Try to extract from CPU name or other fields (temporary fix)
-- This assumes the hostname might be stored somewhere in installations
UPDATE devices d
SET hostname = COALESCE(
  -- Try to get from installations if hostname column exists
  (SELECT NULLIF(TRIM(i.hostname), '') FROM installations i WHERE i.id = d.machine_id),
  -- Otherwise keep as Unknown for now
  'Unknown'
)
WHERE d.hostname = 'Unknown';

-- Show current devices to verify
SELECT 
  d.hostname,
  d.machine_id,
  d.os_version,
  dp.cpu_model,
  dp.gpu_model,
  dp.ram_total_gb
FROM devices d
LEFT JOIN device_profiles dp ON dp.device_id = d.id;
