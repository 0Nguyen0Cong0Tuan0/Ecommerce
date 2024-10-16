import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProductModal from './Components/ProductModal';
import { fetchDataFromApi } from './utils/api';

const MyContext = createContext();

const App = () => {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isOpenProductModal, setIsOpenProductModal] = useState(false);
  const [productModalData, setProductModalData] = useState(null);
  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
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
    isHeaderFooterShow, setIsHeaderFooterShow,

    isLogin, setIsLogin,

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

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {isHeaderFooterShow && <Header />}
        <Routes>
          {isLoading ? ( // Conditional rendering based on loading state
            <Route path='/' element={<div>Loading...</div>} />
          ) : (
            catData && subCatData && productData && <Route path='/' exact={true} element={<Home />} />
          )}
          <Route path='/category/:id' exact={true} element={<Listing type="category" />} />
          <Route path='/subcategory/:id' exact={true} element={<Listing type="subcategory" />} />
          <Route path='/products' exact={true} element={<Listing type="products" />} />
          <Route path='/search' exact={true} element={<Listing type="filtered" />} />
          
          <Route exact={true} path='/product/:id' element={<ProductDetails />} />
          <Route exact={true} path='/cart' element={<Cart />} />
          <Route exact={true} path='/signIn' element={<SignIn />} />
          <Route exact={true} path='/signUp' element={<SignUp />} />
        </Routes>
        {isHeaderFooterShow && <Footer />}
        {isOpenProductModal && <ProductModal info={productModalData} />}
      </MyContext.Provider>
    </BrowserRouter>
  );
};

export default App;
export { MyContext };
