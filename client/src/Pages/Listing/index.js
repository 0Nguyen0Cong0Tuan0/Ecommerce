import food_banner from "../../assets/food/food_banner_3.jpg";
import Sidebar from '../../Components/Sidebar';
import ProductItem from "../../Components/ProductItem";
import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton'; // Importing Skeleton from Material UI
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import { HiViewGrid } from "react-icons/hi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const Listing = ({ type }) => {
    const { id } = useParams();
    const [productView, setProductView] = useState('four'); // Track view type
    const [anchorEl, setAnchorEl] = useState(null);
    const openDropDown = Boolean(anchorEl);
    const context = useContext(MyContext);



    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeItemsPerPage = (item) => {
        if (type === 'category') {
            context.setItemsPerCategoryPage(item);
            context.setPageCategoryProduct(1); // Reset page to 1
        } else if (type === 'subcategory') {
            context.setItemsPerSubCategoryPage(item);
            context.setPageSubCategoryProduct(1); // Reset page to 1
        } else if (type === 'products') {
            context.setItemsPerPage(item);
            context.setPage(1); // Reset page to 1
        } else if (type === 'filtered') {
            context.setItemsPerPageFilter(item);
            context.setPageFilter(1);
        }
        setAnchorEl(null);
    };

    const handleChangePage = (event, value) => {
        if (type === 'category') {
            context.setPageCategoryProduct(value); // Update the current page in the context
        } else if (type === 'subcategory') {
            context.setPageSubCategoryProduct(value); // Update the current page in the context
        } else if (type === 'products') {
            context.setPage(value);
        } else if (type === 'filtered') {
            context.setPageFilter(value);
        }
        context.setIsLoading(true); // Optionally set loading to true if you want to show a loading state
    };

    const menuItems = [10, 20, 30, 50]; // Define the options for the menu items

    // Dynamic grid class based on productView state
    const gridClasses = () => {
        switch (productView) {
            case 'one':
                return 'grid grid-cols-1 gap-4'; // Single column for list view
            case 'two':
                return 'grid grid-cols-2 gap-4'; // 2 columns grid view
            case 'three':
                return 'grid grid-cols-3 gap-4'; // 3 columns grid view
            case 'four':
                return 'grid grid-cols-4 gap-4'; // 4 columns grid view
            default:
                return 'grid grid-cols-4 gap-4'; // Default to 4 columns
        }
    };

    useEffect(() => {
        window.scrollTo(0, 680);

        const fetchProducts = async () => {
            context.setProductData([]);
            context.setIsLoading(true);
            try {
                let res;
                if (type === 'category') {
                    const url = `/api/product/category/${id}?page=${context.pageCategoryProduct}&limit=${context.itemsPerCategoryPage}&search=${context.searchCategoryPageQuery}&sortBy=${context.setCategoryPageSortBy}`;
                    console.log(`Fetching from: ${url}`); // Log the fetch URL
                    res = await fetchDataFromApi(url);
                    context.setProductData(res);
                } else if (type === 'subcategory') {
                    const url = `/api/product/subcategory/${id}?page=${context.pageSubCategoryProduct}&limit=${context.itemsPerSubCategoryPage}&search=${context.searchSubCategoryPageQuery}&sortBy=${context.setSubCategoryPageSortBy}`;
                    console.log(`Fetching from: ${url}`); // Log the fetch URL
                    res = await fetchDataFromApi(url);
                    context.setProductData(res);
                } else if (type === 'products') {
                    const url = `/api/product?page=${context.page}&limit=${context.itemsPerPage}&search=${context.searchQuery}&sortBy=${context.sortBy}`;
                    console.log(`Fetching from: ${url}`); // Log the fetch URL
                    res = await fetchDataFromApi(url);
                    context.setProductData(res);
                } 
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                context.setIsLoading(false);
            }
        };

        fetchProducts(); // Call the function to fetch products
    }, [id,
        context.page,
        context.itemsPerPage,
        context.searchQuery,
        context.sortBy,
        context.pageCategoryProduct,
        context.pageSubCategoryProduct,
        context.itemsPerCategoryPage,
        context.itemsPerSubCategoryPage,
        context.searchCategoryPageQuery,
        context.searchSubCategoryPageQuery,
        context.setCategoryPageSortBy,
        context.setSubCategoryPageSortBy]); // Include pageCategoryProduct in the dependency array

    return (
        <>
            <section className='py-[35px]'>
                <div className='container'>
                    <div className="flex gap-[20px]">
                        <Sidebar />

                        <div className="w-[80%] flex-[0_0_80%] px-[30px]">
                            <Link to="#">
                                <img src={food_banner} alt="food banner" className="w-full rounded-[10px]" />
                            </Link>

                            <div className="w-full h-[50px] bg-[#f3f4f7] my-[30px] px-[25px] flex items-center">
                                <div className="flex items-center">
                                    <Button
                                        className={`min-w-[35px] w-[35px] h-[35px] ${productView === 'one' ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300 ease-in-out`}
                                        onClick={() => setProductView('one')}
                                    >
                                        <IoIosMenu className="text-black text-[20px]" />
                                    </Button>
                                    <Button
                                        className={`min-w-[35px] w-[35px] h-[35px] ${productView === 'two' ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300 ease-in-out`}
                                        onClick={() => setProductView('two')}
                                    >
                                        <HiViewGrid className="text-black text-[20px]" />
                                    </Button>
                                    <Button
                                        className={`min-w-[35px] w-[35px] h-[35px] ${productView === 'three' ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300 ease-in-out`}
                                        onClick={() => setProductView('three')}
                                    >
                                        <TbGridDots className="text-black text-[20px]" />
                                    </Button>
                                    <Button
                                        className={`min-w-[35px] w-[35px] h-[35px] ${productView === 'four' ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300 ease-in-out`}
                                        onClick={() => setProductView('four')}
                                    >
                                        <TfiLayoutGrid4Alt className="text-black text-[20px]" />
                                    </Button>
                                </div>

                                <div className="flex ml-auto">
                                    <Button
                                        onClick={handleClick}
                                        className="text-black text-[15px] font-normal flex items-center"
                                    >
                                        <p>Show {type === 'category' 
                                            ? context.itemsPerCategoryPage 
                                            : ( type === 'subcategory' 
                                            ? context.itemsPerSubCategoryPage 
                                            : ( type === 'products' 
                                            ? context.itemsPerPage 
                                            : context.itemsPerPageFilter))}</p>
                                        <FaAngleDown className="text-black opacity-50 ml-2" />
                                    </Button>
                                    <Menu
                                        sx={{
                                            width: '80px',
                                        }}
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDropDown}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        {menuItems.map((item) => (
                                            <MenuItem
                                                key={item}
                                                value={item}
                                                onClick={() => handleChangeItemsPerPage(item)}
                                                className="w-[80px] font-normal"
                                            >
                                                <p>{item}</p>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </div>
                            </div>

                            {/* Conditionally render loading spinner or product grid */}
                            {context.isLoading ? (
                                <div className={gridClasses()}>
                                    {Array.from(new Array(context.itemsPerCategoryPage)).map((_, index) => (
                                        <Skeleton key={index} variant="rectangular" height={150} />
                                    ))}
                                </div>
                            ) : (
                                <div className={`flex flex-wrap gap-[20px] mb-[40px] ${gridClasses()}`}>
                                    {context.productData?.productList?.length > 0 &&
                                        context.productData.productList.map((item, index) => (
                                            <ProductItem key={index} item={item} view={productView} />
                                        ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {!context.isLoading && context.productData?.totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <Pagination
                                count={context.productData?.totalPages}
                                page={type === 'category' 
                                    ? context.pageCategoryProduct 
                                    : (type === 'subcategory' 
                                        ? context.pageSubCategoryProduct 
                                        : (type === 'products' 
                                            ? context.page 
                                            : context.pageFilter))}
                                onChange={handleChangePage}
                                color="primary"
                            />
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Listing;
