@echo off
echo ========================================
echo   Очистка кэша и перезапуск
echo ========================================
echo.

echo 1. Очистка Service Worker...
echo.

echo 2. Очистка node_modules/.vite...
rmdir /s /q node_modules\.vite 2>nul
echo    ✓ Кэш Vite очищен
echo.

echo 3. Перезапуск сервера...
echo    (Откроется в новом окне)
echo.
start cmd /k "npm run dev"

echo.
echo ========================================
echo   ГОТОВО!
echo ========================================
echo.
echo После открытия браузера:
echo   1. Нажмите Ctrl+Shift+R для жесткой перезагрузки
echo   2. Откройте DevTools (F12)
echo   3. Application -^> Service Workers -^> Unregister
echo   4. Обновите страницу (F5)
echo.
pause

