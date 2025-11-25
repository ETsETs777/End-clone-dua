@echo off
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║     🎨 ENGLISH ASSISTANT - УЛУЧШЕННАЯ ВЕРСИЯ 2.0 🎨         ║
echo ║                                                              ║
echo ║              Powered by GigaChat AI                          ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo.
echo [1/4] Проверка окружения...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js НЕ установлен!
    echo.
    echo Пожалуйста, установите Node.js:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js установлен
node --version
npm --version
echo.

echo [2/4] Проверка .env файла...
if exist .env (
    echo ✅ .env файл найден
) else (
    echo ⚠️  .env файл не найден
    echo Создаём автоматически...
    call setup-env.bat
)
echo.

echo [3/4] Проверка зависимостей...
if not exist node_modules (
    echo ⚠️  Зависимости не установлены
    echo Устанавливаем...
    call npm install
) else (
    echo ✅ Зависимости установлены
)
echo.

echo [4/4] Очистка кэша...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite 2>nul
    echo ✅ Кэш Vite очищен
)
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║                  🚀 ЗАПУСК ПРИЛОЖЕНИЯ 🚀                    ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Сервер запускается...
echo.
echo После запуска:
echo   📱 Откроется браузер на http://localhost:3000
echo   🎨 Новый улучшенный интерфейс
echo   🤖 GigaChat API интегрирован
echo   ✨ Все анимации и эффекты работают
echo.
echo Для остановки нажмите Ctrl+C
echo.
echo ════════════════════════════════════════════════════════════════
echo.

npm run dev

