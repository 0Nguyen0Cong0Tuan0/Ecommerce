import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

// Pages
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import EmailVerification from './Pages/EmailVerification';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';

// Components
import Header from './Components/Header';
import Footer from './Components/Footer';
import ProductModal from './Components/ProductModal';
import LoadingSpinner from './Components/LoadingSpinner';
import useAuthStore from './store/authStore';

// Route
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { createContext, useEffect, useState } from 'react';

import axios from 'axios';

import { fetchDataFromApi } from './utils/api';

const MyContext = createContext();

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};

// Redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};


const App = () => {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isOpenProductModal, setIsOpenProductModal] = useState(false);
  const [productModalData, setProductModalData] = useState(null);
  
  const [isLogin, setIsLogin] = useState(true);
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
  const [themeMode, setThemeMode] = useState(false); // True -> Light || False -> Dark

  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [productData, setProductData] = useState([]);


  const [page, setPage] = useState(1);
  const [pageCategoryProduct, setPageCategoryProduct] = useState(1);
  const [pageSubCategoryProduct, setPageSubCategoryProduct] = useState(1);
  const [pageFilter, setPageFilter] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [itemsPerCategoryPage, setItemsPerCategoryPage] = useState(10);
  const [itemsPerSubCategoryPage, setItemsPerSubCategoryPage] = useState(10);
  const [itemsPerPageFilter, setItemsPerPageFilter] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategoryPageQuery, setSearchCategoryPageQuery] = useState('');
  const [searchSubCategoryPageQuery, setSearchSubCategoryPageQuery] = useState('');
  const [searchFilterQuery, setSearchFilterQuery] = useState('');

  const [sortBy, setSortBy] = useState('');
  const [categoryPageSortBy, setCategoryPageSortBy] = useState('');
  const [subCategoryPageSortBy, setSubCategoryPageSortBy] = useState('');
  const [sortByFilter, setSortByFilter] = useState('');


  // Random Featured Product Data
  const [featuredProductData, setFeaturedProductData] = useState([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [value, setValue] = useState([minPrice, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState([]); // State to hold selected categories
  const [selectedStatus, setSelectedStatus] = useState([]); // State to hold selected stock status
  const [selectedBrands, setSelectedBrands] = useState([]); // Track selected brands
  const [brandsByCategory, setBrandsByCategory] = useState({});


  const values = {
    countryList,

    selectedCountry, setSelectedCountry,

    isOpenProductModal, setIsOpenProductModal,

    isLogin, setIsLogin,
    isHideSidebarAndHeader, setIsHideSidebarAndHeader,
    themeMode, setThemeMode,

    catData, setCatData,
    subCatData, setSubCatData,
    productData, setProductData,
    featuredProductData, setFeaturedProductData,

    setProductModalData,

    page, setPage,
    itemsPerPage, setItemsPerPage,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,

    pageCategoryProduct, setPageCategoryProduct,
    itemsPerCategoryPage, setItemsPerCategoryPage,
    searchCategoryPageQuery, setSearchCategoryPageQuery,
    categoryPageSortBy, setCategoryPageSortBy,

    pageSubCategoryProduct, setPageSubCategoryProduct,
    itemsPerSubCategoryPage, setItemsPerSubCategoryPage,
    searchSubCategoryPageQuery, setSearchSubCategoryPageQuery,
    subCategoryPageSortBy, setSubCategoryPageSortBy,

    isLoading, setIsLoading,

    pageFilter, setPageFilter,
    itemsPerPageFilter, setItemsPerPageFilter,
    searchFilterQuery, setSearchFilterQuery,
    sortByFilter, setSortByFilter,


    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    value, setValue,
    selectedCategories, setSelectedCategories,
    selectedStatus, setSelectedStatus,
    selectedBrands, setSelectedBrands,
    brandsByCategory, setBrandsByCategory,
  };

  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Checking authentication

    // Set theme mode
    if (themeMode === true) {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('themeMode', 'light');
    } else {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      localStorage.setItem('themeMode', 'dark');
    }
  }, [checkAuth, themeMode]);

  // Get Country
  useEffect(() => {
    const getCountry = async (url) => {
      try {
        const res = await axios.get(url);
        setCountryList(res.data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    getCountry('https://countriesnow.space/api/v0.1/countries/');
  }, []);

  // Get All Featured Product
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true); // Start loading
      try {
        const featuredRes = await fetchDataFromApi(`/api/product?f=true`);
        setFeaturedProductData(featuredRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetching
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Get Category and SubCategory info
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const [catRes, subCatRes] = await Promise.all([
          fetchDataFromApi(`/api/category/`),
          fetchDataFromApi(`/api/subcategory/`),
        ]);

        setCatData(catRes);
        setSubCatData(subCatRes);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetching
      }
    };

    fetchData(); // Call the async function
  }, []);

  // Render LoadingSpinner before authentication check finishes
  if (isCheckingAuth) {
    return (
      <MyContext.Provider value={values}>
        <LoadingSpinner />
      </MyContext.Provider>
    );
  }

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {isCheckingAuth && <Header />}
        <Routes>
          {isLoading ? ( // Conditional rendering based on loading state
            <Route path='/' element={<div>Loading...</div>} />
          ) : (
            catData && subCatData && productData && <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
          )}
          <Route path='/category/:id' exact={true} element={<Listing type="category" />} />
          <Route path='/subcategory/:id' exact={true} element={<Listing type="subcategory" />} />
          <Route path='/products' exact={true} element={<Listing type="products" />} />
          <Route path='/search' exact={true} element={<Listing type="filtered" />} />

          <Route exact={true} path='/product/:id' element={<ProductDetails />} />
          <Route exact={true} path='/cart' element={<Cart />} />

          <Route path='/signup' element={<RedirectAuthenticatedUser><SignUp /></RedirectAuthenticatedUser>} />
          <Route path='/login' element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
          <Route path='/verify-email' element={<EmailVerification />} />
          <Route path='/forgot-password' element={<RedirectAuthenticatedUser><ForgotPassword /></RedirectAuthenticatedUser>} />
          <Route path='/reset-password/:token' element={<RedirectAuthenticatedUser><ResetPassword /></RedirectAuthenticatedUser>} />
        </Routes>
        {isCheckingAuth && <Footer />}
        {isOpenProductModal && <ProductModal info={productModalData} />}
      </MyContext.Provider>
    </BrowserRouter>
  );
};

export default App;
export { MyContext };
