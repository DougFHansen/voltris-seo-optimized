'use client';

/**
 * ETAPA DE COMPLEMENTAÇÃO DO PERFIL.
 *
 * Ela é a mesma página `/perfil` que já existia (editar dados), com duas
 * upgrades que a missão exigiu:
 *
 *  1. PASSA A COBRIR TAMBÉM `login` e `neighborhood` — eram exatamente os
 *     dois campos que o trigger quebrado nunca gravou. Sem eles a ficha do
 *     cliente no painel aparecia incompleta.
 *  2. USA AS MESMAS REGRAS DO CADASTRO (`lib/signup-rules.ts`). Não existe
 *     "validação do perfil" diferente da do cadastro: os dois caminhos
 *     aceitam exatamente o mesmo conjunto de dados.
 *
 * Quem chega aqui:
 *  - conta social (Google) sem os campos obrigatórios → é trazida pelo
 *    AuthGuard e fica presa aqui até completar;
 *  - qualquer cliente que abre "Meu Perfil" para conferir/corrigir dados.
 *
 * A gravação é feita com a sessão do próprio usuário (RLS: atualizar o
 * próprio perfil) e a resposta é conferida: update sem erro E sem linha
 * é falha, e a tela diz isso — não finge que salvou.
 */

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import { motion } from 'framer-motion';
import {
    User, Phone, MapPin, CheckCircle, Loader2, AlertCircle, ArrowRight, Hash, Home,
} from 'lucide-react';
import {
    validateLoginValue,
    validateSignupStep2,
    validateSignupStep3,
} from '@/lib/signup-rules';
import { perfilCompleto, rotulosFaltantes, separarEndereco } from '@/lib/profile-completeness';

interface FormState {
    login: string;
    full_name: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
}

const FORM_VAZIO: FormState = {
    login: '',
    full_name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
};

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>}>
            <ProfileContent />
        </Suspense>
    );
}

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, profile, loading, refreshAuth } = useAuth();
    const [form, setForm] = useState<FormState>(FORM_VAZIO);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');
    const [isChecking, setIsChecking] = useState(true);
    const [cepLoading, setCepLoading] = useState(false);
    const [cepValid, setCepValid] = useState(false);
    const [manualAddress, setManualAddress] = useState(false);
    const supabase = createClient();

    const destino = searchParams.get('redirect') || '/dashboard';
    const forcar = searchParams.get('force') === '1';

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace('/login');
            return;
        }
        if (profile) {
            const { street, number } = separarEndereco(profile.address);
            // Perfil já completo e o usuário não veio forçado: devolve.
            if (perfilCompleto(profile) && !forcar) {
                router.replace(destino);
                return;
            }
            setForm({
                login: profile.login || '',
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                cep: profile.cep || '',
                street,
                number,
                neighborhood: profile.neighborhood || '',
                city: profile.city || '',
                state: profile.state || '',
            });
            // Endereço já salvo e completo: não exige nova consulta ao CEP.
            if (profile.cep && profile.address && profile.neighborhood) {
                setCepValid(true);
            }
        }
        setIsChecking(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile, loading, user]);

    const faltando = rotulosFaltantes(profile);

    // ---- Máscaras -------------------------------------------------------
    const formatPhone = (value: string) => {
        const n = value.replace(/\D/g, '');
        if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        return n.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    };
    const formatCEP = (value: string) => {
        const n = value.replace(/\D/g, '');
        return n.length <= 8 ? n.replace(/(\d{5})(\d{0,3})/, '$1-$2') : value;
    };

    // ---- CEP: consulta real ao ViaCEP ------------------------------------
    const handleCepChange = async (value: string) => {
        const formatted = formatCEP(value);
        setForm((f) => ({ ...f, cep: formatted }));
        setCepValid(false);
        setAviso('');

        const clean = formatted.replace(/\D/g, '');
        if (clean.length !== 8) return;

        setCepLoading(true);
        try {
            const res = await fetch('/api/v1/auth/validate-cep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cep: clean }),
            });
            const json = await res.json();
            if (json.valid && json.data) {
                setForm((f) => ({
                    ...f,
                    cep: formatted,
                    street: f.street || json.data.street || '',
                    neighborhood: f.neighborhood || json.data.neighborhood || '',
                    city: f.city || json.data.city || '',
                    state: f.state || json.data.state || '',
                }));
                setCepValid(true);
                setManualAddress(false);
            } else {
                setAviso(json.error || 'CEP não encontrado. Você pode digitar o endereço manualmente.');
            }
        } catch {
            setAviso('Não foi possível consultar o CEP agora. Digite o endereço manualmente.');
        } finally {
            setCepLoading(false);
        }
    };

    // ---- Validação (as MESMAS regras do cadastro) ------------------------
    const validar = (): string | null => {
        const erroLogin = validateLoginValue(form.login);
        if (erroLogin) return erroLogin;

        const erroPessoal = validateSignupStep2({ fullName: form.full_name, phone: form.phone });
        if (erroPessoal) return erroPessoal;

        const erroEndereco = validateSignupStep3({
            cep: form.cep,
            street: form.street,
            number: form.number,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
            cepValid,
            manualAddress,
        });
        if (erroEndereco) return erroEndereco;

        return null;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setAviso('');

        const erro = validar();
        if (erro) {
            setError(erro);
            return;
        }

        setSaving(true);
        try {
            if (!user) throw new Error('Usuário não autenticado');

            // Disponibilidade real: usuário e WhatsApp não podem estar em uso.
            const check = await fetch('/api/v1/auth/check-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login: form.login.trim(),
                    phone: form.phone.replace(/\D/g, ''),
                }),
            });
            const disponibilidade = await check.json().catch(() => null);
            if (disponibilidade && disponibilidade.available === false) {
                setSaving(false);
                setError(disponibilidade.error || 'Este usuário ou WhatsApp já está em uso.');
                return;
            }

            const { data: salvo, error: updateError } = await supabase
                .from('profiles')
                .update({
                    login: form.login.trim(),
                    full_name: form.full_name.trim(),
                    phone: form.phone.trim(),
                    address: `${form.street.trim()}, ${form.number.trim()}`,
                    city: form.city.trim(),
                    neighborhood: form.neighborhood.trim(),
                    state: form.state.trim().toUpperCase(),
                    cep: form.cep.trim(),
                })
                .eq('id', user.id)
                .select('id')
                .maybeSingle();

            if (updateError) {
                setError(updateError.message || 'Não foi possível salvar o perfil.');
                setSaving(false);
                return;
            }
            if (!salvo) {
                // Update sem erro e sem linha: a gravação não aconteceu.
                setError('Não foi possível salvar o perfil (a atualização não retornou a sua conta). Tente novamente.');
                setSaving(false);
                return;
            }

            await refreshAuth();
            router.replace(destino);
        } catch (err: any) {
            setError(err?.message || 'Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    if (loading || isChecking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    const campo = (
        label: string,
        name: keyof FormState,
        opts: { icon?: React.ReactNode; maxLength?: number; upper?: boolean } = {}
    ) => (
        <div className="space-y-2">
            <label className="text-sm text-gray-700">{label}</label>
            <div className="relative group">
                {opts.icon}
                <input
                    type="text"
                    name={name}
                    maxLength={opts.maxLength}
                    value={form[name]}
                    onChange={(e) => {
                        const v = opts.upper ? e.target.value.toUpperCase() : e.target.value;
                        setForm((f) => ({ ...f, [name]: v }));
                    }}
                    className={`w-full bg-gray-100 border border-gray-200 rounded-xl py-3 text-gray-900 focus:outline-none focus:border-blue-300 transition-all placeholder:text-gray-400 ${opts.icon ? 'pl-11 pr-4' : 'px-4'}`}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 relative flex items-center justify-center overflow-hidden py-12 px-4 font-sans">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')] opacity-5 pointer-events-none"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="bg-white/90 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-lg overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"></div>

                    <div className="p-8 md:p-12">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 mb-6 shadow-md">
                                <User className="w-8 h-8 text-purple-600" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Complete seu perfil</h1>
                            <p className="text-gray-600 text-lg">
                                Estes dados são obrigatórios e usados para emitir a licença, a fatura e o suporte.
                            </p>
                        </div>

                        {faltando.length > 0 && (
                            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                                <strong>Falta:</strong> {faltando.join(', ')}.
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-200 text-red-600 flex items-center gap-3" role="alert">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {aviso && (
                            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm" role="status">
                                {aviso}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Dados Pessoais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {campo('Usuário (login)', 'login', {
                                        icon: <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />,
                                    })}
                                    {campo('Nome Completo', 'full_name', {
                                        icon: <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />,
                                    })}
                                    {campo('WhatsApp / Celular', 'phone', {
                                        icon: <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />,
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Endereço</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-1/3 space-y-2">
                                            <label className="text-sm text-gray-700">CEP</label>
                                            <div className="relative">
                                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="cep"
                                                    value={form.cep}
                                                    onChange={(e) => handleCepChange(e.target.value)}
                                                    className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-900 focus:outline-none focus:border-blue-300 transition-all placeholder:text-gray-400"
                                                    placeholder="00000-000"
                                                />
                                                {cepLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 animate-spin" />}
                                            </div>
                                        </div>
                                        <div className="w-2/3 space-y-2">
                                            {campo('Cidade', 'city')}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-3/4 space-y-2">
                                            {campo('Rua / Logradouro', 'street', {
                                                icon: <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />,
                                            })}
                                        </div>
                                        <div className="w-1/4 space-y-2">
                                            {campo('Número', 'number', {
                                                icon: <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />,
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-2/3 space-y-2">
                                            {campo('Bairro', 'neighborhood')}
                                        </div>
                                        <div className="w-1/3 space-y-2">
                                            {campo('UF', 'state', { maxLength: 2, upper: true })}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setManualAddress(true);
                                            setCepValid(false);
                                            setForm((f) => ({ ...f, cep: '', street: '', number: '', neighborhood: '', city: '', state: '' }));
                                        }}
                                        className="text-[11px] text-pink-600 font-bold uppercase tracking-widest hover:underline"
                                    >
                                        Corrigir CEP / Digitar Manualmente
                                    </button>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center justify-end gap-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-md flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                    <span>{saving ? 'Salvando...' : 'Salvar e continuar'}</span>
                                    {!saving && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
