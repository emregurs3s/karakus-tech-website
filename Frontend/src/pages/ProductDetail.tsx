import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProduct } from '../api/hooks';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: productData, isLoading } = useProduct(slug!);
  const product = productData?.data;
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize] = useState('Standart');
  const [quantity, setQuantity] = useState(1);

  // Set initial color when product loads
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    } else if (product) {
      setSelectedColor('Standart');
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-lg mb-4">Ürün bulunamadı</h1>
          <Link to="/products" className="btn-primary">
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Only check for color if product has colors
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      addToast({
        message: 'Lütfen bir varyant seçiniz',
        type: 'warning'
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        color: selectedColor,
        size: selectedSize,
        stock: product.stock
      });
    }

    addToast({
      message: `${quantity} ${t('product.quantity').toLowerCase()} ${product.title} ${t('product.addedToCart', { title: '' }).replace('{{title}}', '').trim()}!`,
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-black transition-colors duration-200">
                {t('nav.home')}
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-black transition-colors duration-200">
                {t('nav.products')}
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-black">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-square bg-gray-100 overflow-hidden"
            >
              <img
                src={
                  product.images?.[selectedImage] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5Sb1NpbTwvdGV4dD48L3N2Zz4='
                }
                alt={product.title}
                width="800"
                height="800"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5Sb1NpbTwvdGV4dD48L3N2Zz4=';
                }}
              />
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 bg-gray-100 overflow-hidden border-2 transition-colors duration-200 ${
                      selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}
                      alt={`${product.title} ${index + 1}`}
                      width="80"
                      height="80"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                {product.isNew && (
                  <span className="bg-black text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
                    {t('product.new')}
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-green-600 text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
                    {t('product.bestseller')}
                  </span>
                )}
              </div>

              <h1 className="heading-lg mb-4">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="heading-sm">₺{product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through body-lg">
                    ₺{product.originalPrice}
                  </span>
                )}
              </div>

              <p className="body-lg text-gray-600 mb-8">{product.description}</p>
            </motion.div>

            {/* Variant Selection */}
            {product.colors && product.colors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="font-medium text-black mb-4 tracking-wide uppercase text-sm">
                  Varyant: {selectedColor}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-3 px-4 border text-sm font-medium transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}



            {/* Quantity & Add to Cart - Hidden for admin users */}
            {!user?.roles.includes('admin') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-medium text-black mb-4 tracking-wide uppercase text-sm">
                    {t('product.quantity')}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full"
                >
                  {t('product.addToCart')} - ₺{(product.price * quantity).toFixed(2)}
                </button>

                <div className="text-center">
                  <p className="text-gray-500 body-sm">
                    {t('product.stock')}: {product.stock} {t('product.quantity').toLowerCase()} • {t('product.freeShipping')}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Admin Info */}
            {user?.roles.includes('admin') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="font-medium text-black mb-4 tracking-wide uppercase text-sm">
                  {t('admin.adminInfo')}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">{t('product.sku')}:</span> {product.sku}</p>
                  <p><span className="font-medium">{t('product.stock')}:</span> {product.stock} {t('product.quantity').toLowerCase()}</p>
                  <p><span className="font-medium">{t('product.status')}:</span> {product.isActive ? t('product.active') : t('product.inactive')}</p>
                  <p><span className="font-medium">{t('product.category')}:</span> {product.category?.name}</p>
                </div>
              </motion.div>
            )}

            {/* Product Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="border-t border-gray-200 pt-8"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <span className="body-md">{t('product.features.sustainable')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🚚</span>
                  <span className="body-md">{t('product.features.shipping')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👟</span>
                  <span className="body-md">{t('product.features.comfort')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;