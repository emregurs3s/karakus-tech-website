import { useState } from 'react';
import axios from 'axios';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

interface ShopierPaymentProps {
  onPaymentStart?: () => void;
  onPaymentError?: (error: string) => void;
}

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

const ShopierPayment = ({ onPaymentStart, onPaymentError }: ShopierPaymentProps) => {
  const { items, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      onPaymentError?.('Sepetinizde ürün bulunmuyor');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      onPaymentError?.('Lütfen tüm müşteri bilgilerini doldurun');
      return;
    }

    if (!shippingAddress.fullAddress || !shippingAddress.city) {
      onPaymentError?.('Lütfen teslimat adresini doldurun');
      return;
    }

    setLoading(true);
    onPaymentStart?.();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/payment/create-shopier-payment',
        {
          cartItems: items,
          totalAmount: getTotalPrice(),
          customerInfo,
          shippingAddress
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const { shopierFormData, shopierUrl } = response.data.data;
        
        // Create and submit form to Shopier
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = shopierUrl;
        form.target = '_self';

        // Add all form fields
        Object.entries(shopierFormData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentError?.(
        error.response?.data?.message || 'Ödeme işlemi başlatılırken hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Ödeme Bilgileri</h2>
      
      <form onSubmit={handlePayment} className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Müşteri Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta *
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="05XX XXX XX XX"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TC Kimlik No
              </label>
              <input
                type="text"
                value={customerInfo.tcNo}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, tcNo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="11 haneli TC kimlik numarası"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Teslimat Adresi</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tam Adres *
              </label>
              <textarea
                value={shippingAddress.fullAddress}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, fullAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Mahalle, sokak, bina no, daire no..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İl *
                </label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlçe
                </label>
                <input
                  type="text"
                  value={shippingAddress.district}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posta Kodu
                </label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Sipariş Özeti</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={`${item.product._id}-${item.color}-${item.size}`} className="flex justify-between">
                <span className="text-sm">
                  {item.product.title} ({item.color}, {item.size}) x {item.quantity}
                </span>
                <span className="text-sm font-medium">
                  {(item.product.price * item.quantity).toLocaleString('tr-TR')} ₺
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Toplam:</span>
                <span>{getTotalPrice().toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Ödeme Sayfasına Yönlendiriliyor...</span>
            </div>
          ) : (
            `${getTotalPrice().toLocaleString('tr-TR')} ₺ - Shopier ile Öde`
          )}
        </button>
      </form>

      {/* Payment Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Güvenli Ödeme</p>
            <p>Ödemeniz Shopier güvencesi altında işlenir. Kredi kartı, banka kartı ve diğer ödeme yöntemlerini kullanabilirsiniz.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopierPayment;