import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAdminProducts, useToggleProduct, useDeleteProduct } from '../../api/hooks';
import { useToastStore } from '../ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import ProductForm from './ProductForm';

const AdminProducts = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const { data: productsData, isLoading } = useAdminProducts(filters);
  const toggleProductMutation = useToggleProduct();
  const deleteProductMutation = useDeleteProduct();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const products = productsData?.data || [];

  const handleToggleProduct = async (productId: string) => {
    try {
      const response = await toggleProductMutation.mutateAsync(productId);
      if (response.success) {
        addToast({
          message: response.message,
          type: 'success'
        });
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      }
    } catch (error: any) {
      addToast({
        message: error.message || t('admin.productStatusError'),
        type: 'error'
      });
    }
  };

  const handleDeleteProduct = async (productId: string, productTitle: string) => {
    if (!confirm(t('admin.confirmDelete', { title: productTitle }))) {
      return;
    }

    try {
      const response = await deleteProductMutation.mutateAsync(productId);
      if (response.success) {
        addToast({
          message: t('admin.productDeleted'),
          type: 'success'
        });
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      }
    } catch (error: any) {
      addToast({
        message: error.message || t('admin.productDeleteError'),
        type: 'error'
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
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
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block body-sm font-medium text-gray-700 mb-2">
              {t('admin.filters.search')}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder={t('admin.filters.searchPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          
          <div>
            <label className="block body-sm font-medium text-gray-700 mb-2">
              {t('admin.filters.category')}
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">{t('admin.filters.allCategories')}</option>
              <option value="sarj-aletleri">Şarj Aletleri</option>
              <option value="airpods-kulaklik">Airpods & Kulaklık</option>
              <option value="powerbank">Powerbank</option>
            </select>
          </div>
          
          <div>
            <label className="block body-sm font-medium text-gray-700 mb-2">
              {t('admin.filters.status')}
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">{t('admin.filters.all')}</option>
              <option value="active">{t('product.active')}</option>
              <option value="inactive">{t('product.inactive')}</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary w-full"
            >
              {t('admin.addProduct')}
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.table.product')}
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.table.category')}
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.table.price')}
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.table.stock')}
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.table.status')}
                </th>
                <th className="px-6 py-3 text-left body-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product: any, index: number) => (
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
                        src={
                          product.images && product.images[0]
                            ? (product.images[0].startsWith('/uploads/') 
                                ? `http://localhost:5004${product.images[0]}` 
                                : product.images[0])
                            : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                        }
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                        }}
                      />
                      <div>
                        <div className="body-md font-medium text-gray-900">
                          {product.title}
                        </div>
                        <div className="body-sm text-gray-500">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="body-sm text-gray-900">
                      {product.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="body-sm text-gray-900">
                      ₺{product.price}
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through ml-2">
                          ₺{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`body-sm ${
                      product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? t('product.active') : t('product.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right body-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-xs font-medium transition-colors duration-200"
                      >
                        {t('admin.actions.edit')}
                      </button>
                      <button
                        onClick={() => handleToggleProduct(product._id)}
                        disabled={toggleProductMutation.isPending}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                          product.isActive
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {product.isActive ? t('admin.actions.deactivate') : t('admin.actions.activate')}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id, product.title)}
                        disabled={deleteProductMutation.isPending}
                        className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-xs font-medium transition-colors duration-200"
                      >
                        {t('admin.actions.delete')}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-500 body-lg">{t('admin.noProducts')}</p>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default AdminProducts;