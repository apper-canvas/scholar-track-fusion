import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

function NotFound() {
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[80vh] flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
        className="w-24 h-24 mb-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary"
      >
        <AlertTriangleIcon size={48} />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-white">
        404
      </h1>
      
      <p className="text-xl md:text-2xl mb-2 text-surface-600 dark:text-surface-300">
        Page Not Found
      </p>
      
      <p className="max-w-md mx-auto mb-8 text-surface-500 dark:text-surface-400">
        The page you're looking for doesn't exist or has been moved to another location.
      </p>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          <HomeIcon size={20} className="mr-2" />
          Return Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default NotFound;