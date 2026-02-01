import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Cable Management: Guia Básico para Esconder Cabos do PC - Voltris";
const description = "Seu setup parece um ninho de rato? Dicas simples usando velcro, canaletas e fita dupla face para organizar os cabos embaixo da mesa.";
const keywords = ['organizar cabos pc', 'cable management dicas', 'esconder fios setup', 'canaleta para cabos', 'organizador cabos mesa'];

export const metadata: Metadata = createGuideMetadata('cable-management-organizacao-cabos-pc', title, description, keywords);

export default function CableGuide() {
    const summaryTable = [
        { label: "Custo", value: "Baixo" },
        { label: "Estética", value: "Alta" }
    ];

    const contentSections = [
        {
            title: "Regra 1: Velcro é melhor que Enforca-Gato",
            content: `
        <p class="mb-4">Nunca use abraçadeiras de plástico (enforca-gato) definitivas. Você VAI precisar tirar um cabo um dia e vai ter que cortar tudo. Use fitas de velcro reutilizáveis.</p>
      `,
            subsections: []
        },
        {
            title: "O Truque da Fita Dupla Face",
            content: `
        <p class="text-gray-300">Cole seu Filtro de Linha embaixo da mesa (virado para baixo) com fita dupla face 3M forte. Assim, todos os cabos de energia sobem direto para a mesa e não ficam arrastando no chão. Só sobra um fio indo para a tomada.</p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
