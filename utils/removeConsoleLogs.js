// Utilitário para remover console.logs em produção
// Este arquivo pode ser usado em um script de build

const fs = require('fs');
const path = require('path');

function removeConsoleLogs(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      removeConsoleLogs(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remover console.log, console.error, console.warn, console.debug
      content = content.replace(/console\.(log|error|warn|debug)\([^)]*\);?/g, '');
      
      // Remover console.logs vazios
      content = content.replace(/console\.(log|error|warn|debug)\(\);?/g, '');
      
      fs.writeFileSync(filePath, content);
    }
  });
}

// Usar apenas em produção
if (process.env.NODE_ENV === 'production') {
  removeConsoleLogs('./app');
  removeConsoleLogs('./components');
  removeConsoleLogs('./utils');
}

module.exports = { removeConsoleLogs }; 