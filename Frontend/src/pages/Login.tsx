import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../api/hooks';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  
  const loginMutation = useLogin();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      
      if (response.success) {
        // Auth store'a kaydet
        login(response.data.token, response.data.user);
        
        // localStorage'a da manuel kaydet (ImageUpload için)
        localStorage.setItem('token', response.data.token);
        
        addToast({
          message: t('auth.loginSuccess'),
          type: 'success'
        });
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      addToast({
        message: error.message || t('auth.loginError'),
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link to="/" className="heading-lg text-black">
            Karakuş Tech
          </Link>
          <h2 className="mt-6 heading-md text-gray-900">
            {t('auth.loginTitle')}
          </h2>
          <p className="mt-2 body-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="font-medium text-black hover:text-gray-700 underline"
            >
              {t('auth.signUp')}
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block body-sm font-medium text-gray-700">
                {t('auth.emailAddress')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-none placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black body-md"
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block body-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-none placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black body-md"
                  placeholder={t('auth.passwordPlaceholder')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block body-sm text-gray-900">
                  {t('auth.rememberMe')}
                </label>
              </div>

              <div className="body-sm">
                <a href="#" className="font-medium text-black hover:text-gray-700 underline">
                  {t('auth.forgotPassword')}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="btn-primary w-full flex justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? t('auth.loggingIn') : t('auth.login')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center body-sm">
                <span className="px-2 bg-white text-gray-500">{t('auth.testAccounts')}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@karakustech.com');
                  setPassword('admin123');
                }}
                className="btn-secondary w-full"
              >
                {t('auth.adminAccount')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@karakustech.com');
                  setPassword('user123');
                }}
                className="btn-secondary w-full"
              >
                {t('auth.userAccount')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;