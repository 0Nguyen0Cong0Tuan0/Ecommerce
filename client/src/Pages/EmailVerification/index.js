// ICONS
import { React, useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// COMPONENTS
import Background from '../../Components/Background';
import useAuthStore from '../../store/authStore';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

const EmailVerification = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { error, isLoading, verifyEmail, isLogout } = useAuthStore();

    const context = useContext(MyContext);
    const { modeGradientTextPageClass, modeFocusInputCellClass, modeGradientBtnPageClass, modeGradientHoverBtnPageClass, modeFocusRingBtnPageClass } = getThemeStyles(context.themeMode);

    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        const nextIndex = value && index < 5 ? newCode.findIndex((digit, i) => i > index && digit === "") : newCode.findIndex((digit) => digit === "");
        const focusIndex = nextIndex !== -1 ? nextIndex : 5;
        inputRefs.current[focusIndex].focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");

        try {
            await verifyEmail(verificationCode);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }, [code, navigate, verifyEmail]);

    useEffect(() => {
        if (code.every((digit) => digit !== '')) {
            handleSubmit(new Event('submit'));
        }
    }, [code, handleSubmit]);

    return (
        <>
            <Background />
            <div className='absolute inset-0 flex items-center justify-center'>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'>
                    <h2 className={`text-3xl font-bold mb-6 text-center ${modeGradientTextPageClass}`}>
                        Verify Your Email
                    </h2>
                    <p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address</p>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='flex justify-between'>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type='text'
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-200 rounded-lg ${modeFocusInputCellClass}`}
                                />
                            ))}
                        </div>
                        {error && isLogout && <p className='tracking-wider text-red-500 font-semibold mt-2'>{error}</p>}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type='submit'
                            disabled={isLoading || code.some((digit) => !digit)}
                            className={`tracking-wider w-full ${modeGradientBtnPageClass} text-white font-bold py-3 px-4 rounded-lg shadow-lg ${modeGradientHoverBtnPageClass} ${modeFocusRingBtnPageClass} focus:ring-opacity-50 disabled:opacity-50`}>
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default EmailVerification;
