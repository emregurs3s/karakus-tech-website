import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCategories, useBestSellers } from '../api/hooks';
import { heroContent } from '../data/mockData';
import ProductCard from '../components/product/ProductCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Home = () => {
  const { t } = useTranslation();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: bestSellersData, isLoading: bestSellersLoading } = useBestSellers();
  
  const categories = categoriesData?.data || [];
  const featuredProducts = bestSellersData?.data?.slice(0, 4) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-contain bg-no-repeat bg-center"
          style={{ 
            backgroundImage: `url(${heroContent.backgroundImage})`,
            backgroundSize: '60%' // Logo boyutunu %60'a küçült
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-5xl mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide uppercase mb-6">
              {t('hero.badge')}
            </span>
          </motion.div>
          
          <h1 className="heading-xl mb-6 leading-tight">{t('hero.title')}</h1>
          <p className="body-lg mb-8 max-w-2xl mx-auto text-gray-200">{t('hero.subtitle')}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products" className="btn-secondary hover:scale-105 transition-transform duration-200">
              {t('hero.cta')}
            </Link>
            <Link to="/products?category=sarj-aletleri" className="text-white border border-white/30 px-8 py-3 font-medium tracking-wide uppercase text-sm hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
              {t('hero.shoes')}
            </Link>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center text-white/70">
              <span className="text-sm mb-2">{t('hero.discover')}</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">{t('categories.title')}</h2>
            <p className="body-lg text-gray-600 max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoriesLoading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))
            ) : (
              categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={`/products?category=${category.slug}`}>
                  <div className="relative overflow-hidden bg-gray-100 aspect-square mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Name Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white heading-sm mb-2 group-hover:transform group-hover:translate-y-[-4px] transition-transform duration-300">
                        {category.name}
                      </h3>
                      <div className="flex items-center text-white/80 text-sm">
                        <span>{t('categories.viewCollection')}</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide uppercase mb-4">
              {t('featured.badge')}
            </div>
            <h2 className="heading-lg mb-4">{t('featured.title')}</h2>
            <p className="body-lg text-gray-600 max-w-2xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellersLoading ? (
              [...Array(4)].map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto mb-8">
              <h3 className="heading-sm mb-4">{t('featured.exploreAll')}</h3>
              <p className="body-md text-gray-600 mb-6">
                {t('featured.exploreDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn-primary hover:scale-105 transition-transform duration-200">
                  {t('featured.viewAll')}
                </Link>
                <Link to="/products?category=sarj-aletleri" className="btn-secondary">
                  {t('featured.shoesOnly')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>






    </div>
  );
};

export default Home;