-- Tabela de Comandos Remotos
CREATE TABLE IF NOT EXISTS device_commands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    installation_id UUID NOT NULL REFERENCES installations(id),
    command_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, grabbed, completed, failed
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    executed_at TIMESTAMPTZ,
    result_data JSONB
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_device_commands_installation_id ON device_commands(installation_id);
CREATE INDEX IF NOT EXISTS idx_device_commands_status ON device_commands(status);

-- RLS (Segurança)
ALTER TABLE device_commands ENABLE ROW LEVEL SECURITY;

-- Política: Usuário autenticado pode criar comandos para suas próprias instalações
CREATE POLICY "Users can insert commands for their own installations"
ON device_commands FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM installations 
        WHERE installations.id = device_commands.installation_id 
        AND installations.user_id = auth.uid()
    )
);

-- Política: Usuário pode ver histórico de comandos
CREATE POLICY "Users can view commands for their own installations"
ON device_commands FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM installations 
        WHERE installations.id = device_commands.installation_id 
        AND installations.user_id = auth.uid()
    )
);

-- Nota: O App Desktop acessa via API Service Role no endpoint /api/v1/commands/, então bypassa RLS
