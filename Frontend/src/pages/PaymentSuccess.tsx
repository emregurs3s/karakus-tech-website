import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

const PaymentSuccess = () => {
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Ödeme başarılı olduğunda sepeti temizle
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="heading-lg text-green-600 mb-4">Ödeme Başarılı!</h1>
        
        <p className="text-gray-600 mb-6">
          Siparişiniz başarıyla alındı. Kısa süre içinde size ulaşacağız.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/products"
            className="btn-primary w-full text-center block"
          >
            Alışverişe Devam Et
          </Link>
          
          <Link
            to="/"
            className="btn-secondary w-full text-center block"
          >
            Anasayfaya Dön
          </Link>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Bilgi:</strong> Sipariş durumunuz hakkında e-posta ile bilgilendirileceksiniz.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;