import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAdminOrders, useUpdateOrderStatus } from '../../api/hooks';
import { useToastStore } from '../ui/Toast';

const AdminOrders = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToastStore();

  const { data: ordersData, isLoading } = useAdminOrders({
    page: currentPage,
    limit: 10,
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  const updateOrderStatusMutation = useUpdateOrderStatus();

  const orders = ordersData?.data || [];
  const totalPages = ordersData?.totalPages || 1;

  const orderStatuses = [
    { value: 'pending', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Ödendi', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Hazırlanıyor', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Kargoya Verildi', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' }
  ];

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        status: newStatus
      });
      showToast('Sipariş durumu güncellendi', 'success');
    } catch (error) {
      showToast('Sipariş durumu güncellenirken hata oluştu', 'error');
    }
  };

  const getStatusInfo = (status: string) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="heading-lg">Sipariş Yönetimi</h2>
        
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="all">Tüm Siparişler</option>
          {orderStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="heading-sm mb-2">Sipariş bulunamadı</h3>
            <p className="body-sm text-gray-600">Henüz hiç sipariş verilmemiş.</p>
          </div>
        ) : (
          orders.map((order: any) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Sipariş #{order.orderId}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(order.status).color}`}>
                    {getStatusInfo(order.status).label}
                  </span>
                  
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={updateOrderStatusMutation.isPending}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Müşteri Bilgileri</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Ad:</strong> {order.customerInfo?.name || order.user?.name || 'Bilinmiyor'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {order.customerInfo?.email || order.user?.email || 'Bilinmiyor'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Telefon:</strong> {order.customerInfo?.phone || 'Belirtilmemiş'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Teslimat Adresi</h4>
                  <p className="text-sm text-gray-600">
                    {order.customerInfo?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress?.fullAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress?.district}, {order.shippingAddress?.city}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Sipariş Detayları</h4>
                <div className="space-y-2">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-gray-600 text-xs">
                            {item.quantity} adet × {formatPrice(item.price)}
                          </p>
                          {item.color && item.color !== 'default' && (
                            <p className="text-gray-500 text-xs">Renk: {item.color}</p>
                          )}
                          {item.size && item.size !== 'Standart' && (
                            <p className="text-gray-500 text-xs">Boyut: {item.size}</p>
                          )}
                        </div>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.quantity * item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p><strong>Ödeme Yöntemi:</strong> {
                    order.paymentMethod === 'cash' ? 'Kapıda Ödeme' : 
                    order.paymentMethod === 'shopier' ? 'Kredi Kartı' : 
                    order.paymentMethod === 'transfer' ? 'Havale' : 'Bilinmiyor'
                  }</p>
                  <p><strong>Ödeme Durumu:</strong> {
                    order.paymentStatus === 'pending' ? 'Beklemede' :
                    order.paymentStatus === 'completed' ? 'Tamamlandı' :
                    order.paymentStatus === 'failed' ? 'Başarısız' :
                    order.paymentStatus === 'refunded' ? 'İade Edildi' : 'Bilinmiyor'
                  }</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    Toplam: {formatPrice(order.finalAmount)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Önceki
          </button>
          
          <span className="px-4 py-2 bg-black text-white rounded-lg">
            {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;