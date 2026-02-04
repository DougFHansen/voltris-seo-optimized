const fs = require('fs');
const path = require('path');

// Lê o conteúdo do arquivo
const filePath = path.join(__dirname, 'app', 'guias', 'teclado-desconfigurado-abnt2-ansi', 'page.tsx');
const content = fs.readFileSync(filePath, 'utf8');

// Tenta extrair a descrição usando o mesmo padrão do script
// Tenta extrair a descrição usando o mesmo padrão do script principal
const descriptionMatch = content.match(/const description = "(.*?)"/);

console.log('Conteúdo original da linha de descrição:');
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.includes('const description =')) {
        console.log(`Linha ${index + 1}: ${JSON.stringify(line)}`);
    }
});

console.log('\nExtração usando regex:');
if (descriptionMatch) {
    console.log('Valor extraído:', JSON.stringify(descriptionMatch[1]));
    console.log('Últimos 30 caracteres:', JSON.stringify(descriptionMatch[1].slice(-30)));
    
    // Testar o JSON.stringify como no script principal
    const escapedDescription = JSON.stringify(descriptionMatch[1]).slice(1, -1);
    console.log('Após JSON.stringify e remoção das aspas:', JSON.stringify(escapedDescription));
    
    // Testar como seria colocado no template literal
    const result = `{ slug: 'test', title: 'test', description: '${escapedDescription}', difficulty: 'Iniciante', time: '5 min' }`;
    console.log('Resultado final:', JSON.stringify(result));
} else {
    console.log('Padrão não encontrado!');
}