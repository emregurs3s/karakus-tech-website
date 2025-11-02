# Deployment Dosyaları

## 📦 İçerik

Bu klasör production için hazır build dosyalarını içerir.

### Dosya Yapısı:

```
public_html/                    ← Hosting'e yüklenecek ana klasör
├── index.html                  ← Frontend ana sayfa
├── .htaccess                   ← Frontend routing
├── assets/                     ← Frontend JS/CSS
├── images/                     ← Frontend resimler
├── *.jpg                       ← Frontend statik dosyalar
│
└── admin/                      ← Admin panel
    ├── index.html              ← Admin ana sayfa
    ├── .htaccess               ← Admin routing
    ├── assets/                 ← Admin JS/CSS
    └── logo.jpg                ← Admin logo
```

## 🚀 Deployment Adımları

### 1. Hosting'e Bağlanın
- cPanel File Manager VEYA
- FTP Client (FileZilla, WinSCP vb.)

### 2. Dosyaları Yükleyin
```
public_html/ içindeki TÜM dosyaları
→ Hosting'inizdeki public_html/ klasörüne yükleyin
```

### 3. Kontrol Edin
- ✅ public_html/index.html
- ✅ public_html/.htaccess
- ✅ public_html/assets/
- ✅ public_html/admin/index.html
- ✅ public_html/admin/.htaccess
- ✅ public_html/admin/assets/

### 4. Test Edin
- Ana Site: https://karakustech.com
- Admin Panel: https://karakustech.com/admin

## 📝 Notlar

- .htaccess dosyaları React Router için gereklidir
- Dosya izinleri: Klasörler 755, Dosyalar 644
- Cache temizlemeyi unutmayın (Ctrl + Shift + Delete)

## 🔄 Güncelleme

Yeni build almak için:
```bash
# Root dizinde
npm run build  # veya
.\deploy.bat   # Windows
./deploy.sh    # Linux/Mac
```

---
**Build Tarihi**: 2 Kasım 2024
**Durum**: Production Ready ✅
