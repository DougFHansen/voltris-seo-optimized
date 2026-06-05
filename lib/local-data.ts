export const LOCAL_FAQS = [
  { q: "O atendimento de TI remoto funciona para empresas e residências em {cidade}?", a: "Sim. Nossa tecnologia proprietária de acesso seguro nos permite diagnosticar e resolver problemas de lentidão, rede e performance de computadores em {cidade} sem a necessidade de deslocamento físico." },
  { q: "Quais os serviços de informática mais procurados em {estado}?", a: "Nossos clientes em {estado} costumam solicitar otimização de PC Gamer para ganho de FPS, remoção de vírus e malwares, formatação limpa do Windows 11 e configuração avançada de roteadores." },
  { q: "Quanto tempo demora para um técnico de informática resolver meu problema em {cidade}?", a: "Graças ao nosso modelo remoto de elite, 90% dos chamados de {cidade} são iniciados em menos de 15 minutos e concluídos no mesmo dia." },
  { q: "Posso pagar o conserto do PC com PIX estando em {cidade}?", a: "Sim! Aceitamos pagamentos via PIX, cartões de crédito e boleto bancário para todos os nossos serviços em {cidade} e região metropolitana." },
  { q: "O suporte técnico da Voltris atende computadores Apple (Mac) em {estado}?", a: "Nosso foco principal e especialidade máxima de engenharia em {estado} é em sistemas Windows (10 e 11). Não realizamos suporte em macOS ou Linux." },
  { q: "É seguro permitir acesso remoto ao meu computador em {cidade}?", a: "Absolutamente seguro. Utilizamos protocolos criptografados ponta a ponta e você acompanha tudo o que o técnico realiza na sua tela, garantindo privacidade total dos seus dados em {cidade}." },
  { q: "Vocês realizam troca de peças de hardware físicas em {cidade}?", a: "Como nosso laboratório de diagnóstico é focado em software e otimização de performance profunda, não realizamos troca de placas, memórias ou telas físicas em {cidade}." },
  { q: "Como contrato o pacote Voltris Optimizer estando em {cidade}?", a: "O Voltris Optimizer é um software digital que pode ser adquirido diretamente pelo nosso site e instalado instantaneamente em qualquer PC de {cidade} para aumento drástico de FPS." }
];

export const REGIONAL_CONTEXTS = [
  {
    title: "Necessidades Comuns na Região",
    desc: "A alta demanda tecnológica de {cidade} exige sistemas que não travam. Nossos analistas focam em resolver lentidão em ambientes corporativos e estabilizar FPS para o cenário gamer local."
  },
  {
    title: "Perfil de Atendimento",
    desc: "A maioria dos nossos clientes em {estado} buscam performance pura. Desde streamers precisando de otimização de OBS até escritórios necessitando de segurança de rede."
  },
  {
    title: "Vantagem do Suporte Digital",
    desc: "Evite o trânsito de {cidade} e o risco de deixar seu equipamento em assistências físicas por dias. O diagnóstico remoto entrega seu computador pronto na hora."
  },
  {
    title: "Foco em Segurança de Dados",
    desc: "Entendemos que empresas e usuários em {cidade} valorizam a privacidade. Nossas auditorias de vírus e malwares seguem normas internacionais de segurança."
  }
];

// Helper to deterministically pick N items from array based on a string seed
export function getDeterministicItems<T>(arr: T[], seedStr: string, count: number): T[] {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0; 
  }
  
  const result: T[] = [];
  const available = [...arr];
  
  for (let i = 0; i < count; i++) {
    // Generate pseudo-random index based on hash + i
    const rand = Math.abs(Math.sin(hash + i + 1)) * 10000;
    const index = Math.floor(rand) % available.length;
    result.push(available.splice(index, 1)[0]);
  }
  
  return result;
}
