#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Função para adicionar imports necessários
function addMissingImports(content, filePath) {
  const missingImports = [];
  
  // Verificar imports necessários baseado no conteúdo
  if (content.includes('motion') && !content.includes('import { motion }')) {
    missingImports.push('import { motion } from "framer-motion";');
  }
  
  if (content.includes('AnimatePresence') && !content.includes('import { AnimatePresence }')) {
    missingImports.push('import { AnimatePresence } from "framer-motion";');
  }
  
  if (content.includes('FiCheckCircle') && !content.includes('FiCheckCircle')) {
    missingImports.push('import { FiCheckCircle } from "react-icons/fi";');
  }
  
  if (content.includes('FiClock') && !content.includes('FiClock')) {
    missingImports.push('import { FiClock } from "react-icons/fi";');
  }
  
  if (content.includes('FiAlertCircle') && !content.includes('FiAlertCircle')) {
    missingImports.push('import { FiAlertCircle } from "react-icons/fi";');
  }
  
  if (content.includes('FiPlus') && !content.includes('FiPlus')) {
    missingImports.push('import { FiPlus } from "react-icons/fi";');
  }
  
  if (content.includes('FiTrash2') && !content.includes('FiTrash2')) {
    missingImports.push('import { FiTrash2 } from "react-icons/fi";');
  }
  
  if (content.includes('FiShoppingCart') && !content.includes('FiShoppingCart')) {
    missingImports.push('import { FiShoppingCart } from "react-icons/fi";');
  }
  
  if (content.includes('CheckCircle') && !content.includes('CheckCircle')) {
    missingImports.push('import { CheckCircle } from "lucide-react";');
  }
  
  if (content.includes('Star') && !content.includes('Star')) {
    missingImports.push('import { Star } from "lucide-react";');
  }
  
  if (content.includes('Users') && !content.includes('Users')) {
    missingImports.push('import { Users } from "lucide-react";');
  }
  
  if (content.includes('Clock') && !content.includes('Clock')) {
    missingImports.push('import { Clock } from "lucide-react";');
  }
  
  if (content.includes('Shield') && !content.includes('Shield')) {
    missingImports.push('import { Shield } from "lucide-react";');
  }
  
  if (content.includes('Zap') && !content.includes('Zap')) {
    missingImports.push('import { Zap } from "lucide-react";');
  }
  
  if (content.includes('Smartphone') && !content.includes('Smartphone')) {
    missingImports.push('import { Smartphone } from "lucide-react";');
  }
  
  if (content.includes('Code') && !content.includes('Code')) {
    missingImports.push('import { Code } from "lucide-react";');
  }
  
  if (content.includes('Globe') && !content.includes('Globe')) {
    missingImports.push('import { Globe } from "lucide-react";');
  }
  
  if (content.includes('Palette') && !content.includes('Palette')) {
    missingImports.push('import { Palette } from "lucide-react";');
  }
  
  if (content.includes('Target') && !content.includes('Target')) {
    missingImports.push('import { Target } from "lucide-react";');
  }
  
  if (content.includes('MonitorSmartphone') && !content.includes('MonitorSmartphone')) {
    missingImports.push('import { MonitorSmartphone } from "lucide-react";');
  }
  
  if (content.includes('Award') && !content.includes('Award')) {
    missingImports.push('import { Award } from "lucide-react";');
  }
  
  if (content.includes('MapPin') && !content.includes('MapPin')) {
    missingImports.push('import { MapPin } from "lucide-react";');
  }
  
  if (content.includes('Gamepad2') && !content.includes('Gamepad2')) {
    missingImports.push('import { Gamepad2 } from "lucide-react";');
  }
  
  if (content.includes('AlertTriangle') && !content.includes('AlertTriangle')) {
    missingImports.push('import { AlertTriangle } from "lucide-react";');
  }
  
  // Adicionar imports se necessário
  if (missingImports.length > 0) {
    const importLines = missingImports.join('\n');
    const firstImportIndex = content.indexOf('import');
    if (firstImportIndex !== -1) {
      const beforeImports = content.substring(0, firstImportIndex);
      const afterImports = content.substring(firstImportIndex);
      content = beforeImports + importLines + '\n' + afterImports;
    } else {
      content = importLines + '\n' + content;
    }
  }
  
  return content;
}

// Função para remover variáveis não utilizadas
function removeUnusedVariables(content) {
  // Remover variáveis não utilizadas comuns
  const unusedPatterns = [
    /const\s+(\w+)\s*=\s*useState\([^)]*\);\s*\/\/\s*unused/gi,
    /const\s+(\w+)\s*=\s*useState\([^)]*\);\s*\/\/\s*TODO/gi,
    /const\s+(\w+)\s*=\s*useState\([^)]*\);\s*\/\/\s*temp/gi,
  ];
  
  unusedPatterns.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  return content;
}

// Função para corrigir tipos any
function fixAnyTypes(content) {
  content = content.replace(/: any/g, ': unknown');
  content = content.replace(/: any\[\]/g, ': unknown[]');
  content = content.replace(/any\[\]/g, 'unknown[]');
  return content;
}

// Função para processar arquivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Adicionar imports necessários
    const contentWithImports = addMissingImports(content, filePath);
    if (contentWithImports !== content) {
      content = contentWithImports;
      modified = true;
    }
    
    // Remover variáveis não utilizadas
    const contentWithoutUnused = removeUnusedVariables(content);
    if (contentWithoutUnused !== content) {
      content = contentWithoutUnused;
      modified = true;
    }
    
    // Corrigir tipos any
    const contentWithFixedTypes = fixAnyTypes(content);
    if (contentWithFixedTypes !== content) {
      content = contentWithFixedTypes;
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

// Executar correções avançadas
console.log('🔧 Iniciando correções avançadas...');

const directories = ['./app', './components', './utils'];
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processando: ${dir}`);
    processDirectory(dir);
  }
});

console.log('✅ Correções avançadas concluídas!');
console.log('\n📋 Próximos passos recomendados:');
console.log('1. Execute: npm run lint');
console.log('2. Execute: npm run build');
console.log('3. Teste o site em diferentes dispositivos');
console.log('4. Verifique a acessibilidade com ferramentas como axe-core');
console.log('5. Teste a performance com Lighthouse'); 