-- Corrigir trigger de cadastro para garantir que todos os campos sejam salvos
-- Remover trigger antiga
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover função antiga
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Criar função corrigida para criar perfil ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Debug: log dos dados recebidos
    RAISE NOTICE 'Criando perfil para usuário: %', NEW.id;
    RAISE NOTICE 'Dados recebidos: login=%, full_name=%, phone=%, address=%, city=%, neighborhood=%, state=%, cep=%', 
        NEW.raw_user_meta_data->>'login',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'address',
        NEW.raw_user_meta_data->>'city',
        NEW.raw_user_meta_data->>'neighborhood',
        NEW.raw_user_meta_data->>'state',
        NEW.raw_user_meta_data->>'cep';
    
    INSERT INTO public.profiles (
        id,
        login,
        email,
        full_name,
        phone,
        address,
        city,
        neighborhood,
        state,
        cep,
        is_admin,
        role
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'login', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'address', ''),
        COALESCE(NEW.raw_user_meta_data->>'city', ''),
        COALESCE(NEW.raw_user_meta_data->>'neighborhood', ''),
        COALESCE(NEW.raw_user_meta_data->>'state', ''),
        COALESCE(NEW.raw_user_meta_data->>'cep', ''),
        false,
        'user'
    );
    
    RAISE NOTICE 'Perfil criado com sucesso para usuário: %', NEW.id;
    RETURN NEW;
END;
$$;

-- Criar a trigger para criar perfil ao criar usuário
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Garantir que as policies estejam corretas
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Permitir insert do próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;

-- Usuário pode ver o próprio perfil
CREATE POLICY "Usuários podem ver seus próprios perfis"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Admin pode ver todos os perfis (além do próprio)
CREATE POLICY "Admins podem ver todos os perfis"
    ON public.profiles
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles AS p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
      OR auth.uid() = id
    );

-- Usuário pode atualizar o próprio perfil
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Usuário pode inserir o próprio perfil
CREATE POLICY "Permitir insert do próprio perfil"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id); 