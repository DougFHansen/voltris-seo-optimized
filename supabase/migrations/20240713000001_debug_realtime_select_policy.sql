-- Policy temporária para debug do realtime
CREATE POLICY "Debug realtime select" ON orders FOR SELECT USING (true); 