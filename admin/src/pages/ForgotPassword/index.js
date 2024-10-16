// REACT
import { React, useContext, useState } from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// COMPONENTS
import useAuthStore from '../../store/authStore';
import Input from '../../components/Input';
import Background from '../../components/Background';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';


// ICONS
import { Mail, Loader, ArrowLeft } from 'lucide-react';


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { isLoading, forgotPassword } = useAuthStore();

    const context = useContext(MyContext);
    const { modeGradientTextPageClass, modeGradientBtnPageClass, modeGradientHoverBtnPageClass, modeInputIconClass, modeSendResetEmailIconClass, modeFocusRingBtnPageClass } = getThemeStyles(context.themeMode);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
        setIsSubmitted(true);
    }

    return (
        <>
            <Background />
            <div className='absolute inset-0 flex items-center justify-center'>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>

                    <div className='p-8'>
                        <h2 className={`text-3xl font-bold mb-6 text-center ${modeGradientTextPageClass}`}>
                            Forgot Password
                        </h2>

                        {
                            !isSubmitted ? (
                                <form onSubmit={handleSubmit}>
                                    <p className='text-gray-300 mb-6 text-center'>Enter your email address and we'll send you a link to reset your password</p>
                                    <Input
                                        icon={Mail}
                                        type='email'
                                        placeholder='Email Address'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full py-3 px-4 ${modeGradientBtnPageClass} text-white font-bold rounded-lg shadow-lg ${modeGradientHoverBtnPageClass} ${modeFocusRingBtnPageClass} transition duration-200`}
                                        type='submit'>
                                        {isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
                                    </motion.button>
                                </form>
                            ) : (
                                <div className='text-center'>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className={`w-16 h-16 ${modeSendResetEmailIconClass} rounded-full flex items-center justify-center mx-auto mb-4`}
                                    >

                                        <Mail className='w-8 h-8 text-white' />
                                    </motion.div>

                                    <p className='text-gray-300 mb-6'>
                                        If an account exists for {email}, you will receive a password reset link shortly.
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                        <Link to={'/login'} className={`hover:underline flex items-center ${modeInputIconClass}`}>
                            <ArrowLeft className={`h-4 w-4 mr-2 ${modeInputIconClass}`} /> <span className={`text-sm tracking-wider font-bold ${modeGradientTextPageClass}`}>Back to Login</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default ForgotPasswordPage
