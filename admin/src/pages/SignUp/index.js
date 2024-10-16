// REACT
import { React, useContext, useState } from 'react'
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// COMPONENTS
import Input from '../../components/Input';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';
import Background from '../../components/Background';
import useAuthStore from '../../store/authStore';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

// ICONS
import { User, Mail, Lock, Loader } from 'lucide-react';
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from "react-icons/fa"; // Import icons
import { FaSquareXTwitter } from 'react-icons/fa6';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const { signup, error, isLoading, isLogout } = useAuthStore();

  const navigate = useNavigate();

  const context = useContext(MyContext);
  const { modeGradientTextPageClass, modeInputIconClass, modeGradientBtnPageClass, modeGradientHoverBtnPageClass, modeFocusRingBtnPageClass } = getThemeStyles(context.themeMode);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate('/verify-email');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSocialSignUp = (provider) => {
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
          className={'max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'}
        >
          <div className='p-8'>
            <h2 className={`text-3xl font-bold mb-6 text-center ${modeGradientTextPageClass}`}>Create Account</h2>

            <form onSubmit={handleSignUp}>
              <Input
                icon={User}
                type='text'
                placeholder='Full Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                icon={Mail}
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                icon={Lock}
                type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleIcon={showPassword ? FaEyeSlash : FaEye} // Pass the correct icon
                onToggle={() => setShowPassword(!showPassword)} // Toggle password visibility
              />

              {error && isLogout && <p className={`${modeInputIconClass} font-semibold mt-2`}>{error}</p>}

              <PasswordStrengthMeter password={password} />

              {/* Social Media Login Buttons */}
              <div className='mb-0'>
                <p className='text-center text-gray-400 mb-3'>Or</p>

                <div className='flex justify-between'>
                  <motion.button
                    className='py-2 px-4 flex items-center bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 tracking-wider'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialSignUp('Facebook')}
                  >
                    <FaFacebook className='mr-2' />
                    Facebook
                  </motion.button>

                  <motion.button
                    className='py-2 px-4 flex items-center bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 tracking-wider'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialSignUp('Google')}
                  >
                    <FaGoogle className='mr-2' />
                    Google
                  </motion.button>

                  <motion.button
                    className='py-2 px-4 flex items-center bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 tracking-wider'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialSignUp('Twitter X')}
                  >
                    <FaSquareXTwitter className='mr-2' />
                    Twitter X
                  </motion.button>
                </div>
              </div>

              <motion.button
                className={`mt-5 w-full py-3 px-4 ${modeGradientBtnPageClass} text-white font-bold rounded-lg shadow-lg ${modeGradientHoverBtnPageClass} ${modeFocusRingBtnPageClass} transition duration-200`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? <Loader className='animate-spin mx-auto text-white text-lg	tracking-widest' size={24} /> : 'Sign Up'}

              </motion.button>
            </form>
          </div>

          <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
            <p className='text-sm text-gray-400'>
              Already have an account? {" "}
              <Link to={'/login'} className={`hover:underline ${modeInputIconClass}`}><span className={`tracking-wider font-bold ${modeGradientTextPageClass}`}>Login</span></Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignUpPage;

