// ICONS
import { Mail, Lock, Loader } from 'lucide-react';
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

// REACT
import { React, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// COMPONENTS
import Input from '../../components/Input';
import Background from '../../components/Background';
import useAuthStore from '../../store/authStore';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const { error, isLoading, login, isLogout } = useAuthStore();

  const context = useContext(MyContext);
  const {modeGradientTextPageClass, modeInputIconClass, modeGradientBtnPageClass, modeGradientHoverBtnPageClass, modeFocusRingBtnPageClass} = getThemeStyles(context.themeMode);

  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();

    try { 
      await login(email, password);
      navigate('/');
    } catch(error) {
      console.log(error);
    }
  }

  const handleSocialLogin = (provider) => {
    // Handle social login (Google, Facebook, Twitter X)
    console.log(`Logging in with ${provider}`);
  };

  return (
    <>
      <Background />
      <div className='absolute inset-0 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-md w-full bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >

          <div className='p-8'>
            <h2 className={`text-3xl font-bold mb-6 text-center ${modeGradientTextPageClass}`}>
              Welcome Back
            </h2>

            <form onSubmit={handleLogin}>
              <Input
                icon={Mail}
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleIcon={showPassword ? FaEyeSlash : FaEye}
                onToggle={() => setShowPassword(!showPassword)}
              />

              <div className={`hover:underline ${modeInputIconClass}`}>
                <Link to='/forgot-password'>
                  <span className={`tracking-wider font-bold text-sm ${modeGradientTextPageClass}`}>Forgot password?</span>
                </Link>
              </div>

              { error && isLogout && <p className={`${modeInputIconClass} font-semibold mb-4`}>{error}</p> }

              {/* Social Media Login Buttons */}
              <div className='mb-5'>
                <p className='text-center text-gray-400 mb-3'>Or</p>

                <div className='flex justify-between'>
                  <motion.button
                    className='py-2 px-4 flex items-center bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 tracking-wider'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin('Facebook')}
                  >
                    <FaFacebook className='mr-2' />
                    Facebook
                  </motion.button>

                  <motion.button
                    className='py-2 px-4 flex items-center bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 tracking-wider'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <FaGoogle className='mr-2' />
                    Google
                  </motion.button>

                  <motion.button
                    className='py-2 px-4 flex items-center bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 tracking-wider'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin('Twitter X')}
                  >
                    <FaSquareXTwitter className='mr-2' />
                    Twitter X
                  </motion.button>
                </div>
              </div>

              <motion.button
                className={`w-full py-3 px-4 ${modeGradientBtnPageClass}  text-white font-bold rounded-lg shadow-lg ${modeGradientHoverBtnPageClass} ${modeFocusRingBtnPageClass} transition duration-200`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                disabled={isLoading}>
                  { isLoading ? <Loader className='size-6 animate-spin mx-auto'/> : "Login" }
              </motion.button>
            </form>


          </div>

          <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
            <p className='text-sm text-gray-400'>
              Don&apos;t have an account?{" "}
              <Link to='/signup' className={`hover:underline ${modeInputIconClass}`}>
                <span className={`tracking-wider font-bold ${modeGradientTextPageClass}`}>
                  Sign Up
                </span>
              </Link>
            </p>
          </div>

        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
