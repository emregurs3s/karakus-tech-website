import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from './client';
import { Category, Product, ApiResponse, PaginatedResponse, ProductFilters } from './types';

// Categories
export const useCategories = () => {
  return useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/categories'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategory = (slug: string) => {
  return useQuery<ApiResponse<Category>>({
    queryKey: ['category', slug],
    queryFn: () => apiClient.get(`/categories/${slug}`),
    enabled: !!slug,
  });
};

// Products
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery<PaginatedResponse<Product[]>>({
    queryKey: ['products', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      return apiClient.get(`/products?${params.toString()}`);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProduct = (slug: string) => {
  return useQuery<ApiResponse<Product>>({
    queryKey: ['product', slug],
    queryFn: () => apiClient.get(`/products/${slug}`),
    enabled: !!slug,
  });
};

export const useBestSellers = () => {
  return useQuery<ApiResponse<Product[]>>({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => apiClient.get('/products/featured/bestsellers'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: { name: string; email: string; password: string }) =>
      apiClient.post('/auth/register', userData),
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.get('/auth/me'),
    retry: false,
  });
};

// Admin hooks
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => apiClient.get('/admin/dashboard'),
  });
};

export const useAdminProducts = (filters: any = {}) => {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      return apiClient.get(`/admin/products?${params.toString()}`);
    },
  });
};

export const useAdminUsers = (filters: any = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      return apiClient.get(`/admin/users?${params.toString()}`);
    },
  });
};

export const useToggleProduct = () => {
  return useMutation({
    mutationFn: (productId: string) =>
      apiClient.patch(`/admin/products/${productId}/toggle`),
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (productId: string) =>
      apiClient.delete(`/admin/products/${productId}`),
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (productData: any) =>
      apiClient.post('/admin/products', productData),
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.put(`/admin/products/${id}`, data),
  });
};

// Order Management hooks
export const useAdminOrders = (filters: any = {}) => {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      return apiClient.get(`/admin/orders?${params.toString()}`);
    },
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      apiClient.patch(`/admin/orders/${orderId}/status`, { status }),
  });
};