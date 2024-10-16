import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown, FaAngleRight, FaProductHunt } from 'react-icons/fa6';
import { CiHome, CiShop } from 'react-icons/ci';
import { FaBlogger, FaPhoneAlt } from "react-icons/fa";
import { useState, useContext } from 'react';
import { MyContext } from '../../../App';

const Navigation = () => {
    const [isOpenSideBarNav, setIsOpenSideBarNav] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(null);

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const handleMouseEnter = (id) => {
        setDropdownVisible(id);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(null);
    };

    const navigateCategoryProductPage = (id) => {
        setIsOpenSideBarNav(!isOpenSideBarNav)
        navigate(`/category/${id}`)
    }

    const navigateSubCategoryProductPage = (id) => {
        setIsOpenSideBarNav(!isOpenSideBarNav)
        navigate(`/subcategory/${id}`)
    }

    return (
        <nav className="container mx-auto mt-4">
            <div className="flex">
                {/* Sidebar Navigation */}
                <div className="w-5/12">
                    <div className="relative z-50">
                        <button
                            className={`bg-blue-400 text-white py-2 w-[275px] rounded-full transition-all duration-300 flex flex-row justify-around items-center ${isOpenSideBarNav ? 'rounded-b-[0px]' : ''}`}
                            onClick={() => setIsOpenSideBarNav(!isOpenSideBarNav)}
                        >
                            <span className="mr-2 text-lg"><IoIosMenu /></span>
                            <span className="font-semibold tracking-wide">ALL CATEGORIES</span>
                            <span className={`ml-2 transition-all duration-300 text-sm ${!isOpenSideBarNav ? 'rotate-[270deg]' : 'rotate-[360deg]'}`}><FaAngleDown /></span>
                        </button>

                        {/* Sidebar Dropdown */}
                        <div
                            className={`absolute ${!dropdownVisible ? 'w-[275px]' : 'w-[550px]'} top-full left-0 right-0 z-50 bg-white border border-gray-200 transition-all duration-300 ${isOpenSideBarNav ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                        >
                            <ul className="overflow-y-auto max-h-[300px]">
                                {context.catData?.categoryList?.length > 0 &&
                                    context.catData.categoryList.map((cat, index) => (
                                        <li
                                            key={cat.id}
                                            onMouseOver={() => handleMouseEnter(cat.id)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <Button
                                                sx={{ borderRadius: '0px' }}
                                                className={`w-[272px] py-2 pl-4 pr-3 hover:bg-gray-200 flex items-center`}
                                                onClick={() => navigateCategoryProductPage(cat.id)}
                                            >
                                                <img src={cat.images[0].url} alt={cat.name} className="w-6 h-6 mr-3" />
                                                <p className="text-black">{cat.name}</p>
                                                <FaAngleRight className="ml-auto text-sm opacity-50 text-black" />
                                            </Button>


                                            {/* Subcategory Dropdown */}
                                            <div
                                                className={`absolute z-50 top-0 right-0 w-[275px] bg-white border border-gray-200 transition-all duration-200 ${dropdownVisible === cat.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                                            >
                                                <ul className="overflow-y-auto max-h-[299px]">
                                                    {context.subCatData?.subCategoryList?.filter(subCat => subCat.category.id === cat.id).map(subCat => (
                                                        <li key={subCat.id}
                                                            onMouseOver={() => handleMouseEnter(subCat.id)}
                                                            onMouseLeave={handleMouseLeave}
                                                        >
                                                            <Button
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'start',
                                                                    borderRadius: '0px',
                                                                    '&:hover': { backgroundColor: '#e5e7eb' }
                                                                }}
                                                                className="w-full py-2 px-5"
                                                                onClick={() => navigateSubCategoryProductPage(subCat.id)}
                                                            >
                                                                <img src={subCat.images[0].url} alt={subCat.name} className="w-6 h-6 mr-3" />
                                                                <p className="text-black">{subCat.name}</p>
                                                            </Button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Top Navigation */}
                <div className="w-7/12 flex items-center">
                    <ul className="flex ml-auto space-x-4">
                        <li>
                            <Link to="/">
                                <Button
                                    sx={{ ":hover": { background: 'transparent', color: 'black' } }}
                                    className="flex items-center p-2 rounded-full text-gray-700 uppercase text-sm font-semibold hover:bg-blue-50 hover:text-blue-400"
                                >
                                    <CiHome className="text-lg mr-2" />
                                    <p>Home</p>
                                </Button>
                            </Link>
                        </li>

                        {/* Shop Dropdown */}
                        <li className="relative group" onMouseOver={() => handleMouseEnter(1)} onMouseLeave={handleMouseLeave}>
                            <Link to="/">
                                <Button
                                    sx={{ ":hover": { background: 'transparent', color: 'black' } }}
                                    className="flex items-center p-2 rounded-full text-gray-700 uppercase text-sm font-semibold hover:bg-blue-50 hover:text-blue-400"
                                >
                                    <CiShop className="text-lg mr-2" />
                                    <p>Shop</p>
                                </Button>
                            </Link>
                            <div className={`absolute top-full left-0 z-50 w-40 bg-white border border-gray-200 p-2 mt-2 transition-all duration-300 ${dropdownVisible === 1 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                <Link to="/"><button className="w-full text-left py-2 px-5 hover:bg-gray-100">Vegetables</button></Link>
                            </div>
                        </li>    

                        {/* Products */}
                        <li>
                            <Link to="/products">
                                <Button
                                    sx={{ ":hover": { background: 'transparent', color: 'black' } }}
                                    className="flex items-center p-2 rounded-full text-gray-700 uppercase text-sm font-semibold hover:bg-blue-50 hover:text-blue-400"
                                >
                                    <FaProductHunt className="text-lg mr-2" />
                                    <p>All Products</p>
                                </Button>
                            </Link>
                        </li>

                        {/* Blog */}
                        <li>
                            <Link to="/">
                                <Button
                                    sx={{ ":hover": { background: 'transparent', color: 'black' } }}
                                    className="flex items-center p-2 rounded-full text-gray-700 uppercase text-sm font-semibold hover:bg-blue-50 hover:text-blue-400"
                                >
                                    <FaBlogger className="text-lg mr-2" />
                                    <p>Blog</p>
                                </Button>
                            </Link>
                        </li>

                        {/* Contact */}
                        <li>
                            <Link to="/">
                                <Button
                                    sx={{ ":hover": { background: 'transparent', color: 'black' } }}
                                    className="flex items-center p-2 rounded-full text-gray-700 uppercase text-sm font-semibold hover:bg-blue-50 hover:text-blue-400"
                                >
                                    <FaPhoneAlt className="text-lg mr-2" />
                                    <p>Contact</p>
                                </Button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
