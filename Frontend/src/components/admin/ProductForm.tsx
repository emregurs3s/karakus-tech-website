import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCategories, useCreateProduct, useUpdateProduct } from '../../api/hooks';
import { useToastStore } from '../ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import ImageUpload from '../ui/ImageUpload';

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    originalPrice: 0,
    images: [''],
    category: '',
    colors: [] as string[],
    sizes: ['Standart'], // Teknoloji ürünleri için varsayılan
    stock: 0,
    sku: '',
    isNew: false,
    isBestSeller: false,
    isActive: true
  });

  const { data: categoriesData } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const categories = categoriesData?.data || [];
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        images: product.images || [],
        category: product.category?._id || '',
        colors: product.colors || [],
        sizes: product.sizes || ['Standart'],
        stock: product.stock || 0,
        sku: product.sku || '',
        isNew: product.isNew || false,
        isBestSeller: product.isBestSeller || false,
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.slug || !formData.description || !formData.category) {
      addToast({
        message: 'Lütfen tüm zorunlu alanları doldurun',
        type: 'error'
      });
      return;
    }

    // Check if at least one image is uploaded
    const validImages = formData.images.filter(img => img.trim() !== '');
    if (validImages.length === 0) {
      addToast({
        message: 'En az bir ürün resmi yüklemelisiniz',
        type: 'error'
      });
      return;
    }

    // Clean data
    const cleanData = {
      ...formData,
      images: validImages,
      colors: formData.colors.filter(color => color.trim() !== ''),
      sizes: ['Standart'], // Teknoloji ürünleri için sabit
      originalPrice: formData.originalPrice || undefined
    };

    try {
      let response;
      if (isEditing) {
        response = await updateProductMutation.mutateAsync({
          id: product._id,
          data: cleanData
        });
      } else {
        response = await createProductMutation.mutateAsync(cleanData);
      }

      if (response?.success) {
        addToast({
          message: isEditing ? 'Ürün başarıyla güncellendi' : 'Ürün başarıyla oluşturuldu',
          type: 'success'
        });
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        onSuccess();
      } else {
        addToast({
          message: 'İşlem başarısız oldu',
          type: 'error'
        });
      }
    } catch (error: any) {
      addToast({
        message: error.message || 'Bir hata oluştu',
        type: 'error'
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug
    }));
  };

  const addArrayItem = (field: 'images' | 'colors') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'images' | 'colors', index: number) => {
    setFormData(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const updateArrayItem = (field: 'images' | 'colors', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleImagesChange = useCallback((images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="heading-md">
              {isEditing ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ürün Adı */}
            <div>
              <label className="block body-sm font-medium text-gray-700 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block body-sm font-medium text-gray-700 mb-2">
                URL Adı (Slug) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="ornek: iphone-15-sarj-aleti"
                required
              />
              <p className="text-xs text-gray-500 mt-1">URL'de görünecek isim (otomatik oluşturulur)</p>
            </div>

            {/* Kategori */}
            <div>
              <label className="block body-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SKU */}
            <div>
              <label className="block body-sm font-medium text-gray-700 mb-2">
                Stok Kodu (SKU) *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="ornek: IP15-CHG-001"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Ürün takip kodu (benzersiz olmalı)</p>
            </div>

            {/* Fiyat */}
            <div>
              <label className="block body-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Orijinal Fiyat */}
            <div>
              <label className="block body-sm font-medium text-gray-700 mb-2">
                Orijinal Fiyat (₺)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                min="0"
                step="0.01"
              />
            </div>

            {/* Stok */}
            <div>
              <label className="block body-sm font-medium text-gray-700 mb-2">
                Stok *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                min="0"
                required
              />
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block body-sm font-medium text-gray-700 mb-2">
              Açıklama *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Resimler */}
          <div>
            <label className="block body-sm font-medium text-gray-700 mb-4">
              Ürün Resimleri *
            </label>
            <ImageUpload
              onImagesChange={handleImagesChange}
              initialImages={formData.images.filter(img => img.trim() !== '')}
              multiple={true}
              maxFiles={5}
            />
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG, JPEG formatlarında maksimum 5 dosya yükleyebilirsiniz. Her dosya maksimum 5MB olmalıdır.
            </p>
          </div>

          {/* Renkler */}
          <div>
            <label className="block body-sm font-medium text-gray-700 mb-2">
              Renkler/Varyantlar
            </label>
            {formData.colors.length > 0 ? (
              formData.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateArrayItem('colors', index, e.target.value)}
                    placeholder="örn: Siyah, Beyaz, 64GB, 128GB"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('colors', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">Henüz varyant eklenmedi</p>
            )}
            <button
              type="button"
              onClick={() => addArrayItem('colors')}
              className="text-blue-600 hover:text-blue-800 body-sm"
            >
              + Varyant Ekle
            </button>
            <p className="text-xs text-gray-500 mt-1">Renk, kapasite, model gibi varyantları ekleyin (opsiyonel)</p>
          </div>



          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                className="mr-2"
              />
              <span className="body-sm">Yeni Ürün</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                className="mr-2"
              />
              <span className="body-sm">En Çok Satan</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="mr-2"
              />
              <span className="body-sm">Aktif</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
              className="btn-primary disabled:opacity-50"
            >
              {createProductMutation.isPending || updateProductMutation.isPending
                ? (isEditing ? 'Güncelleniyor...' : 'Oluşturuluyor...')
                : (isEditing ? 'Güncelle' : 'Oluştur')
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductForm;