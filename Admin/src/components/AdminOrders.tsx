import { useState } from 'react';

interface Order {
  _id: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    fullAddress: string;
    city: string;
    district: string;
  };
  items: Array<{
    title: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
  }>;
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  notes?: string;
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

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    trackingNumber: '',
    notes: ''
  });

  // Mock data - gerçek uygulamada API'den gelecek
  const mockOrders: Order[] = [
    {
      _id: '1',
      orderId: 'ORDER_1699123456_abc123',
      customerInfo: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '05551234567'
      },
      shippingAddress: {
        fullAddress: 'Atatürk Mah. Cumhuriyet Cad. No:123 Daire:4',
        city: 'İstanbul',
        district: 'Kadıköy'
      },
      items: [
        {
          title: 'iPhone Şarj Kablosu',
          price: 150,
          quantity: 2,
          color: 'Beyaz',
          size: 'Standart'
        }
      ],
      totalAmount: 300,
      shippingCost: 29.90,
      finalAmount: 329.90,
      status: 'paid',
      paymentStatus: 'completed',
      trackingNumber: 'TK123456789',
      notes: 'Hızlı teslimat talep edildi',
      createdAt: '2024-11-01T10:30:00Z'
    },
    {
      _id: '2',
      orderId: 'ORDER_1699123457_def456',
      customerInfo: {
        name: 'Fatma Demir',
        email: 'fatma@example.com',
        phone: '05559876543'
      },
      shippingAddress: {
        fullAddress: 'Yeni Mah. Barış Sok. No:45',
        city: 'Ankara',
        district: 'Çankaya'
      },
      items: [
        {
          title: 'Airpods Pro',
          price: 899,
          quantity: 1,
          color: 'Beyaz',
          size: 'Standart'
        }
      ],
      totalAmount: 899,
      shippingCost: 0,
      finalAmount: 899,
      status: 'processing',
      paymentStatus: 'completed',
      createdAt: '2024-11-01T14:15:00Z'
    }
  ];

  // Component mount olduğunda mock data'yı set et
  useState(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  });

  const handleUpdateOrder = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      trackingNumber: order.trackingNumber || '',
      notes: order.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = () => {
    if (selectedOrder) {
      const updatedOrders = orders.map(order =>
        order._id === selectedOrder._id
          ? {
              ...order,
              status: updateData.status,
              trackingNumber: updateData.trackingNumber,
              notes: updateData.notes
            }
          : order
      );
      setOrders(updatedOrders);
      setShowUpdateModal(false);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h2>
        <div className="text-sm text-gray-500">
          Toplam {filteredOrders.length} sipariş
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arama
            </label>
            <input
              type="text"
              placeholder="Sipariş no, müşteri adı veya e-posta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum Filtresi
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tümü</option>
              {Object.entries(statusTexts).map(([status, text]) => (
                <option key={status} value={status}>{text}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderId.split('_')[1]}
                      </div>
                      {order.trackingNumber && (
                        <div className="text-xs text-gray-500">
                          Takip: {order.trackingNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerInfo.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerInfo.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress.city}, {order.shippingAddress.district}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₺{order.finalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items.length} ürün
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                      {statusTexts[order.status as keyof typeof statusTexts]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUpdateOrder(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sipariş Güncelle - #{selectedOrder.orderId.split('_')[1]}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(statusTexts).map(([status, text]) => (
                    <option key={status} value={status}>{text}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kargo Takip No
                </label>
                <input
                  type="text"
                  value={updateData.trackingNumber}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="TK123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notlar
                </label>
                <textarea
                  rows={3}
                  value={updateData.notes}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sipariş hakkında notlar..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                onClick={handleSaveUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;