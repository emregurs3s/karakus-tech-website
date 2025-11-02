@echo off
REM Karakuş Tech Website Deployment Script (Windows)
REM Bu script build alır ve dosyaları hazırlar

echo.
echo ========================================
echo   Karakuş Tech Deployment Başlıyor
echo ========================================
echo.

REM Frontend Build
echo [1/4] Frontend build alınıyor...
cd Frontend
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Frontend build hatası!
    pause
    exit /b 1
)
echo ✅ Frontend build tamamlandı
cd ..

REM Admin Build
echo.
echo [2/4] Admin build alınıyor...
cd Admin
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Admin build hatası!
    pause
    exit /b 1
)
echo ✅ Admin build tamamlandı
cd ..

REM Deployment klasörü oluştur
echo.
echo [3/4] Deployment klasörü hazırlanıyor...
if exist deployment rmdir /s /q deployment
mkdir deployment\public_html
mkdir deployment\public_html\admin

REM Frontend dosyalarını kopyala
echo [4/4] Dosyalar kopyalanıyor...
xcopy /E /I /Y Frontend\dist\* deployment\public_html\
copy /Y Frontend\.htaccess deployment\public_html\

REM Admin dosyalarını kopyala
xcopy /E /I /Y Admin\dist\* deployment\public_html\admin\
copy /Y Admin\.htaccess deployment\public_html\admin\

echo.
echo ========================================
echo   ✅ Deployment Hazır!
echo ========================================
echo.
echo 📂 Dosyalar şu klasörde:
echo    deployment\public_html\
echo.
echo 📤 Şimdi yapmanız gerekenler:
echo    1. deployment\public_html\ içindeki TÜM dosyaları
echo    2. Hosting'inizdeki public_html\ klasörüne yükleyin
echo    3. FTP veya cPanel File Manager kullanabilirsiniz
echo.
echo 🌐 URL'ler:
echo    Ana Site: https://karakustech.com
echo    Admin: https://karakustech.com/admin
echo.
echo 📖 Detaylı bilgi için DEPLOYMENT_GUIDE.md dosyasını okuyun
echo.
pause
