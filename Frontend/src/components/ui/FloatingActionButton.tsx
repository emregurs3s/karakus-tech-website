import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActionButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      {/* Help Menu */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-72 border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-black heading-sm">Yardım Merkezi</h3>
            </div>
            
            <div className="space-y-3">
              <a
                href="tel:+905441901544"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors duration-200">
                  <span className="text-lg">📞</span>
                </div>
                <div>
                  <div className="body-sm font-medium text-gray-900">Müşteri Hizmetleri</div>
                  <div className="text-xs text-gray-500">+90 544 190 15 44</div>
                </div>
              </a>
              
              <a
                href="mailto:destek@karakustech.com"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <div className="body-sm font-medium text-gray-900">E-posta Desteği</div>
                  <div className="text-xs text-gray-500">destek@karakustech.com</div>
                </div>
              </a>
              
              <a
                href="#"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors duration-200">
                  <span className="text-lg">❓</span>
                </div>
                <div>
                  <div className="body-sm font-medium text-gray-900">Sık Sorulan Sorular</div>
                  <div className="text-xs text-gray-500">Merak ettikleriniz</div>
                </div>
              </a>
              
              <a
                href="#"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="text-lg">🔧</span>
                </div>
                <div>
                  <div className="body-sm font-medium text-gray-900">Teknik Destek</div>
                  <div className="text-xs text-gray-500">Ürün desteği</div>
                </div>
              </a>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <span className="text-xs text-gray-500">7/24 Destek • 2 Yıl Garanti • Hızlı Teslimat</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-black transition-colors duration-200 flex items-center justify-center"
            title="Yukarı çık"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleHelp}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          showHelp ? 'bg-red-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title="Yardım"
      >
        {showHelp ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;