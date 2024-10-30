import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataFromApi } from './utils/api';
import { MyContext } from '../../App';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  const { isAuthenticated, client } = useAuthStore();
  const context = useContext(MyContext);

  // Fade-in effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100); // Delay before starting the fade-in effect
    return () => clearTimeout(timer);
  }, []);

  const handleReturnHome = () => {
    window.scrollTo(0, 0);
    if (isAuthenticated && client?._id) {
      context.setIsLoading(true); // Start loading before fetching
      fetchDataFromApi(`/api/cart?clientId=${client._id}`).then((res) => {
        context.setCartData(res);
        context.setIsLoading(false); // Stop loading after fetching
        navigate('/');
      });
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center bg-gray-100 mb-[100px] py-[70px] transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center transform transition-transform duration-500 hover:scale-105">
        <h1 className="text-2xl font-bold mb-4 text-green-600 animate-fadeIn tracking-wider">Thank You for Your Order!</h1>
        <p className="text-gray-700 mb-6 animate-fadeIn">Your order has been placed successfully. We'll notify you when it ships.</p>
        <button
          onClick={handleReturnHome}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200 shadow-md hover:shadow-lg transform transition-transform duration-300 hover:scale-105 tracking-widest"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
