-- ============================================================
-- VOLTRIS - LICENSE COUNTER SYNC FIX
-- Garante que o contador 'devices_in_use' da tabela 'licenses' 
-- esteja sempre sincronizado com a tabela 'license_devices'.
-- ============================================================

-- 1. Função para atualizar o contador de dispositivos em uso
CREATE OR REPLACE FUNCTION public.sync_license_device_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.licenses 
        SET devices_in_use = (SELECT count(*) FROM public.license_devices WHERE license_id = NEW.license_id),
            activated_at = COALESCE(activated_at, NOW())
        WHERE id = NEW.license_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.licenses 
        SET devices_in_use = (SELECT count(*) FROM public.license_devices WHERE license_id = OLD.license_id)
        WHERE id = OLD.license_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar a trigger na tabela license_devices
DROP TRIGGER IF EXISTS tr_sync_license_device_count ON public.license_devices;
CREATE TRIGGER tr_sync_license_device_count
AFTER INSERT OR DELETE ON public.license_devices
FOR EACH ROW
EXECUTE FUNCTION public.sync_license_device_count();

-- 3. Sincronizar dados existentes (opcional, mas recomendado para corrigir o 0/1 atual)
UPDATE public.licenses l
SET devices_in_use = (
    SELECT count(*) 
    FROM public.license_devices ld 
    WHERE ld.license_id = l.id
);

-- 4. Adicionar nota ao log de auditoria
INSERT INTO public.audit_logs (event_type, metadata)
VALUES ('SYSTEM_FIX', '{"description": "Sincronização de contagem de dispositivos de licença implementada via trigger"}');
