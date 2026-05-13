@echo off
chcp 65001 >nul
title Voltris Sales Bot - Telegram
color 0A

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
