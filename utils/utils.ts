// Versão simplificada sem dependências extras (clsx, tailwind-merge)
export function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(" ");
}
