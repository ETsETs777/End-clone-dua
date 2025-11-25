@echo off
chcp 65001 >nul
cls
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║        🚀 ПОЛНАЯ АВТОМАТИЧЕСКАЯ УСТАНОВКА 🚀                        ║
echo ║                                                                      ║
echo ║              English Learning Assistant v2.0                         ║
echo ║              Powered by GigaChat AI                                  ║
echo ║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
echo.
echo.

:: Проверка прав администратора
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  ТРЕБУЮТСЯ ПРАВА АДМИНИСТРАТОРА!
    echo.
    echo Пожалуйста, запустите этот файл от имени администратора:
    echo   Правый клик → Запуск от имени администратора
    echo.
    pause
    exit /b 1
)

echo ════════════════════════════════════════════════════════════════════════
echo  ШАГ 1/8: ПРОВЕРКА NODE.JS
echo ════════════════════════════════════════════════════════════════════════
echo.

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node.js уже установлен!
    node --version
    npm --version
    goto :skip_node_install
)

echo ⚠️  Node.js не найден. Начинаем установку...
echo.

:: Определяем архитектуру системы
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set ARCH=x64
) else (
    set ARCH=x86
)

echo 📥 Скачивание Node.js LTS (v20.10.0) для %ARCH%...
echo.

:: Создаем временную папку
set TEMP_DIR=%TEMP%\nodejs_installer
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

:: URL для скачивания
set NODE_URL=https://nodejs.org/dist/v20.10.0/node-v20.10.0-%ARCH%.msi
set NODE_FILE=%TEMP_DIR%\nodejs_installer.msi

:: Скачиваем с помощью PowerShell
echo Скачивание началось... (это займет 1-3 минуты)
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_FILE%' -UseBasicParsing}"

if not exist "%NODE_FILE%" (
    echo ❌ Ошибка скачивания!
    echo.
    echo Пожалуйста, установите Node.js вручную:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js скачан!
echo.
echo 📦 Устанавливаем Node.js...
echo    (Откроется установщик - следуйте инструкциям)
echo.

:: Запускаем установщик
start /wait msiexec /i "%NODE_FILE%" /qb /norestart

:: Проверяем установку
timeout /t 5 /nobreak >nul

:: Обновляем PATH
call refreshenv >nul 2>&1

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Node.js установлен, но требуется перезапуск терминала!
    echo.
    echo ЗАКРОЙТЕ это окно и запустите скрипт снова!
    echo.
    pause
    exit /b 0
)

echo ✅ Node.js успешно установлен!
node --version
npm --version

:: Очистка
rmdir /s /q "%TEMP_DIR%" 2>nul

:skip_node_install
echo.
echo.

echo ════════════════════════════════════════════════════════════════════════
echo  ШАГ 2/8: ПРОВЕРКА GIT (опционально)
echo ════════════════════════════════════════════════════════════════════════
echo.

where git >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Git установлен
    git --version
) else (
    echo ⚠️  Git не найден (не критично)
    echo    Вы можете установить позже: https://git-scm.com/
)
echo.
echo.

echo ════════════════════════════════════════════════════════════════════════
echo  ШАГ 3/8: НАСТРОЙКА ПРОЕКТА
echo ════════════════════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"
echo 📁 Рабочая папка: %CD%
echo.
echo.

echo ════════════════════════════════════════════════════════════════════════
echo  ШАГ 4/8: СОЗДАНИЕ .ENV ФАЙЛА
echo ════════════════════════════════════════════════════════════════════════
echo.

if exist .env (
    echo ✅ Файл .env уже существует
    echo    Пропускаем создание...
) else (
    echo 📝 Создаём .env файл с GigaChat credentials...
    (
        echo # GigaChat API Configuration
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
        echo VITE_APP_VERSION=2.0.0
    ) > .env
    echo ✅ Файл .env создан!
)
echo.
echo.

echo ════════════════════════════════════════════════════════════════════════
echo  ШАГ 5/8: УСТАНОВКА ЗАВИСИМОСТЕЙ
echo ════════════════════════════════════════════════════════════════════════
echo.

if exist node_modules (
    echo ⚠️  Папка node_modules уже существует
    set /p reinstall="   Переустановить зависимости? (y/n): "
    if /i "%reinstall%"=="y" (
        echo.
        echo 🗑️  Удаляем старые зависимости...
        rmdir /s /q node_modules
        if exist package-lock.json del package-lock.json
        echo ✅ Удалено!
        goto :install_deps
    ) else (
        echo ✅ Используем существующие зависимости
        goto :skip_install
    )
)

:install_deps
echo 📦 Устанавливаем зависимости...
echo    (Это займет 2-5 минут, пожалуйста подождите...)
echo.
call npm install
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки зависимостей!
    echo.
    echo Попробуйте вручную:
    echo   npm install
    echo.
    pause
    exit /b 1
)
echo ✅ Зависимости установлены!

:skip_install
echo.
echo.

echo ════════════════════════════════════════════════════════════════════════
echo  ШАГ 6/8: ОЧИСТКА КЭША
echo ════════════════════════════════════════════════════════════════════════
echo.

if exist node_modules\.vite (
    echo 🗑️  Очищаем кэш Vite...
    rmdir /s /q node_modules\.vite 2>nul
    echo ✅ Кэш очищен!
) else (
    echo ✅ Кэш уже чист
)

if exist .vite (
    rmdir /s /q .vite 2>nul
)

echo.
echo.

echo ════════════════════════════════════════════════════════════════════════
echo  ШАГ 7/8: ПРОВЕРКА ФАЙЛОВ
echo ════════════════════════════════════════════════════════════════════════
echo.

set FILES_OK=1

if not exist package.json (
    echo ❌ package.json не найден!
    set FILES_OK=0
) else (
    echo ✅ package.json
)

if not exist vite.config.js (
    echo ❌ vite.config.js не найден!
    set FILES_OK=0
) else (
    echo ✅ vite.config.js
)

if not exist tailwind.config.js (
    echo ❌ tailwind.config.js не найден!
    set FILES_OK=0
) else (
    echo ✅ tailwind.config.js
)

if not exist postcss.config.js (
    echo ❌ postcss.config.js не найден!
    set FILES_OK=0
) else (
    echo ✅ postcss.config.js
)

if not exist src\main.jsx (
    echo ❌ src\main.jsx не найден!
    set FILES_OK=0
) else (
    echo ✅ src\main.jsx
)

if not exist src\index.css (
    echo ❌ src\index.css не найден!
    set FILES_OK=0
) else (
    echo ✅ src\index.css
)

if not exist .env (
    echo ⚠️  .env файл отсутствует (будет создан)
) else (
    echo ✅ .env
)

if %FILES_OK% equ 0 (
    echo.
    echo ❌ Некоторые критичные файлы отсутствуют!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Все необходимые файлы на месте!
echo.
echo.

echo ════════════════════════════════════════════════════════════════════════
echo  ШАГ 8/8: ЗАПУСК ПРИЛОЖЕНИЯ
echo ════════════════════════════════════════════════════════════════════════
echo.

echo 🚀 Запускаем сервер разработки...
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║                     ПРИЛОЖЕНИЕ ЗАПУСКАЕТСЯ!                          ║
echo ║                                                                      ║
echo ║  📱 URL:           http://localhost:3000                            ║
echo ║  🌐 Откроется:     Автоматически в браузере                         ║
echo ║  ⌨️  Остановка:     Ctrl + C                                        ║
echo ║                                                                      ║
echo ║  ✨ Новый интерфейс с градиентами и анимациями                      ║
echo ║  🤖 GigaChat API интегрирован                                       ║
echo ║  🎮 Геймификация с заданиями и наградами                            ║
echo ║  🎤 Практика произношения с AI                                      ║
echo ║  💾 Система прогресса и экспорт данных                              ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo 💡 ГОРЯЧИЕ КЛАВИШИ:
echo    Alt + H  →  Главная
echo    Alt + C  →  Чат с ИИ
echo    Alt + V  →  Словарь
echo    Alt + G  →  Грамматика
echo    Alt + E  →  Упражнения
echo    Alt + ?  →  Показать все горячие клавиши
echo.
echo 🔄 В БРАУЗЕРЕ: Нажмите Ctrl+Shift+R для жесткой перезагрузки
echo.
echo ════════════════════════════════════════════════════════════════════════
echo.

:: Запуск с автоматическим открытием браузера
call npm run dev

:: Если запуск не удался
if %errorlevel% neq 0 (
    echo.
    echo ❌ Ошибка запуска сервера!
    echo.
    echo Попробуйте вручную:
    echo   1. npm install
    echo   2. npm run dev
    echo.
    pause
    exit /b 1
)

