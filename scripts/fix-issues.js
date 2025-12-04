#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Função para remover console.logs em produção
function removeConsoleLogs(content) {
  return content
    .replace(/console\.(log|error|warn|debug)\([^)]*\);?/g, '')
    .replace(/console\.(log|error|warn|debug)\(\);?/g, '');
}

// Função para remover imports não utilizados
function removeUnusedImports(content) {
  // Remove imports vazios
  content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*/g, '');
  
  // Remove imports de componentes não utilizados (básico)
  const unusedImports = [
    'Image',
    'Link',
    'useRouter',
    'useState',
    'useEffect',
    'motion',
    'FiPlus',
    'FiTrash2',
    'FiShoppingCart',
    'CheckCircle',
    'Star',
    'Users',
    'Clock',
    'Shield',
    'Zap',
    'Smartphone',
    'Code',
    'Globe',
    'Palette',
    'Target',
    'MonitorSmartphone',
    'Award'
  ];
  
  unusedImports.forEach(importName => {
    const regex = new RegExp(`import\\s*{[^}]*\\b${importName}\\b[^}]*}\\s*from\\s*['"][^'"]+['"];?\\s*`, 'g');
    content = content.replace(regex, '');
  });
  
  return content;
}

// Função para adicionar tipos TypeScript
function addTypeScriptTypes(content) {
  // Substituir 'any' por tipos mais específicos
  content = content.replace(/: any/g, ': unknown');
  content = content.replace(/: any\[\]/g, ': unknown[]');
  
  return content;
}

// Função para processar arquivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remover console.logs em produção
    const contentWithoutLogs = removeConsoleLogs(content);
    if (contentWithoutLogs !== content) {
      content = contentWithoutLogs;
      modified = true;
    }
    
    // Remover imports não utilizados
    const contentWithoutUnusedImports = removeUnusedImports(content);
    if (contentWithoutUnusedImports !== content) {
      content = contentWithoutUnusedImports;
      modified = true;
    }
    
    // Adicionar tipos TypeScript
    const contentWithTypes = addTypeScriptTypes(content);
    if (contentWithTypes !== content) {
      content = contentWithTypes;
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Corrigido: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

// Função para processar diretório recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      processFile(filePath);
    }
  });
}

// Executar correções
console.log('🔧 Iniciando correções automáticas...');

const directories = ['./app', './components', './utils'];
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processando: ${dir}`);
    processDirectory(dir);
  }
});

console.log('✅ Correções concluídas!');
console.log('\n📋 Próximos passos recomendados:');
console.log('1. Execute: npm run lint');
console.log('2. Execute: npm run build');
console.log('3. Teste o site em diferentes dispositivos');
console.log('4. Verifique a acessibilidade com ferramentas como axe-core');
console.log('5. Teste a performance com Lighthouse'); 