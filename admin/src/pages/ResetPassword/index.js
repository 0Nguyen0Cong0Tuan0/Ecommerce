// REACTS
import { React, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

// COMPONENTS
import useAuthStore from '../../store/authStore';
import Input from '../../components/Input';
import Background from '../../components/Background';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

// ICONS
import { Lock } from 'lucide-react';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons


const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    const { resetPassword, error, isLoading, message, isCheckingAuth } = useAuthStore();

    const context = useContext(MyContext);
    const { modeGradientTextPageClass, modeInputIconClass, modeGradientBtnPageClass, modeGradientHoverBtnPageClass, modeFocusRingBtnPageClass } = getThemeStyles(context.themeMode);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await resetPassword(token, password);


            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <>
            <Background />
            <div className='absolute inset-0 flex items-center justify-center'>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
                >

                    <div className='p-8'>
                        <h2 className={`text-3xl font-bold mb-6 text-center ${modeGradientTextPageClass}`}>
                            Reset Password
                        </h2>

                        {
                            error && isCheckingAuth && <p className={`${modeInputIconClass} text-sm mb-4`}>{error}</p>
                        }

                        {
                            message && <p className={`${modeInputIconClass} text-sm mb-4`}>{message}</p>
                        }

                        <form onSubmit={handleSubmit}>
                            <Input
                                icon={Lock}
                                type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                placeholder='New Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                toggleIcon={showPassword ? FaEyeSlash : FaEye} // Pass the correct icon
                                onToggle={() => setShowPassword(!showPassword)} // Toggle password visibility
                                required
                            />

                            <Input
                                icon={Lock}
                                type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                placeholder='Confirm New Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                toggleIcon={showPassword ? FaEyeSlash : FaEye} // Pass the correct icon
                                onToggle={() => setShowPassword(!showPassword)} // Toggle password visibility
                                required
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-3 px-4 ${modeGradientBtnPageClass} text-white font-bold rounded-lg shadow-lg ${modeGradientHoverBtnPageClass} ${modeFocusRingBtnPageClass} transition duration-200`}
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading ? "Resetting..." : "Set New Password"}
                            </motion.button>
                        </form>
                    </div>

                </motion.div>
            </div>
        </>
    )
}

export default ResetPasswordPage
