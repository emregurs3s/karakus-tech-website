import { useLanguageStore } from '../../store/languageStore';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative overflow-hidden px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200 border border-gray-300 hover:border-black rounded-md min-w-[50px]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ x: language === 'tr' ? -20 : 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: language === 'tr' ? 20 : -20, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className="font-medium text-sm uppercase block"
        >
          {language === 'tr' ? 'TR' : 'EN'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default LanguageToggle;