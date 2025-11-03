# Como Fazer Push para GitHub

## Se Git NÃO está instalado:

1. **Baixe e instale o Git:**
   - https://git-scm.com/download/win
   - Durante instalação, marque "Add Git to PATH"

2. **Depois de instalar, reinicie o PowerShell**

## Passos para fazer push:

```bash
# 1. Inicializar git (se ainda não tiver)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer commit
git commit -m "Update: Site otimizado para AdSense com todas as melhorias"

# 4. Adicionar repositório remoto
git remote add origin https://github.com/DougFHansen/voltris-seo-optimized.git

# 5. Fazer push
git push -u origin main
```

Se der erro na branch, tente:
```bash
git branch -M main
git push -u origin main
```

