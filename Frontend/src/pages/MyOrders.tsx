import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useAuthStore } from '../store/authStore';

interface Order {
  _id: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    title: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
    image: string;
  }>;
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  createdAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusTexts = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  processing: 'Hazırlanıyor',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi'
};

const MyOrders = () => {
  const { isAuthenticated } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', statusFilter, currentPage],
    queryFn: async () => {
      const response = await apiClient.get(`/orders?status=${statusFilter}&page=${currentPage}&limit=10`);
      return response.data;
    },
    enabled: isAuthenticated
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-lg mb-4">Giriş Yapın</h1>
          <p className="text-gray-600 mb-6">Siparişlerinizi görüntülemek için giriş yapmalısınız.</p>
          <Link to="/login" className="btn-primary">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-lg mb-4 text-red-600">Hata</h1>
          <p className="text-gray-600">Siparişler yüklenirken bir hata oluştu.</p>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];
  const pagination = data?.pagination || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="heading-lg text-center mb-8">Siparişlerim</h1>

          {/* Status Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tümü
              </button>
              {Object.entries(statusTexts).map(([status, text]) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
              <h3 className="heading-sm text-gray-500 mb-2">Henüz siparişiniz yok</h3>
              <p className="text-gray-400 mb-6">İlk siparişinizi vermek için alışverişe başlayın.</p>
              <Link to="/products" className="btn-primary">
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: Order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          Sipariş #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                          {statusTexts[order.status as keyof typeof statusTexts]}
                        </span>
                        <span className="font-medium text-gray-900">
                          ₺{order.finalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Kargo Takip No:</strong> {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
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

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Ara Toplam:</span>
                        <span>₺{order.totalAmount.toFixed(2)}</span>
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-gray-600">Kargo:</span>
                          <span>₺{order.shippingCost.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center font-medium text-lg mt-2 pt-2 border-t border-gray-200">
                        <span>Toplam:</span>
                        <span>₺{order.finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyOrders;