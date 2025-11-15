@echo off
REM Batch скрипт для автоматического создания .env файла
REM Автоматическая настройка GigaChat API

echo ========================================
echo   GigaChat API - Автоматическая настройка
echo ========================================
echo.

REM Проверяем существование .env
if exist .env (
    echo WARNING: Файл .env уже существует!
    set /p response="Перезаписать? (y/n): "
    if /i not "%response%"=="y" (
        echo Отменено
        exit /b
    )
)

REM Создаем .env файл
(
echo # GigaChat API Configuration - Автоматически настроено
echo VITE_GIGACHAT_CLIENT_ID=019a81d2-9f7c-7429-a7eb-f240038d4d22
echo VITE_GIGACHAT_CLIENT_SECRET=580f330d-4678-48a3-90b4-7267226dd87e
echo VITE_GIGACHAT_AUTH_TOKEN=MDE5YTgxZDItOWY3Yy03NDI5LWE3ZWItZjI0MDAzOGQ0ZDIyOjU4MGYzMzBkLTQ2NzgtNDhhMy05MGI0LTcyNjcyNmRkODc0ZQ==
echo VITE_GIGACHAT_SCOPE=GIGACHAT_API_PERS
echo.
echo # GigaChat API Endpoints
echo VITE_GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
echo VITE_GIGACHAT_API_URL=https://gigachat.devices.sberbank.ru/api/v1
echo.
echo # Application Configuration
echo VITE_APP_NAME=English Learning Assistant
echo VITE_APP_VERSION=1.0.0
) > .env

echo.
echo ✓ Файл .env успешно создан!
echo.
echo Следующие шаги:
echo   1. Установите Node.js (если не установлен): https://nodejs.org/
echo   2. Выполните: npm install
echo   3. Запустите: npm run dev
echo   4. Откройте: http://localhost:3000
echo.
echo Приложение готово к запуску с GigaChat API!
echo.
pause


