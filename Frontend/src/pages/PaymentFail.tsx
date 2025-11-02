import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentFail = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="heading-lg text-red-600 mb-4">Ödeme Başarısız</h1>
        
        <p className="text-gray-600 mb-6">
          Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyiniz.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/checkout"
            className="btn-primary w-full text-center block"
          >
            Tekrar Dene
          </Link>
          
          <Link
            to="/cart"
            className="btn-secondary w-full text-center block"
          >
            Sepete Dön
          </Link>
          
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 text-sm block"
          >
            Anasayfaya Dön
          </Link>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Sorun devam ederse:</strong> Müşteri hizmetlerimizle iletişime geçin.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFail;