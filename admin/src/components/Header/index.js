// ICONS
import { MdMenuOpen, MdOutlineMenu } from 'react-icons/md';

// COMPONENTS
import Searchbox from '../Searchbox';
import Action from '../Action';
import User from '../User';
import useAuthStore from '../../store/authStore';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

// MATERIAL UI
import Button from '@mui/material/Button';

// REACT
import { React, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const context = useContext(MyContext);
  
  const { user } = useAuthStore();
  const { nameClass, logoClass, mainBackgroundClass, modeGradientClass, modeGradientTextClass, buttonHoverBg } = getThemeStyles(context.themeMode);

  const navigate = useNavigate(); // No need to assign to 'history'

  const handleClickSignIn = () => {
    navigate('/login'); // Direct navigation function
  };

  const handleClickSignUp = () => {
    navigate('/signup'); // Direct navigation function
  };

  // Conditionally apply styles based on themeMode
  

  return (
    <>
      <header className={`w-full h-20 pt-2 ${mainBackgroundClass}`}>
        <div className="container">
          <div className="flex justify-between items-center mx-10 py-0">
            {/* Logo Wrapper */}
            <Link className="flex items-end pb-3" to="/">
              <img src={`${logoClass}`} className="w-14" alt="Logo" />
              <span
                className={`text-5xl font-bold ${modeGradientTextClass} ml-2`}
              >
                {`${nameClass}`}
              </span>
            </Link>

            {/* Menu and Search Box */}
            <div className="flex items-center">
              <Button
                className="hover:bg-transparent"
                onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}
                sx={{
                  minWidth: '20px',
                  minHeight: '20px',
                  marginRight: '20px',
                  borderRadius: '100%',
                }}
              >
                {context.isToggleSidebar ? (
                  <MdOutlineMenu
                    className={context.themeMode ? 'fill-red-700 hover:fill-black' : 'fill-purple-500 hover:fill-white'}
                    size={25}
                  />
                ) : (
                  <MdMenuOpen
                    className={context.themeMode ? 'fill-red-700 hover:fill-black' : 'fill-purple-500 hover:fill-white'}
                    size={25}
                  />
                )}
              </Button>
              <Searchbox className="ml-4" />
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-1">
              <Action />

              {user ? (
                <User user={user} />
              ) : (
                <div>
                  <Button
                    onClick={handleClickSignUp}
                    sx={{
                      '&:hover': {
                        background: buttonHoverBg,
                      },
                      border: '2px solid black',
                      px: '10px',
                      py: '3px',
                      borderRadius: '10px',
                      mx: '5px',
                    }}
                  >
                    <span className={`p-0.5 font-bold rounded-lg text-lg  ${modeGradientTextClass} hover:text-white`}>
                      Sign Up
                    </span>
                  </Button>

                  <Button
                    onClick={handleClickSignIn}
                    sx={{
                      '&:hover': {
                        background: buttonHoverBg,
                      },
                      border: '2px solid black',
                      px: '10px',
                      py: '3px',
                      borderRadius: '10px',
                      mx: '5px',
                    }}
                  >
                    <span className={`p-0.5 font-bold rounded-lg text-lg ${modeGradientTextClass} hover:text-white`}>
                      Sign In
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={`w-full h-1 ${modeGradientClass}`}></div>
    </>
  );
};

export default Header;
