# PowerShell Script для автоматического создания .env файла
# Автоматическая настройка GigaChat API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GigaChat API - Автоматическая настройка" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем существование .env
if (Test-Path ".env") {
    Write-Host "⚠️  Файл .env уже существует!" -ForegroundColor Yellow
    $response = Read-Host "Перезаписать? (y/n)"
    if ($response -ne "y") {
        Write-Host "❌ Отменено" -ForegroundColor Red
        exit
    }
}

# Создаем .env файл с вашими данными
$envContent = @"
# GigaChat API Configuration - Автоматически настроено
VITE_GIGACHAT_CLIENT_ID=019a81d2-9f7c-7429-a7eb-f240038d4d22
VITE_GIGACHAT_CLIENT_SECRET=580f330d-4678-48a3-90b4-7267226dd87e
VITE_GIGACHAT_AUTH_TOKEN=MDE5YTgxZDItOWY3Yy03NDI5LWE3ZWItZjI0MDAzOGQ0ZDIyOjU4MGYzMzBkLTQ2NzgtNDhhMy05MGI0LTcyNjcyNmRkODc0ZQ==
VITE_GIGACHAT_SCOPE=GIGACHAT_API_PERS

# GigaChat API Endpoints
VITE_GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
VITE_GIGACHAT_API_URL=https://gigachat.devices.sberbank.ru/api/v1

# Application Configuration
VITE_APP_NAME=English Learning Assistant
VITE_APP_VERSION=1.0.0
"@

# Записываем в файл
Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host ""
Write-Host "✅ Файл .env успешно создан!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
Write-Host "  1. Установите Node.js (если не установлен): https://nodejs.org/" -ForegroundColor White
Write-Host "  2. Выполните: npm install" -ForegroundColor White
Write-Host "  3. Запустите: npm run dev" -ForegroundColor White
Write-Host "  4. Откройте: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Приложение готово к запуску с GigaChat API!" -ForegroundColor Green
Write-Host ""


