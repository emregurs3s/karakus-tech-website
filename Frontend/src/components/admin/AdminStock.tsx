import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminProducts } from '../../api/hooks';

const AdminStock = () => {
  const [stockFilter, setStockFilter] = useState('low'); // low, out, all
  
  const { data: productsData, isLoading } = useAdminProducts({
    status: 'active' // Sadece aktif ürünleri göster
  });
  
  const allProducts = productsData?.data || [];
  
  // Stok durumuna göre filtrele
  const filteredProducts = allProducts.filter((product: any) => {
    switch (stockFilter) {
      case 'low':
        return product.stock > 0 && product.stock < 10;
      case 'out':
        return product.stock === 0;
      case 'all':
        return true;
      default:
        return product.stock < 10;
    }
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { text: 'Tükendi', color: 'bg-red-100 text-red-800' };
    } else if (stock < 5) {
      return { text: 'Kritik', color: 'bg-red-100 text-red-800' };
    } else if (stock < 10) {
      return { text: 'Düşük', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Normal', color: 'bg-green-100 text-green-800' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="body-sm text-gray-600">Tükenen Ürünler</p>
              <p className="heading-sm">{allProducts.filter((p: any) => p.stock === 0).length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="body-sm text-gray-600">Düşük Stok</p>
              <p className="heading-sm">{allProducts.filter((p: any) => p.stock > 0 && p.stock < 10).length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="body-sm text-gray-600">Normal Stok</p>
              <p className="heading-sm">{allProducts.filter((p: any) => p.stock >= 10).length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setStockFilter('low')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              stockFilter === 'low'
                ? 'bg-yellow-100 text-yellow-800'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            Düşük Stok (1-9)
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              stockFilter === 'out'
                ? 'bg-red-100 text-red-800'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            Tükenen (0)
          </button>
          <button
            onClick={() => setStockFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              stockFilter === 'all'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            Tümü
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  Mevcut Stok
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  Son Güncelleme
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product: any, index: number) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="body-md font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="body-sm text-gray-500">
                            {product.category?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="body-sm text-gray-900 font-mono">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`body-md font-medium ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 5 ? 'text-red-600' :
                        product.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {product.stock} adet
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="body-sm text-gray-900">
                        {new Date(product.updatedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-500 body-lg">
            {stockFilter === 'low' && 'Düşük stoklu ürün bulunamadı'}
            {stockFilter === 'out' && 'Tükenen ürün bulunamadı'}
            {stockFilter === 'all' && 'Ürün bulunamadı'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminStock;