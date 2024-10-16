// themeConfig.js
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import logo from '../assets/logo/lr1.gif';
import logoDark from '../assets/logo/gr1.webp';

export const getThemeStyles = (themeMode) => {
    return {
        nameClass: themeMode
            ? 'THE LAMB'
            : 'THE GOAT',
        logoClass: themeMode
            ? logo
            : logoDark,
        mainBackgroundClass: themeMode
            ? 'bg-white text-[#1f2937]'
            : 'bg-gray-800 text-white',
        modeInputClass: themeMode
            ? 'bg-white text-[#1f2937]'
            : 'bg-gray-800 text-white',
        buttonHoverBg: themeMode
            ? 'linear-gradient(to top, #b91c1c, #ef4444, #000)'
            : 'linear-gradient(to top, #fbbf24, #f97316, #9ca3af)',
        iconClass: themeMode
            ? 'fill-red-700 hover:fill-black'
            : 'fill-purple-700 hover:fill-white',
        modeGradientNoDirection: themeMode
            ? 'from-red-700 via-red-500 to-black'
            : 'from-purple-700 via-purple-500 to-gray-500',
        modeGradientClass: themeMode
            ? 'bg-gradient-to-r from-red-700 via-red-500 to-black'
            : 'bg-gradient-to-r from-purple-700 via-purple-500 to-gray-500',
        modeGradientBtnPageClass: themeMode
            ? 'bg-gradient-to-r from-red-700 to-red-500'
            : 'bg-gradient-to-r from-purple-700 to-purple-500',
        modeGradientHoverBtnPageClass: themeMode
            ? 'hover:bg-gradient-to-r hover:from-red-500 hover:to-red-700'
            : 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700',
        modeGradientTextPageClass: themeMode
            ? 'bg-gradient-to-r from-red-700 to-red-500 text-transparent bg-clip-text'
            : 'bg-gradient-to-r from-purple-700 to-purple-500 text-transparent bg-clip-text',
        modeGradientTextClass: themeMode
            ? 'bg-gradient-to-r from-red-700 via-red-500 to-black text-transparent bg-clip-text'
            : 'bg-gradient-to-r from-purple-700 via-purple-500 to-gray-500 text-transparent bg-clip-text',
        backgroundColorClass: themeMode
            ? 'rgba(255, 255, 255, 0.95)'  // Light mode background
            : 'rgba(31, 41, 55, 0.95)',    // Dark mode background
        textColorClass: themeMode ? 'text-gray-700' : 'text-white',
        iconModeClass: themeMode
            ? <MdDarkMode className="fill-red-700 hover:fill-black" size={30} />
            : <MdLightMode className="fill-purple-700 hover:fill-white" size={30} />,
        actionBtnClass: themeMode
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-purple-500 hover:bg-purple-600',
        hoverBtnClass: themeMode
            ? 'hover:bg-gradient-to-r hover:from-red-700 hover:via-red-500 hover:to-black hover:text-transparent hover:bg-clip-text'
            : 'hover:bg-gradient-to-r hover:from-purple-700 hover:via-purple-500 hover:to-gray-500 hover:text-transparent hover:bg-clip-text',
        modeNotificationTextClass: themeMode
            ? 'text-[#1f2937]'
            : 'text-white',
        modeProductDetailsTextClass: themeMode
            ? 'text-white'
            : 'text-[#1f2937]',
        modeSelectionBoxClass: themeMode
            ? 'white'
            : '#1f2937',
        modeArrowSelectionBoxClass: themeMode
            ? '#1f2937'
            : 'white',
        modeInputIconClass: themeMode
            ? 'text-red-500'
            : 'text-purple-500',
        modeSendResetEmailIconClass: themeMode
            ? 'bg-red-500'
            : 'bg-purple-500',
        modeTextFieldFocusClass: themeMode
            ? '#7f1d1d'
            : '#581c87',
        modeCheckBoxCheckedClass: themeMode
            ? '#ef4444'
            : '#a855f7',
        modeTextFieldInputClass: themeMode
            ? '#1f2937'
            : 'white',
        modeImagesInputClass: themeMode
            ? 'text-white'
            : 'text-[#1f2937]',
        modeFocusRingBtnPageClass: themeMode
            ? 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            : 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
        modeFocusInputFieldClass: themeMode
            ? 'focus:border-red-700 focus:ring-2 focus:ring-red-500'
            : 'focus:border-purple-700 focus:ring-2 focus:ring-purple-500',
        modeFocusInputCellClass: themeMode
            ? 'focus:border-red-500 focus:outline-none'
            : 'focus:border-purple-500 focus:outline-none',
    };
};
