import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProducts, useCategories } from '../api/hooks';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/ui/LoadingSkeleton';

const Products = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  // API calls
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts({
    category: categoryFilter,
    search: searchQuery,
    sortBy: sortBy === 'default' ? 'createdAt' : sortBy,
    sortOrder,
    page: 1,
    limit: 50
  });

  const categories = categoriesData?.data || [];
  const products = productsData?.data || [];

  const handleCategoryFilter = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug) {
      newParams.set('category', categorySlug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    switch (value) {
      case 'price-low':
        setSortBy('price');
        setSortOrder('asc');
        break;
      case 'price-high':
        setSortBy('price');
        setSortOrder('desc');
        break;
      case 'name':
        setSortBy('title');
        setSortOrder('asc');
        break;
      default:
        setSortBy('createdAt');
        setSortOrder('desc');
        break;
    }
  };

  const currentCategory = categories.find(cat => cat.slug === categoryFilter);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-lg mb-4">
              {currentCategory ? currentCategory.name : searchQuery ? t('products.searchResults', { query: searchQuery }) : t('products.title')}
            </h1>
            <p className="body-md text-gray-600">
              {t('products.found', { count: productsData?.pagination?.total || 0 })}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-medium text-black mb-4 tracking-wide uppercase text-sm">
                  {t('products.categories')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryFilter('')}
                    className={`block w-full text-left py-2 px-3 rounded transition-colors duration-200 ${
                      !categoryFilter
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {t('products.all')}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryFilter(category.slug)}
                      className={`block w-full text-left py-2 px-3 rounded transition-colors duration-200 ${
                        categoryFilter === category.slug
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-8">
                <h3 className="font-medium text-black mb-4 tracking-wide uppercase text-sm">
                  {t('products.sort')}
                </h3>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors duration-200"
                >
                  <option value="createdAt-desc">{t('products.sortOptions.default')}</option>
                  <option value="price-low">{t('products.sortOptions.priceLow')}</option>
                  <option value="price-high">{t('products.sortOptions.priceHigh')}</option>
                  <option value="name">{t('products.sortOptions.name')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-gray-500 body-lg mb-6">{t('products.noResults')}</p>
                <button
                  onClick={() => {
                    setSearchParams(new URLSearchParams());
                    setSortBy('createdAt');
                    setSortOrder('desc');
                  }}
                  className="btn-primary"
                >
                  {t('products.clearFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;