import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

const LoadingSpinner = () => {
  const context = useContext(MyContext);
  
  if (!context) {
    // This ensures that you are handling cases where the context might not be available
    console.log(context);
    return <div>Error: Context not provided</div>;
  }

  const { modeGradientClass } = getThemeStyles(context.themeMode);

  return (
    <div className={`min-h-screen ${modeGradientClass} flex items-center justify-center relative overflow-hidden`}>
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-t-green-500 border-green-200 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
    </div>
  );
};

export default LoadingSpinner;
