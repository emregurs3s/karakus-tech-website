import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const categories = [
  {
    name: 'Şarj Aletleri',
    slug: 'sarj-aletleri',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=600&fit=crop',
    ordering: 1
  },
  {
    name: 'Airpods & Kulaklık',
    slug: 'airpods-kulaklik',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=600&fit=crop',
    ordering: 2
  },
  {
    name: 'Powerbank',
    slug: 'powerbank',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=600&fit=crop',
    ordering: 3
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log('Categories inserted');

    // Get category IDs
    const sarjAletleriCategory = insertedCategories.find(cat => cat.slug === 'sarj-aletleri')?._id;
    const airpodsKulaklikCategory = insertedCategories.find(cat => cat.slug === 'airpods-kulaklik')?._id;
    const powerbankCategory = insertedCategories.find(cat => cat.slug === 'powerbank')?._id;

    // Insert products
    const products = [
      {
        title: 'iPhone 15 Hızlı Şarj Aleti',
        slug: 'iphone-15-hizli-sarj-aleti',
        description: 'Apple iPhone 15 serisi için özel tasarlanmış 20W USB-C hızlı şarj adaptörü. Orijinal kalitede, güvenli şarj deneyimi.',
        price: 299,
        originalPrice: 399,
        images: [
          'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop'
        ],
        category: sarjAletleriCategory,
        colors: ['Beyaz', 'Siyah'],
        sizes: ['20W', '30W'],
        stock: 50,
        sku: 'IP15-CHG-001',
        isNew: true,
        isBestSeller: true,
        rating: 4.8,
        reviewCount: 127
      },
      {
        title: 'AirPods Pro 3. Nesil',
        slug: 'airpods-pro-3-nesil',
        description: 'Aktif gürültü engelleme, şeffaf mod ve uzamsal ses teknolojisi ile premium kablosuz kulaklık deneyimi.',
        price: 2899,
        images: [
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop'
        ],
        category: airpodsKulaklikCategory,
        colors: ['Beyaz'],
        sizes: ['Standart'],
        stock: 30,
        sku: 'AP-PRO3-001',
        isBestSeller: true,
        rating: 4.9,
        reviewCount: 89
      },
      {
        title: 'Samsung Galaxy Buds Pro',
        slug: 'samsung-galaxy-buds-pro',
        description: 'Samsung\'un en gelişmiş kablosuz kulaklığı. ANC, 360 Audio ve IPX7 su geçirmezlik.',
        price: 1299,
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop'
        ],
        category: airpodsKulaklikCategory,
        colors: ['Siyah', 'Beyaz', 'Mor'],
        sizes: ['Standart'],
        stock: 25,
        sku: 'SGB-PRO-001',
        isNew: true,
        rating: 4.7,
        reviewCount: 56
      },
      {
        title: 'Anker PowerCore 20000mAh',
        slug: 'anker-powercore-20000mah',
        description: 'Yüksek kapasiteli taşınabilir şarj cihazı. 2 USB çıkışı ile aynı anda 2 cihaz şarj edebilir.',
        price: 599,
        images: [
          'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
        ],
        category: powerbankCategory,
        colors: ['Siyah', 'Beyaz'],
        sizes: ['20000mAh'],
        stock: 40,
        sku: 'ANK-PC20-001',
        rating: 4.6,
        reviewCount: 234
      },
      {
        title: 'Xiaomi Mi 65W Hızlı Şarj',
        slug: 'xiaomi-mi-65w-hizli-sarj',
        description: 'Çoklu cihaz desteği ile 65W güçte hızlı şarj adaptörü. Laptop, telefon ve tablet uyumlu.',
        price: 449,
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop'
        ],
        category: sarjAletleriCategory,
        colors: ['Beyaz', 'Siyah'],
        sizes: ['65W'],
        stock: 20,
        sku: 'XM-65W-001',
        isNew: true,
        rating: 4.9,
        reviewCount: 45
      },
      {
        title: 'Baseus 30000mAh Powerbank',
        slug: 'baseus-30000mah-powerbank',
        description: 'Yüksek kapasiteli 30000mAh powerbank. Hızlı şarj desteği ve dijital ekran.',
        price: 899,
        images: [
          'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
        ],
        category: powerbankCategory,
        colors: ['Siyah', 'Beyaz'],
        sizes: ['30000mAh'],
        stock: 15,
        sku: 'BSS-PB30-001',
        rating: 4.8,
        reviewCount: 67
      },
      {
        title: 'Sony WH-1000XM5 Kulaklık',
        slug: 'sony-wh-1000xm5-kulaklik',
        description: 'Endüstri lideri gürültü engelleme teknolojisi ile premium over-ear kulaklık.',
        price: 3299,
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop'
        ],
        category: airpodsKulaklikCategory,
        colors: ['Siyah', 'Gümüş'],
        sizes: ['Standart'],
        stock: 12,
        sku: 'SNY-WH5-001',
        rating: 4.7,
        reviewCount: 23
      },
      {
        title: 'Mophie Wireless Powerbank',
        slug: 'mophie-wireless-powerbank',
        description: 'Kablosuz şarj özellikli 10000mAh powerbank. Qi uyumlu cihazlar için ideal.',
        price: 1299,
        images: [
          'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop'
        ],
        category: powerbankCategory,
        colors: ['Siyah', 'Beyaz'],
        sizes: ['10000mAh'],
        stock: 60,
        sku: 'MPH-WPB-001',
        rating: 4.5,
        reviewCount: 156
      },
      {
        title: 'USB-C Hızlı Şarj Kablosu',
        slug: 'usb-c-hizli-sarj-kablosu',
        description: 'Dayanıklı örgü kaplı USB-C şarj kablosu. 100W güç desteği ile hızlı şarj.',
        price: 149,
        originalPrice: 199,
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop'
        ],
        category: sarjAletleriCategory,
        colors: ['Siyah', 'Beyaz', 'Kırmızı'],
        sizes: ['1m', '2m', '3m'],
        stock: 35,
        sku: 'USBC-CBL-001',
        isNew: true,
        rating: 4.6,
        reviewCount: 78
      },
      {
        title: 'JBL Tune 760NC Kulaklık',
        slug: 'jbl-tune-760nc-kulaklik',
        description: 'Aktif gürültü engelleme özellikli kablosuz over-ear kulaklık. 50 saat pil ömrü.',
        price: 1899,
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop'
        ],
        category: airpodsKulaklikCategory,
        colors: ['Siyah', 'Mavi', 'Beyaz'],
        sizes: ['Standart'],
        stock: 22,
        sku: 'JBL-T760-001',
        isBestSeller: true,
        rating: 4.9,
        reviewCount: 34
      },
      {
        title: 'Anker Nano Powerbank 5000mAh',
        slug: 'anker-nano-powerbank-5000mah',
        description: 'Ultra kompakt tasarım ile taşınabilir 5000mAh powerbank. Cep telefonu boyutunda.',
        price: 399,
        images: [
          'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
        ],
        category: powerbankCategory,
        colors: ['Beyaz', 'Siyah', 'Mavi'],
        sizes: ['5000mAh'],
        stock: 18,
        sku: 'ANK-NNO-001',
        rating: 4.4,
        reviewCount: 92
      },
      {
        title: 'Belkin 3-in-1 Wireless Charger',
        slug: 'belkin-3in1-wireless-charger',
        description: 'iPhone, AirPods ve Apple Watch için 3-in-1 kablosuz şarj istasyonu.',
        price: 2299,
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
        ],
        category: sarjAletleriCategory,
        colors: ['Beyaz', 'Siyah'],
        sizes: ['Standart'],
        stock: 45,
        sku: 'BLK-3IN1-001',
        isNew: true,
        rating: 4.3,
        reviewCount: 67
      }
    ];

    await Product.insertMany(products);
    console.log('Products inserted');

    // Create admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@karakustech.com',
      password: 'admin123',
      roles: ['admin', 'user']
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create regular user
    const regularUser = new User({
      name: 'Test User',
      email: 'user@karakustech.com',
      password: 'user123',
      roles: ['user']
    });
    await regularUser.save();
    console.log('Regular user created');

    console.log('✅ Seed data inserted successfully!');
    console.log('👤 Admin: admin@karakustech.com / admin123');
    console.log('👤 User: user@karakustech.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed data error:', error);
    process.exit(1);
  }
};

seedData();