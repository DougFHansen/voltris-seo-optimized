@echo off
echo ==========================================
echo    VOLTRIS DEPLOY AUTOMATION
echo ==========================================
echo.

echo [1/3] Adicionando arquivos ao stage...
git add .
if %errorlevel% neq 0 (
    echo Erro ao adicionar arquivos. Verifique se o Git esta instalado e no PATH.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Criando commit de auditoria...
git commit -m "Compliance Update: SEO Master & AdSense Isolation Audit"

echo.
echo [3/3] Enviando para o repositorio remoto...
echo ATENCAO: Uma janela de login pode se abrir agora.
git push

echo.
if %errorlevel% equ 0 (
    echo SUCESSO! Deploy enviado.
) else (
    echo Falha no push.
)

pause
