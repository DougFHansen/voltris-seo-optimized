import { Metadata } from 'next';
import { createGuideMetadata } from '@/components/GuideTemplate';

export const title = "Diagnóstico de Hardware e Monitoramento de Temperatura PC (2026)";
export const description = "O seu PC está esquentando? Aprenda a monitorar a temperatura da CPU e GPU, verificar a saúde do SSD e diagnosticar problemas de hardware com o Voltris Diagnostic.";

export const keywords = [
    'monitorar temperatura cpu gpu',
    'testar saude hd ssd windows',
    'voltris diagnostic hardware pc',
    'monitoramento de temperatura em jogos',
    'identificar peca defeituosa pc gamer',
    'como testar memoria ram windows 11',
    'temperatura ideal processador intel amd',
    'saude ssd crystaldiskinfo vs voltris'
];

export const metadata: Metadata = createGuideMetadata('diagnostico-hardware-temperatura-pc', title, description, keywords);
