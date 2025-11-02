# Deployment Rehberi - Karakuş Tech Website

## 📦 Dosya Yapısı

### Hosting'de Olması Gereken Yapı:

```
public_html/                    ← Ana dizin (karakustech.com)
├── index.html                  ← Frontend ana sayfa
├── assets/                     ← Frontend asset'leri
│   ├── index-[hash].css
│   └── index-[hash].js
├── .htaccess                   ← Frontend routing
│
└── admin/                      ← Admin panel (karakustech.com/admin)
    ├── index.html              ← Admin ana sayfa
    ├── assets/                 ← Admin asset'leri
    │   ├── index-[hash].css
    │   └── index-[hash].js
    └── .htaccess               ← Admin routing
```

## 🚀 Deployment Adımları

### 1. Build Alma

#### Frontend Build:
```bash
cd Frontend
npm run build
```
Bu komut `Frontend/dist/` klasörü oluşturur.

#### Admin Build:
```bash
cd Admin
npm run build
```
Bu komut `Admin/dist/` klasörü oluşturur.

### 2. Dosyaları Hosting'e Yükleme

#### A) cPanel / FileManager Kullanarak:

1. **Frontend Dosyalarını Yükle:**
   - `Frontend/dist/` içindeki TÜM dosyaları `public_html/` dizinine yükle
   - `Frontend/.htaccess` dosyasını `public_html/` dizinine yükle

2. **Admin Dosyalarını Yükle:**
   - `public_html/` içinde `admin/` klasörü oluştur
   - `Admin/dist/` içindeki TÜM dosyaları `public_html/admin/` dizinine yükle
   - `Admin/.htaccess` dosyasını `public_html/admin/` dizinine yükle

#### B) FTP Kullanarak:

```bash
# FileZilla veya başka bir FTP client kullanın
# Bağlantı bilgileri:
Host: ftp.karakustech.com
Username: [hosting kullanıcı adınız]
Password: [hosting şifreniz]
Port: 21

# Yükleme:
1. Frontend/dist/* → public_html/
2. Frontend/.htaccess → public_html/
3. Admin/dist/* → public_html/admin/
4. Admin/.htaccess → public_html/admin/
```

### 3. .htaccess Dosyalarını Kontrol Edin

#### public_html/.htaccess (Frontend):
```apache
RewriteEngine On

# Admin klasörünü exclude et
RewriteCond %{REQUEST_URI} ^/admin/
RewriteRule ^ - [L]

# API calls - don't rewrite
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# Static files - serve directly if they exist
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Frontend SPA routing
RewriteRule . /index.html [L]

# Error handling
ErrorDocument 404 /index.html
```

#### public_html/admin/.htaccess (Admin):
```apache
RewriteEngine On

# Static files - serve directly if they exist
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Admin SPA routing
RewriteRule . /admin/index.html [L]

# Error handling
ErrorDocument 404 /admin/index.html
```

## 🔍 Sorun Giderme

### 404 Hatası Alıyorsanız:

#### 1. Dosya Yapısını Kontrol Edin:
```bash
# cPanel File Manager'da kontrol edin:
public_html/
├── index.html          ✅ Var mı?
├── assets/             ✅ Var mı?
├── .htaccess           ✅ Var mı?
└── admin/
    ├── index.html      ✅ Var mı?
    ├── assets/         ✅ Var mı?
    └── .htaccess       ✅ Var mı?
```

#### 2. .htaccess Çalışıyor mu?
cPanel'de:
- **Apache Modules** → `mod_rewrite` aktif mi kontrol edin
- **.htaccess Override** → `AllowOverride All` olmalı

#### 3. Dosya İzinleri:
```
Klasörler: 755
Dosyalar: 644
.htaccess: 644
```

#### 4. Cache Temizleme:
- Tarayıcı cache'ini temizleyin (Ctrl + Shift + Delete)
- Hosting cache'ini temizleyin (cPanel → Cache Manager)

### Belirli Sayfalarda 404:

#### Ana sayfa çalışıyor ama diğer sayfalar 404:
→ `.htaccess` dosyası yüklenmemiş veya çalışmıyor

#### Admin paneli 404:
→ `public_html/admin/` klasörü yok veya dosyalar yanlış yerde

#### Resimler yüklenmiyor:
→ GitHub raw URL'leri kontrol edin
→ CORS ayarları kontrol edin

## 🔄 Güncelleme (Update) Adımları

Kod değişikliği yaptığınızda:

```bash
# 1. Build alın
cd Frontend && npm run build
cd ../Admin && npm run build

# 2. Sadece değişen dosyaları yükleyin
# - Frontend/dist/* → public_html/
# - Admin/dist/* → public_html/admin/

# 3. Cache temizleyin
# - Tarayıcı cache
# - Hosting cache (cPanel)
```

## 📝 Deployment Checklist

Deployment öncesi kontrol listesi:

- [ ] Frontend build alındı (`Frontend/dist/` oluştu)
- [ ] Admin build alındı (`Admin/dist/` oluştu)
- [ ] Backend Render'a deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Frontend dosyaları `public_html/` yüklendi
- [ ] Admin dosyaları `public_html/admin/` yüklendi
- [ ] .htaccess dosyaları yüklendi
- [ ] Dosya izinleri doğru (755/644)
- [ ] Ana sayfa test edildi (karakustech.com)
- [ ] Admin paneli test edildi (karakustech.com/admin)
- [ ] Login test edildi
- [ ] API bağlantısı test edildi
- [ ] Resimler yükleniyor mu test edildi

## 🌐 URL Yapısı

Deployment sonrası URL'ler:

```
Ana Site:
https://karakustech.com/                    → Frontend (Ana sayfa)
https://karakustech.com/products            → Ürünler sayfası
https://karakustech.com/products/[slug]     → Ürün detay
https://karakustech.com/cart                → Sepet
https://karakustech.com/login               → Giriş

Admin Panel:
https://karakustech.com/admin               → Admin dashboard
https://karakustech.com/admin/products      → Ürün yönetimi (React Router)
https://karakustech.com/admin/orders        → Sipariş yönetimi (React Router)

Backend API:
https://karakus-website-backend.onrender.com/api/products
https://karakus-website-backend.onrender.com/api/auth/login
```

## 🆘 Hala 404 Alıyorsanız

1. **Hosting desteğine sorun:**
   - "mod_rewrite aktif mi?"
   - "AllowOverride All ayarı var mı?"
   - ".htaccess dosyaları çalışıyor mu?"

2. **Alternatif: web.config (IIS için):**
   Eğer Windows/IIS hosting kullanıyorsanız, `.htaccess` yerine `web.config` gerekir.

3. **Alternatif: Nginx:**
   Eğer Nginx kullanıyorsanız, farklı bir config gerekir.

## 📞 Destek

Sorun yaşarsanız:
- Hosting sağlayıcınızın desteğine başvurun
- Dosya yapısını ve .htaccess'i kontrol edin
- Tarayıcı console'da hata mesajlarını kontrol edin (F12)

---

**SON GÜNCELLEME**: 2 Kasım 2024
