// Input.js
// REACT
import React, { useContext } from 'react';

// COMPONENTS
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

const Input = ({ icon: Icon, toggleIcon: ToggleIcon, onToggle, ...props }) => {
  const context = useContext(MyContext);
  const { modeInputIconClass, modeFocusInputFieldClass } = getThemeStyles(context.themeMode);

  return (
    <div className='relative mb-6'>
      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
        <Icon className={`size-5 ${modeInputIconClass}`} />
      </div>

      <input
        {...props}
        className={`w-full pl-10 pr-10 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 ${modeFocusInputFieldClass} text-white placeholder-gray-400 transition duration-200`}
      />

      {ToggleIcon && (
        <div
          className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
          onClick={onToggle}
        >
          <ToggleIcon className={`size-5 ${modeInputIconClass}`} />
        </div>
      )}
    </div>
  );
};

export default Input;
