import { Link } from 'react-router-dom';  // Import the Link component from react-router-dom
import CountryDropdown from '../CountryDropdown';
import SearchBox from './SearchBox';
import Navigation from './Navigation';
import Button from '@mui/material/Button';

// Graphic
import logo from '../../assets/lr.gif';
import { FiUser } from 'react-icons/fi';
import { IoBagOutline } from 'react-icons/io5';

import { useContext } from 'react';
import { MyContext } from '../../App';

const Header = () => {
    const context = useContext(MyContext);

    return (
        <>
            <div className="mb-8">
                <div className="bg-purple">
                    <div className="container mx-auto py-2 text-center">
                        <p className="text-white text-sm">Due to the <b>COVID-19</b> epidemic, orders may be processed with a slight delay</p>
                    </div>
                </div>

                <header className="bg-white shadow-md">
                    <div className="container mx-auto py-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <Link to={'/'}>
                                    <img src={logo} alt='logo' className="h-16" />
                                </Link>
                            </div>

                            <div className='px-8 flex-1 flex items-center justify-between'>
                                {/* Drop Down Box Start Here */}
                                {context.countryList.length !== 0 && <CountryDropdown />}
                                {/* Drop Down Box End Here */}

                                {/* Header Search Start Here */}
                                <SearchBox />
                                {/* Header Search End Here */}

                                <div className='flex items-center space-x-4'>
                                    {
                                        context.isLogin === false ? (
                                            <Link to='signin'>
                                                <Button className='bg-blue-500 text-white px-4 py-2 rounded'>Sign In</Button>
                                            </Link>
                                        ) : (
                                            <Button className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                                                <FiUser />
                                            </Button>
                                        )
                                    }

                                    <div className='flex items-center'>
                                        <span className='text-lg'>$3.29</span>
                                        <Link to='/cart'>
                                            <div className='relative ml-2'>
                                                <Button className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                                                    <IoBagOutline />
                                                </Button>
                                                <span className='absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
                                                    1
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <Navigation />
            </div>
        </>
    );
}

export default Header;
