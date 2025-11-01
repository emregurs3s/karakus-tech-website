import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../ui/Toast';
import { Product } from '../../api/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.colors.length > 0) {
      addItem({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        color: product.colors[0],
        size: 'Standart',
        stock: product.stock
      });
      
      addToast({
        message: t('product.addedToCart', { title: product.title }),
        type: 'success'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="product-card group relative"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="relative overflow-hidden bg-gray-100 aspect-square mb-4">
          {/* Main Image */}
          <img
            src={
              product.images && product.images[0] 
                ? (product.images[0].startsWith('/uploads/') 
                    ? `http://localhost:5004${product.images[0]}` 
                    : product.images[0])
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5Sb1NpbTwvdGV4dD48L3N2Zz4='
            }
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5Sb1NpbTwvdGV4dD48L3N2Zz4=';
            }}
          />
          
          {/* Hover Image */}
          {product.images && product.images[1] && (
            <img
              src={product.images[1].startsWith('/uploads/') 
                ? `http://localhost:5004${product.images[1]}` 
                : product.images[1]
              }
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {product.isNew && (
              <span className="bg-black text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
                {t('product.new')}
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-red-500 text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
                %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} {t('product.discount')}
              </span>
            )}
          </div>

          {product.isBestSeller && (
            <span className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
              {t('product.bestseller')}
            </span>
          )}

          {/* Quick Add Button - Hidden for admin users */}
          {!user?.roles.includes('admin') && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-2 font-medium tracking-wide uppercase text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
            >
              {t('product.quickAdd')}
            </button>
          )}

          {/* Stock Warning */}
          {product.stock < 10 && (
            <div className="absolute bottom-4 right-4 bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded">
              {t('product.lastItems', { count: product.stock })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-black body-md group-hover:text-gray-600 transition-colors duration-200">
            {product.title}
          </h3>
          
          <p className="text-gray-600 body-sm line-clamp-2 h-10">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-black body-md">
                ₺{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through body-sm">
                  ₺{product.originalPrice}
                </span>
              )}
            </div>
            
            {/* Color Dots */}
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                  style={{
                    backgroundColor: color === 'Beyaz' ? '#ffffff' :
                                   color === 'Siyah' ? '#000000' :
                                   color === 'Gri' ? '#6b7280' :
                                   color === 'Lacivert' ? '#1e3a8a' :
                                   color === 'Kahverengi' ? '#92400e' :
                                   color === 'Bej' ? '#d2b48c' : '#9ca3af'
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{product.colors.length - 3}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-gray-500 text-sm ml-2">({product.reviewCount})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;