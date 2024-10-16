// MATERIAL UI
import Button from '@mui/material/Button';

// ICONS
import { MdDashboard, MdArrowRight, MdCategory } from 'react-icons/md';
import { BsFillCartCheckFill } from "react-icons/bs";

// REACT
import { Link } from 'react-router-dom';
import { useState } from 'react';

// COMPONENTS
const Sidebar = () => {
    // const [isOpenDashboard, setIsOpenDashboard] = useState(false);
    const [isOpenProduct, setIsOpenProduct] = useState(false);
    const [isOpenCategory, setIsOpenCategory] = useState(false);
    const [isOpenSubCategory, setIsOpenSubCategory] = useState(false);

    const toggleIsOpenProduct = () => {
        setIsOpenProduct(!isOpenProduct); // Toggles the state between open/close
    }

    const toggleIsOpenCategory = () => {
        setIsOpenCategory(!isOpenCategory);
    }

    const toggleIsOpenSubCategory = () => {
        setIsOpenSubCategory(!isOpenSubCategory);
    }

    // const toggleIsOpenDashboard = () => {
    //     setIsOpenDashboard(!isOpenDashboard); // Toggles the state between open/close
    // }

    return (
        <>
            <div className='sidebar my-10 mx-5'>
                <ul>
                    {/* Dashboard Link */}
                    <li id='Dashboard'>
                        <Link to='/'>
                            <Button
                                className='w-full'
                                style={{ justifyContent: 'space-between' }} // Align content to the left
                            >
                                <div className="flex items-center space-x-2 text-white text-lg">
                                    {/* ${isOpenDashboard ? 'fill-black' : ''} */}
                                    <MdDashboard className={`text-white `} />
                                    <span>Dashboard</span>
                                </div>

                                <MdArrowRight className="text-white text-3xl" />
                            </Button>
                        </Link>
                    </li>

                    {/* Category Link */}
                    <li id='Category'>
                        <Button
                            className='w-full transition duration-1000'
                            style={{ justifyContent: 'space-between' }}
                            onClick={toggleIsOpenCategory}
                        >
                            <div className="flex items-center space-x-2 text-white text-lg">
                                <MdCategory className={`text-white ${isOpenCategory ? 'fill-black' : ''}`} />
                                <span>Categories</span>
                            </div>

                            {/* Change arrow direction based on submenu open state */}
                            <MdArrowRight
                                className={`text-white text-3xl transition duration-500 ease-in-out ${isOpenCategory ? 'rotate-90' : ''}`}
                            />
                        </Button>

                        {/* Submenu with Animation */}

                        <ul className={`submenu ${isOpenCategory ? 'submenu-open' : ''}`}>
                            {/* Product List */}
                            <li id='Category List'>
                                <Link to='/categories'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenCategory}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Category List</span>
                                    </Button>
                                </Link>
                            </li>

                            {/* Product View
                            <li id='Category View'>
                                <Link to='/category-view'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenCategory}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Category View</span>
                                    </Button>
                                </Link>
                            </li> */}

                            {/* Add Product */}
                            <li id='Add Category'>
                                <Link to='/category/upload'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenCategory}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Add Category</span>
                                    </Button>
                                </Link>
                            </li>

                            {/* Edit Product
                            <li id='Edit Category'>
                                <Link to='/category/edit'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenCategory}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Edit Category</span>
                                    </Button>
                                </Link>
                            </li> */}
                        </ul>
                    </li>
                    
                    {/* SubCategory Link */}
                    <li id='SubCategory'>
                        <Button
                            className='w-full transition duration-1000'
                            style={{ justifyContent: 'space-between' }}
                            onClick={toggleIsOpenSubCategory}
                        >
                            <div className="flex items-center space-x-2 text-white text-lg">
                                <MdCategory className={`text-white ${isOpenSubCategory ? 'fill-black' : ''}`} />
                                <span>Sub Categories</span>
                            </div>

                            {/* Change arrow direction based on submenu open state */}
                            <MdArrowRight
                                className={`text-white text-3xl transition duration-500 ease-in-out ${isOpenSubCategory ? 'rotate-90' : ''}`}
                            />
                        </Button>

                        {/* Submenu with Animation */}

                        <ul className={`submenu ${isOpenSubCategory ? 'submenu-open' : ''}`}>
                            {/* Product List */}
                            <li id='Category List'>
                                <Link to='/subcategories'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenSubCategory}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Sub Category List</span>
                                    </Button>
                                </Link>
                            </li>

                            {/* Product View
                            <li id='Category View'>
                                <Link to='/category-view'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenCategory}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Category View</span>
                                    </Button>
                                </Link>
                            </li> */}

                            {/* Add Product */}
                            <li id='Add Category'>
                                <Link to='/subcategory/upload'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenSubCategory}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Add Sub Category</span>
                                    </Button>
                                </Link>
                            </li>


                    
                            {/* Edit Product
                            <li id='Edit Category'>
                                <Link to='/category/edit'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenCategory}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Edit Category</span>
                                    </Button>
                                </Link>
                            </li> */}
                        </ul>
                    </li>

                    {/* Products Link */}
                    <li id='Product'>
                        <Button
                            className='w-full transition duration-1000'
                            style={{ justifyContent: 'space-between' }}
                            onClick={toggleIsOpenProduct}
                        >
                            <div className="flex items-center space-x-2 text-white text-lg">
                                <BsFillCartCheckFill className={`text-white ${isOpenProduct ? 'fill-black' : ''}`} />
                                <span>Products</span>
                            </div>

                            {/* Change arrow direction based on submenu open state */}
                            <MdArrowRight
                                className={`text-white text-3xl transition duration-500 ease-in-out ${isOpenProduct ? 'rotate-90' : ''}`}
                            />
                        </Button>

                        {/* Submenu with Animation */}

                        <ul className={`submenu ${isOpenProduct ? 'submenu-open' : ''}`}>
                            {/* Product List */}
                            <li id='Product List'>
                                <Link to='/products'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenProduct}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Product List</span>
                                    </Button>
                                </Link>
                            </li>

                            {/* Product View
                            <li id='Product View'>
                                <Link to='/product-view'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenProduct}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Product View</span>
                                    </Button>
                                </Link>
                            </li> */}

                            {/* Add Product */}
                            <li id='Add Product'>
                                <Link to='/product/upload'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenProduct}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Add Product</span>
                                    </Button>
                                </Link>
                            </li>

                            {/* Edit Product
                            <li id='Edit Product'>
                                <Link to='/edit-product'>
                                    <Button
                                        className='w-full'
                                        style={{ justifyContent: 'flex-start' }}
                                        onClick={toggleIsOpenProduct}
                                    >
                                        <div className='w-2 h-2 rounded-full bg-white mx-4'></div>
                                        <span className='text-white text-base'>Edit Product</span>
                                    </Button>
                                </Link>
                            </li> */}
                        </ul>
                    </li>

                </ul>
            </div>
        </>
    )
}

export default Sidebar;
