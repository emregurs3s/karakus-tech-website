#!/bin/bash

# Karakuş Tech Website Deployment Script
# Bu script build alır ve dosyaları hazırlar

echo "🚀 Karakuş Tech Deployment Başlıyor..."
echo ""

# Frontend Build
echo "📦 Frontend build alınıyor..."
cd Frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build hatası!"
    exit 1
fi
echo "✅ Frontend build tamamlandı"
cd ..

# Admin Build
echo "📦 Admin build alınıyor..."
cd Admin
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Admin build hatası!"
    exit 1
fi
echo "✅ Admin build tamamlandı"
cd ..

# Deployment klasörü oluştur
echo ""
echo "📁 Deployment klasörü hazırlanıyor..."
rm -rf deployment
mkdir -p deployment/public_html
mkdir -p deployment/public_html/admin

# Frontend dosyalarını kopyala
echo "📋 Frontend dosyaları kopyalanıyor..."
cp -r Frontend/dist/* deployment/public_html/
cp Frontend/.htaccess deployment/public_html/

# Admin dosyalarını kopyala
echo "📋 Admin dosyaları kopyalanıyor..."
cp -r Admin/dist/* deployment/public_html/admin/
cp Admin/.htaccess deployment/public_html/admin/

echo ""
echo "✅ Deployment hazır!"
echo ""
echo "📂 Dosyalar şu klasörde:"
echo "   deployment/public_html/"
echo ""
echo "📤 Şimdi yapmanız gerekenler:"
echo "   1. deployment/public_html/ içindeki TÜM dosyaları"
echo "   2. Hosting'inizdeki public_html/ klasörüne yükleyin"
echo "   3. FTP veya cPanel File Manager kullanabilirsiniz"
echo ""
echo "🌐 URL'ler:"
echo "   Ana Site: https://karakustech.com"
echo "   Admin: https://karakustech.com/admin"
echo ""
