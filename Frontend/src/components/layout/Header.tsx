import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useCategories } from '../../api/hooks';
import MiniCart from '../cart/MiniCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: categoriesData } = useCategories();
  const navigate = useNavigate();
  
  const categories = categoriesData?.data || [];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-black">
                Karakuş Tech
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category.slug}`}
                  className="text-gray-700 hover:text-black transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Search, Auth & Cart */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden sm:block">
                <input
                  type="text"
                  name="search"
                  placeholder="Ürün ara..."
                  className="w-64 px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors duration-200"
                />
              </form>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center space-x-4">
                  <span className="body-sm text-gray-700">Merhaba, {user?.name}</span>
                  <Link
                    to="/my-orders"
                    className="text-gray-700 hover:text-black transition-colors duration-200 body-sm font-medium"
                  >
                    Siparişlerim
                  </Link>
                  {user?.roles.includes('admin') && (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-black transition-colors duration-200 body-sm font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-black transition-colors duration-200 body-sm font-medium"
                  >
                    Çıkış
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-black transition-colors duration-200 body-sm font-medium"
                  >
                    Giriş
                  </Link>
                  <Link
                    to="/register"
                    className="bg-black text-white px-4 py-2 body-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}

              {/* Mobile Auth Buttons - Show only on mobile */}
              {!isAuthenticated && (
                <div className="flex items-center space-x-2 md:hidden">
                  <Link
                    to="/login"
                    className="p-2 text-gray-700 hover:text-black transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Cart - Hidden for admin users */}
              {!user?.roles.includes('admin') && (
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                    />
                  </svg>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-black"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="sm:hidden">
                  <input
                    type="text"
                    name="search"
                    placeholder="Ürün ara..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                  />
                </form>
                
                {/* Mobile Menu Items */}
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/products?category=${category.slug}`}
                    className="text-gray-700 hover:text-black transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-3">
                      <span className="body-sm text-gray-700">Merhaba, {user?.name}</span>
                      <Link
                        to="/my-orders"
                        className="text-gray-700 hover:text-black transition-colors duration-200 body-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Siparişlerim
                      </Link>
                      {user?.roles.includes('admin') && (
                        <Link
                          to="/admin"
                          className="text-gray-700 hover:text-black transition-colors duration-200 body-sm font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="text-left text-gray-700 hover:text-black transition-colors duration-200 body-sm font-medium"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-black transition-colors duration-200 body-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        to="/register"
                        className="bg-black text-white px-4 py-2 body-sm font-medium hover:bg-gray-800 transition-colors duration-200 text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Kayıt Ol
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MiniCart - Hidden for admin users */}
      {!user?.roles.includes('admin') && <MiniCart />}
    </>
  );
};

export default Header;