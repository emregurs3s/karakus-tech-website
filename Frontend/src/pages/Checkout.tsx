import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';
import apiClient from '../api/client';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  tcNo?: string;
}

interface ShippingAddress {
  fullAddress: string;
  city: string;
  district: string;
  postalCode: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    tcNo: ''
  });
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullAddress: '',
    city: '',
    district: '',
    postalCode: ''
  });

  // Sepet boşsa anasayfaya yönlendir
  if (items.length === 0) {
    navigate('/');
    return null;
  }

  const handleShopierPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      addToast({
        message: 'Ödeme yapmak için giriş yapmalısınız',
        type: 'error'
      });
      navigate('/login');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      addToast({
        message: 'Lütfen tüm müşteri bilgilerini doldurun',
        type: 'error'
      });
      return;
    }

    if (!shippingAddress.fullAddress || !shippingAddress.city) {
      addToast({
        message: 'Lütfen teslimat adresini doldurun',
        type: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/payment/create-shopier-payment', {
        cartItems: items,
        totalAmount: getTotalPrice(),
        customerInfo,
        shippingAddress
      });

      if (response.success) {
        const { shopierFormData, shopierUrl } = response.data;
        
        // Shopier'a yönlendirmek için form oluştur
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = shopierUrl;
        form.style.display = 'none';

        // Form verilerini ekle
        Object.keys(shopierFormData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = shopierFormData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        
        // Sepeti temizle
        clearCart();
      }
    } catch (error: any) {
      addToast({
        message: error.message || 'Ödeme işlemi başlatılırken hata oluştu',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="heading-lg text-center mb-8">Ödeme</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sol Taraf - Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleShopierPayment} className="space-y-6">
                {/* Müşteri Bilgileri */}
                <div>
                  <h2 className="heading-sm mb-4">Müşteri Bilgileri</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TC Kimlik No
                      </label>
                      <input
                        type="text"
                        value={customerInfo.tcNo}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, tcNo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="11 haneli TC kimlik numarası"
                      />
                    </div>
                  </div>
                </div>

                {/* Teslimat Adresi */}
                <div>
                  <h2 className="heading-sm mb-4">Teslimat Adresi</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={shippingAddress.fullAddress}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, fullAddress: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Mahalle, sokak, bina no, daire no..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İl *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İlçe *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.district}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, district: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Ödeme Butonu */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Ödeme Hazırlanıyor...' : 'Shopier ile Öde'}
                </button>
              </form>
            </div>

            {/* Sağ Taraf - Sipariş Özeti */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="heading-sm mb-4">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      width="64"
                      height="64"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        {item.color} - {item.size} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ₺{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium">₺{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Kargo:</span>
                  <span className="font-medium">
                    {getTotalPrice() >= 500 ? 'Ücretsiz' : '₺29.90'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Toplam:</span>
                  <span>₺{(getTotalPrice() + (getTotalPrice() >= 500 ? 0 : 29.90)).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-800">
                    {getTotalPrice() >= 500 
                      ? 'Ücretsiz kargo kazandınız!' 
                      : `₺${(500 - getTotalPrice()).toFixed(2)} daha alışveriş yapın, ücretsiz kargo kazanın!`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;