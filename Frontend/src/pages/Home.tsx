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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroContent.backgroundImage})` }}
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



      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">{t('values.title')}</h2>
            <p className="body-lg text-gray-600 max-w-2xl mx-auto">
              {t('values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✅',
                title: t('values.sustainable.title'),
                description: t('values.sustainable.description'),
                stats: t('values.sustainable.stats'),
                color: 'from-green-400 to-green-600'
              },
              {
                icon: '👟',
                title: t('values.comfortable.title'),
                description: t('values.comfortable.description'),
                stats: t('values.comfortable.stats'),
                color: 'from-blue-400 to-blue-600'
              },
              {
                icon: '🌍',
                title: t('values.eco.title'),
                description: t('values.eco.description'),
                stats: t('values.eco.stats'),
                color: 'from-purple-400 to-purple-600'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{value.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="heading-sm mb-4 text-center">{value.title}</h3>
                  <p className="body-md text-gray-600 mb-6 text-center leading-relaxed">{value.description}</p>
                  
                  {/* Stats Badge */}
                  <div className="text-center">
                    <span className={`inline-block bg-gradient-to-r ${value.color} text-white px-4 py-2 rounded-full text-sm font-medium shadow-md`}>
                      {value.stats}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
              <h3 className="heading-sm mb-4">{t('values.commitment.title')}</h3>
              <p className="body-md text-gray-600 mb-6">
                {t('values.commitment.description')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">50,000+</div>
                  <div className="text-sm text-gray-600">{t('values.commitment.trees')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600">{t('values.commitment.recyclable')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                  <div className="text-sm text-gray-600">{t('values.commitment.carbon')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">{t('testimonials.title')}</h2>
            <p className="body-lg text-gray-600">{t('testimonials.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ayşe Kaya',
                avatar: '👩🏻‍💼',
                rating: 5,
                comment: 'iPhone 15 şarj aletini aldım ve gerçekten çok hızlı şarj ediyor! Orijinal kalitede ve güvenilir. Kesinlikle tavsiye ederim.',
                product: 'iPhone 15 Hızlı Şarj',
                verified: true
              },
              {
                name: 'Mehmet Şahin',
                avatar: '👨🏻‍💻',
                rating: 5,
                comment: 'AirPods Pro\'yu aldım, ses kalitesi mükemmel! Gürültü engelleme özelliği harika çalışıyor. Artık sadece buradan alışveriş yapıyorum.',
                product: 'AirPods Pro 3. Nesil',
                verified: true
              },
              {
                name: 'Zeynep Tunç',
                avatar: '👩🏻‍🎨',
                rating: 5,
                comment: 'Anker Powerbank\'ı çok kullanışlı ve kapasitesi gerçekten yüksek. Seyahatlerde vazgeçilmezim oldu. Kalitesi mükemmel!',
                product: 'Anker PowerCore 20000mAh',
                verified: true
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-gray-100 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-black">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <blockquote className="text-gray-700 body-md leading-relaxed mb-6 italic">
                  "{testimonial.comment}"
                </blockquote>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {testimonial.product}
                  </span>
                  <span className="text-xs text-gray-500">{t('testimonials.verified')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;