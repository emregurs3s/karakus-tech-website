import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../api/hooks';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';

const Register = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      addToast({
        message: t('auth.passwordMismatch'),
        type: 'error'
      });
      return;
    }
    
    try {
      const response = await registerMutation.mutateAsync({ name, email, password });
      
      if ((response as any).success) {
        login((response as any).data.token, (response as any).data.user);
        addToast({
          message: t('auth.registerSuccess'),
          type: 'success'
        });
        navigate('/');
      }
    } catch (error: any) {
      addToast({
        message: error.message || t('auth.registerError'),
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image */}
      <div className="hidden sm:flex lg:w-1/2 relative">
        <img
          src="/auth-bg.jpg"
          alt="Karakuş Tech"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Karakuş Tech</h1>
            <p className="text-xl">Teknoloji dünyasına katılın</p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        {/* Mobile Image - Show only on mobile */}
        <div className="sm:hidden mb-8 mx-auto">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
            <img
              src="/auth-bg.jpg"
              alt="Karakuş Tech"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="mx-auto w-full max-w-sm lg:w-96">
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
            {t('auth.registerTitle')}
          </h2>
          <p className="mt-2 body-sm text-gray-600">
            {t('auth.haveAccount')}{' '}
            <Link
              to="/login"
              className="font-medium text-black hover:text-gray-700 underline"
            >
              {t('auth.signIn')}
            </Link>
          </p>
        </motion.div>
      </div>

        <div className="mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white py-8 px-8 shadow-lg rounded-lg border border-gray-200"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block body-sm font-medium text-gray-700">
                {t('auth.fullName')}
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-none placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black body-md"
                  placeholder={t('auth.namePlaceholder')}
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-none placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black body-md"
                  placeholder={t('auth.passwordPlaceholder')}
                />
              </div>
              <p className="mt-1 body-sm text-gray-500">{t('auth.passwordMinLength')}</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block body-sm font-medium text-gray-700">
                {t('auth.confirmPassword')}
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-none placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black body-md"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block body-sm text-gray-900">
                {t('auth.acceptTerms')}{' '}
                <a href="#" className="text-black hover:text-gray-700 underline">
                  {t('auth.termsAndConditions')}
                </a>{' '}
                {t('auth.and')}{' '}
                <a href="#" className="text-black hover:text-gray-700 underline">
                  {t('auth.privacyPolicy')}
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="btn-primary w-full flex justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerMutation.isPending ? t('auth.creating') : t('auth.createAccount')}
              </button>
            </div>
          </form>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;