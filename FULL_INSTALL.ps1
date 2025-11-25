# PowerShell скрипт для полной автоматической установки
# English Learning Assistant v2.0

# Настройки
$ErrorActionPreference = "Stop"
$ProgressPreference = 'SilentlyContinue'

# Цвета
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Clear-Host
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                      ║" -ForegroundColor Cyan
Write-Host "║        🚀 ПОЛНАЯ АВТОМАТИЧЕСКАЯ УСТАНОВКА 🚀                        ║" -ForegroundColor Cyan
Write-Host "║                                                                      ║" -ForegroundColor Cyan
Write-Host "║              English Learning Assistant v2.0                         ║" -ForegroundColor Cyan
Write-Host "║              Powered by GigaChat AI                                  ║" -ForegroundColor Cyan
Write-Host "║                                                                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host ""

# Проверка прав администратора
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  ТРЕБУЮТСЯ ПРАВА АДМИНИСТРАТОРА!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Перезапускаем с правами администратора..." -ForegroundColor Yellow
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

# ШАГ 1: Проверка Node.js
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host " ШАГ 1/8: ПРОВЕРКА NODE.JS" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

$nodeExists = Get-Command node -ErrorAction SilentlyContinue

if ($nodeExists) {
    Write-Host "✅ Node.js уже установлен!" -ForegroundColor Green
    node --version
    npm --version
} else {
    Write-Host "⚠️  Node.js не найден. Начинаем установку..." -ForegroundColor Yellow
    Write-Host ""
    
    # Определяем архитектуру
    $arch = if ([Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
    Write-Host "📥 Скачивание Node.js LTS (v20.10.0) для $arch..." -ForegroundColor Cyan
    Write-Host ""
    
    # Создаем временную папку
    $tempDir = "$env:TEMP\nodejs_installer"
    if (-not (Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir | Out-Null
    }
    
    # URL и файл
    $nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-$arch.msi"
    $nodeFile = "$tempDir\nodejs_installer.msi"
    
    # Скачивание
    Write-Host "Скачивание началось... (это займет 1-3 минуты)" -ForegroundColor Yellow
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeFile -UseBasicParsing
        Write-Host "✅ Node.js скачан!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Ошибка скачивания: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Пожалуйста, установите Node.js вручную:" -ForegroundColor Yellow
        Write-Host "https://nodejs.org/" -ForegroundColor Cyan
        pause
        exit 1
    }
    
    Write-Host ""
    Write-Host "📦 Устанавливаем Node.js (тихая установка)..." -ForegroundColor Cyan
    Write-Host "   (Это займет 1-2 минуты)" -ForegroundColor Yellow
    
    # Тихая установка
    Start-Process msiexec.exe -ArgumentList "/i `"$nodeFile`" /qn /norestart" -Wait
    
    Write-Host "✅ Node.js установлен!" -ForegroundColor Green
    
    # Обновляем переменные окружения
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Проверка
    Start-Sleep -Seconds 3
    $nodeExists = Get-Command node -ErrorAction SilentlyContinue
    
    if ($nodeExists) {
        node --version
        npm --version
    } else {
        Write-Host ""
        Write-Host "⚠️  Node.js установлен, но требуется перезапуск!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "ЗАКРОЙТЕ PowerShell и запустите скрипт снова!" -ForegroundColor Yellow
        Write-Host ""
        pause
        exit 0
    }
    
    # Очистка
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host ""

# ШАГ 2: Git (опционально)
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host " ШАГ 2/8: ПРОВЕРКА GIT (опционально)" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

$gitExists = Get-Command git -ErrorAction SilentlyContinue
if ($gitExists) {
    Write-Host "✅ Git установлен" -ForegroundColor Green
    git --version
} else {
    Write-Host "⚠️  Git не найден (не критично)" -ForegroundColor Yellow
    Write-Host "   Вы можете установить позже: https://git-scm.com/" -ForegroundColor Gray
}

Write-Host ""
Write-Host ""

# ШАГ 3: Настройка проекта
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host " ШАГ 3/8: НАСТРОЙКА ПРОЕКТА" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir
Write-Host "📁 Рабочая папка: $projectDir" -ForegroundColor Cyan

Write-Host ""
Write-Host ""

# ШАГ 4: Создание .env
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host " ШАГ 4/8: СОЗДАНИЕ .ENV ФАЙЛА" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

if (Test-Path .env) {
    Write-Host "✅ Файл .env уже существует" -ForegroundColor Green
} else {
    Write-Host "📝 Создаём .env файл с GigaChat credentials..." -ForegroundColor Cyan
    
    $envContent = @"
# GigaChat API Configuration
VITE_GIGACHAT_CLIENT_ID=019a81d2-9f7c-7429-a7eb-f240038d4d22
VITE_GIGACHAT_CLIENT_SECRET=580f330d-4678-48a3-90b4-7267226dd87e
VITE_GIGACHAT_AUTH_TOKEN=MDE5YTgxZDItOWY3Yy03NDI5LWE3ZWItZjI0MDAzOGQ0ZDIyOjU4MGYzMzBkLTQ2NzgtNDhhMy05MGI0LTcyNjcyNmRkODc0ZQ==
VITE_GIGACHAT_SCOPE=GIGACHAT_API_PERS

# GigaChat API Endpoints
VITE_GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
VITE_GIGACHAT_API_URL=https://gigachat.devices.sberbank.ru/api/v1

# Application Configuration
VITE_APP_NAME=English Learning Assistant
VITE_APP_VERSION=2.0.0
"@
    
    Set-Content -Path .env -Value $envContent -Encoding UTF8
    Write-Host "✅ Файл .env создан!" -ForegroundColor Green
}

Write-Host ""
Write-Host ""

# ШАГ 5: Установка зависимостей
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host " ШАГ 5/8: УСТАНОВКА ЗАВИСИМОСТЕЙ" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

if (Test-Path node_modules) {
    Write-Host "⚠️  Папка node_modules уже существует" -ForegroundColor Yellow
    $reinstall = Read-Host "   Переустановить зависимости? (y/n)"
    
    if ($reinstall -eq "y") {
        Write-Host ""
        Write-Host "🗑️  Удаляем старые зависимости..." -ForegroundColor Yellow
        Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue
        if (Test-Path package-lock.json) {
            Remove-Item package-lock.json
        }
        Write-Host "✅ Удалено!" -ForegroundColor Green
        $needInstall = $true
    } else {
        Write-Host "✅ Используем существующие зависимости" -ForegroundColor Green
        $needInstall = $false
    }
} else {
    $needInstall = $true
}

if ($needInstall) {
    Write-Host "📦 Устанавливаем зависимости..." -ForegroundColor Cyan
    Write-Host "   (Это займет 2-5 минут, пожалуйста подождите...)" -ForegroundColor Yellow
    Write-Host ""
    
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка установки зависимостей!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Попробуйте вручную:" -ForegroundColor Yellow
        Write-Host "  npm install" -ForegroundColor Cyan
        pause
        exit 1
    }
    
    Write-Host "✅ Зависимости установлены!" -ForegroundColor Green
}

Write-Host ""
Write-Host ""

# ШАГ 6: Очистка кэша
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host " ШАГ 6/8: ОЧИСТКА КЭША" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

if (Test-Path node_modules\.vite) {
    Write-Host "🗑️  Очищаем кэш Vite..." -ForegroundColor Yellow
    Remove-Item -Path node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Кэш очищен!" -ForegroundColor Green
} else {
    Write-Host "✅ Кэш уже чист" -ForegroundColor Green
}

if (Test-Path .vite) {
    Remove-Item -Path .vite -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host ""

# ШАГ 7: Проверка файлов
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host " ШАГ 7/8: ПРОВЕРКА ФАЙЛОВ" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

$files = @{
    "package.json" = $true
    "vite.config.js" = $true
    "tailwind.config.js" = $true
    "postcss.config.js" = $true
    "src\main.jsx" = $true
    "src\index.css" = $true
    ".env" = $false  # optional
}

$allFilesOk = $true

foreach ($file in $files.Keys) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        if ($files[$file]) {
            Write-Host "❌ $file не найден!" -ForegroundColor Red
            $allFilesOk = $false
        } else {
            Write-Host "⚠️  $file отсутствует (будет создан)" -ForegroundColor Yellow
        }
    }
}

if (-not $allFilesOk) {
    Write-Host ""
    Write-Host "❌ Некоторые критичные файлы отсутствуют!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "✅ Все необходимые файлы на месте!" -ForegroundColor Green
Write-Host ""
Write-Host ""

# ШАГ 8: Запуск
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host " ШАГ 8/8: ЗАПУСК ПРИЛОЖЕНИЯ" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

Write-Host "🚀 Запускаем сервер разработки..." -ForegroundColor Cyan
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                      ║" -ForegroundColor Green
Write-Host "║                     ПРИЛОЖЕНИЕ ЗАПУСКАЕТСЯ!                          ║" -ForegroundColor Green
Write-Host "║                                                                      ║" -ForegroundColor Green
Write-Host "║  📱 URL:           http://localhost:3000                            ║" -ForegroundColor White
Write-Host "║  🌐 Откроется:     Автоматически в браузере                         ║" -ForegroundColor White
Write-Host "║  ⌨️  Остановка:     Ctrl + C                                        ║" -ForegroundColor White
Write-Host "║                                                                      ║" -ForegroundColor Green
Write-Host "║  ✨ Новый интерфейс с градиентами и анимациями                      ║" -ForegroundColor Cyan
Write-Host "║  🤖 GigaChat API интегрирован                                       ║" -ForegroundColor Cyan
Write-Host "║  🎮 Геймификация с заданиями и наградами                            ║" -ForegroundColor Cyan
Write-Host "║  🎤 Практика произношения с AI                                      ║" -ForegroundColor Cyan
Write-Host "║  💾 Система прогресса и экспорт данных                              ║" -ForegroundColor Cyan
Write-Host "║                                                                      ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "💡 ГОРЯЧИЕ КЛАВИШИ:" -ForegroundColor Yellow
Write-Host "   Alt + H  →  Главная" -ForegroundColor White
Write-Host "   Alt + C  →  Чат с ИИ" -ForegroundColor White
Write-Host "   Alt + V  →  Словарь" -ForegroundColor White
Write-Host "   Alt + G  →  Грамматика" -ForegroundColor White
Write-Host "   Alt + E  →  Упражнения" -ForegroundColor White
Write-Host "   Alt + ?  →  Показать все горячие клавиши" -ForegroundColor White
Write-Host ""
Write-Host "🔄 В БРАУЗЕРЕ: Нажмите Ctrl+Shift+R для жесткой перезагрузки" -ForegroundColor Yellow
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""

# Запуск
npm run dev

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Ошибка запуска сервера!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Попробуйте вручную:" -ForegroundColor Yellow
    Write-Host "  npm install" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor Cyan
    pause
    exit 1
}

