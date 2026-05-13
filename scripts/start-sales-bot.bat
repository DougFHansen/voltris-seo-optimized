@echo off
chcp 65001 >nul
title Voltris Sales Bot - Telegram
color 0A

REM Navegar para a pasta onde este arquivo está
REM Isso garante que funcione mesmo clicando duplo em qualquer lugar
cd /d "%~dp0"

echo ==========================================
echo    VOLTRIS SALES BOT - TELEGRAM
echo ==========================================
echo.
echo Iniciando envio automatico de vendas...
echo Intervalo: a cada 5 minutos
echo.
echo Para parar, pressione Ctrl+C
echo.
echo ==========================================
echo.

node telegram-sales-bot.js

pause
