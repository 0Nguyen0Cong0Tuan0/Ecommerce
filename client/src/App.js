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
import DialogAddToCart from './Components/DialogAddToCart';
import DialogConflictToCart from './Components/DialogConflictToCart';
import DialogAddToWishList from './Components/DialogAddToWishList';
import DialogConflictToWishList from './Components/DialogConflictToWishList';
import ProductModal from './Components/ProductModal';
import useAuthStore from './store/authStore';

// Route
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { createContext, useEffect, useState } from 'react';
import { fetchDataFromApi, postData } from './utils/api';
import ProductReviews from './Pages/ProductReviews';
import GradientCircularProgress from './Components/Loading';
import Wishlist from './Pages/Wishlist';


const MyContext = createContext();

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, client } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!client.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};

// Redirect authenticated clients to the home page
const RedirectAuthenticatedClient = ({ children }) => {
  const { isAuthenticated, client } = useAuthStore();

  if (isAuthenticated && client.isVerified) {
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

  const [productData, setProductData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  // Featured Product Data
  const [featuredProductData, setFeaturedProductData] = useState([]);
  // New Product Data
  const [newProductData, setNewProductData] = useState([]);
  // All Product Data
  const [allProductData, setAllProductData] = useState([]);
  // Cart Data
  const [cartData, setCartData] = useState([]);
  // WishList Data
  const [wishListData, setWishListData] = useState([]);

  const [page, setPage] = useState(1);
  const [pageCategoryProduct, setPageCategoryProduct] = useState(1);
  const [pageSubCategoryProduct, setPageSubCategoryProduct] = useState(1);
  const [pageFilter, setPageFilter] = useState(1);
  const [pageFeatured, setPageFeatured] = useState(1);
  const [pageNew, setPageNew] = useState(1);
  const [pageReview, setPageReview] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [itemsPerCategoryPage, setItemsPerCategoryPage] = useState(10);
  const [itemsPerSubCategoryPage, setItemsPerSubCategoryPage] = useState(10);
  const [itemsPerPageFilter, setItemsPerPageFilter] = useState(10);
  const [itemsPerPageFeatured, setItemsPerPageFeatured] = useState(10);
  const [itemsPerPageNew, setItemsPerPageNew] = useState(10);
  const [itemsPerPageReview, setItemsPerPageReview] = useState(7);


  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategoryPageQuery, setSearchCategoryPageQuery] = useState('');
  const [searchSubCategoryPageQuery, setSearchSubCategoryPageQuery] = useState('');
  const [searchFilterQuery, setSearchFilterQuery] = useState('');
  const [searchFeaturedQuery, setSearchFeaturedQuery] = useState('');
  const [searchNewQuery, setSearchNewQuery] = useState('');

  const [sortBy, setSortBy] = useState('');
  const [categoryPageSortBy, setCategoryPageSortBy] = useState('');
  const [subCategoryPageSortBy, setSubCategoryPageSortBy] = useState('');
  const [sortByFilter, setSortByFilter] = useState('');
  const [sortByFeatured, setSortByFeatured] = useState('');
  const [sortByNew, setSortByNew] = useState('');


  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [value, setValue] = useState([minPrice, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState([]); // State to hold selected categories
  const [selectedStatus, setSelectedStatus] = useState([]); // State to hold selected stock status
  const [selectedBrands, setSelectedBrands] = useState([]); // Track selected brands
  const [brandsByCategory, setBrandsByCategory] = useState({});

  // Add Product to Cart
  const [addingInCart, setAddingInCart] = useState(false);
  // Add Product to Wishlist
  const [addingInWishList, setAddingInWishList] = useState(false);

  // Added Product
  const [addedProductInCart, setAddedProductInCart] = useState();
  const [numberProductInCart, setNumberProductInCart] = useState(0);  // Use useState to manage number of products

  // Added Wishlist
  const [addedProductInWishList, setAddedProductInWishList] = useState();
  const [numberProductInWishList, setNumberProductInWishList] = useState(0);  // Use useState to manage number of products

  const [averageRating, setAverageRating] = useState(0);

  // Dialog for Adding to Cart notification
  const [isOpenDialogCart, setIsOpenDialogCart] = useState(false);
  const [isOpenDialogConflictCart, setIsOpenDialogConflictCart] = useState(false);

  // Dialog for Adding to WishList notification
  const [isOpenDialogWishList, setIsOpenDialogWishList] = useState(false);
  const [isOpenDialogConflictWishList, setIsOpenDialogConflictWishList] = useState(false);

  const { isCheckingAuth, checkAuth, isAuthenticated, client } = useAuthStore();

  const addToCart = async (productToCart) => {
    console.log("Adding to cart:", productToCart);
    setAddingInCart(true); // Start showing loading indicator
    setAddedProductInCart(productToCart); // Set the added product for displaying

    try {
      const res = await postData(`/api/cart/add`, productToCart, false);
      console.log("Response from addToCart:", res); // Log the response for debugging
      setIsOpenDialogCart(true); // Open the dialog on success
    } catch (error) {
      console.log("Error adding to cart:", error); // Log the error for debugging
      setIsOpenDialogConflictCart(true); // This will trigger a re-render

    } finally {
      setAddingInCart(false); // Ensure loading is stopped regardless of success or failure
    }
  };

  const addToWishList = async (productToWishList) => {
    console.log("Adding to wish list:", productToWishList);
    setAddingInWishList(true); // Start showing loading indicator
    setAddedProductInWishList(productToWishList); // Set the added product for displaying


    try {
      const res = await postData(`/api/wishlist/add`, productToWishList, false);
      console.log("Response from addToWishlist:", res); // Log the response for debugging
      setIsOpenDialogWishList(true); // Open the dialog on success
    } catch (error) {
      console.log("Error adding to wishlist:", error); // Log the error for debugging
      setIsOpenDialogConflictWishList(true); // Open conflict dialog on error
    } finally {
      setAddingInWishList(false); // Ensure loading is stopped regardless of success or failure
    }
  };

  const values = {
    countryList,

    selectedCountry, setSelectedCountry,

    isOpenProductModal, setIsOpenProductModal,

    isLoading, setIsLoading,

    isLogin, setIsLogin,
    isHideSidebarAndHeader, setIsHideSidebarAndHeader,
    themeMode, setThemeMode,

    catData, setCatData,
    subCatData, setSubCatData,
    productData, setProductData,
    featuredProductData, setFeaturedProductData,
    newProductData, setNewProductData,
    allProductData,

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

    pageFilter, setPageFilter,
    itemsPerPageFilter, setItemsPerPageFilter,
    searchFilterQuery, setSearchFilterQuery,
    sortByFilter, setSortByFilter,

    pageFeatured, setPageFeatured,
    itemsPerPageFeatured, setItemsPerPageFeatured,
    searchFeaturedQuery, setSearchFeaturedQuery,
    sortByFeatured, setSortByFeatured,

    pageNew, setPageNew,
    itemsPerPageNew, setItemsPerPageNew,
    searchNewQuery, setSearchNewQuery,
    sortByNew, setSortByNew,

    pageReview, setPageReview,
    itemsPerPageReview, setItemsPerPageReview,

    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    value, setValue,
    selectedCategories, setSelectedCategories,
    selectedStatus, setSelectedStatus,
    selectedBrands, setSelectedBrands,
    brandsByCategory, setBrandsByCategory,

    addToCart,
    addToWishList,

    addingInCart, setAddingInCart,
    numberProductInCart, setNumberProductInCart,

    numberProductInWishList, setNumberProductInWishList,

    addingInWishList, setAddingInWishList,

    cartData, setCartData,
    wishListData, setWishListData,

    isOpenDialogCart, setIsOpenDialogCart,
    isOpenDialogConflictCart, setIsOpenDialogConflictCart,

    isOpenDialogWishList, setIsOpenDialogWishList,
    isOpenDialogConflictWishList, setIsOpenDialogConflictWishList,

    averageRating, setAverageRating,
  };



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

  useEffect(() => {
    const getCountries = async () => {
      const response = await fetch('http://localhost:5000/api/countries'); // Adjust the URL for production
      const data = await response.json();
      setCountryList(data.data);
      setIsLoading(false); // Stop loading after fetching
    }
    getCountries();
  }, []);

  // Get 13 Featured Products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true); // Start loading
      try {
        const featuredRes = await fetchDataFromApi(`/api/product?f=true&limit=13`);
        setFeaturedProductData(featuredRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetching
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Get 13 New Products
  useEffect(() => {
    const fetchNewProducts = async () => {
      setIsLoading(true); // Start loading
      try {
        const newRes = await fetchDataFromApi(`/api/product?sortBy=date-desc&limit=13`);
        setNewProductData(newRes);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewProducts();
  }, [])

  // Get Category and SubCategory info
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const [catRes, subCatRes, allProductRes] = await Promise.all([
          fetchDataFromApi(`/api/category/`),
          fetchDataFromApi(`/api/subcategory/`),
          fetchDataFromApi(`/api/product/`),
        ]);

        setCatData(catRes);
        setSubCatData(subCatRes);
        setAllProductData(allProductRes);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetching
      }
    };

    fetchData(); // Call the async function
  }, []);

  useEffect(() => {
    setIsLogin(isAuthenticated);
    setIsLoading(false); // Stop loading after fetching
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && client?._id) {
      setIsLoading(true); // Start loading before fetching
      fetchDataFromApi(`/api/cart?clientId=${client._id}`).then((res) => {
        setCartData(res);
        setIsLoading(false); // Stop loading after fetching
      });
    }
  }, [isAuthenticated, client]); // Removed cartData from the dependencies
  

  useEffect(() => {
    if (isAuthenticated && client?._id) {
      fetchDataFromApi(`/api/wishlist?clientId=${client._id}`).then((res) => {
        setWishListData(res);
        setIsLoading(false); // Stop loading after fetching
      });
    }
  }, [isAuthenticated, client, wishListData]);

  // Render LoadingSpinner before authentication check finishes
  if (isCheckingAuth) {
    return (
      <MyContext.Provider value={values}>
        <GradientCircularProgress />
      </MyContext.Provider>
    );
  }



  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {/* Render Header and Footer only if the user is authenticated */}
        {isAuthenticated && <Header />}
        <Routes>
          {isLoading ? ( // Conditional rendering based on loading state
            <Route path='/' element={<GradientCircularProgress />} />
          ) : (
            catData && subCatData && productData && <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          )}
          <Route path='/category/:id' exact={true} element={<ProtectedRoute><Listing type="category" /></ProtectedRoute>} />
          <Route path='/subcategory/:id' exact={true} element={<ProtectedRoute><Listing type="subcategory" /></ProtectedRoute>} />
          <Route path='/products' exact={true} element={<ProtectedRoute><Listing type="products" /></ProtectedRoute>} />
          <Route path='/search' exact={true} element={<ProtectedRoute><Listing type="filtered" /></ProtectedRoute>} />
          <Route path='/featured' exact={true} element={<ProtectedRoute><Listing type="featured" /></ProtectedRoute>} />
          <Route path='/new' exact={true} element={<ProtectedRoute><Listing type="new" /></ProtectedRoute>} />
          <Route exact={true} path='/product/:id' element={<ProductDetails />} />
          <Route exact={true} path='/cart' element={<Cart />} />
          <Route exact={true} path='/reviews/:id' element={<ProductReviews />} />
          <Route exact={true} path='/wishlist' element={<Wishlist />} />

          {/* Only non-authenticated users can access these routes */}
          <Route path='/signup' element={<RedirectAuthenticatedClient><SignUp /></RedirectAuthenticatedClient>} />
          <Route path='/login' element={<RedirectAuthenticatedClient><Login /></RedirectAuthenticatedClient>} />
          <Route path='/verify-email' element={<EmailVerification />} />
          <Route path='/forgot-password' element={<RedirectAuthenticatedClient><ForgotPassword /></RedirectAuthenticatedClient>} />
          <Route path='/reset-password/:token' element={<RedirectAuthenticatedClient><ResetPassword /></RedirectAuthenticatedClient>} />
        </Routes>

        {/* Render Footer only if the user is authenticated */}
        {isAuthenticated && <Footer />}
        {isOpenProductModal && <ProductModal info={productModalData} />}
        {isOpenDialogCart && <DialogAddToCart product={addedProductInCart} />}
        {isOpenDialogConflictCart && <DialogConflictToCart product={addedProductInCart} />}
        {isOpenDialogWishList && <DialogAddToWishList product={addedProductInWishList} />}
        {isOpenDialogConflictWishList && <DialogConflictToWishList product={addedProductInWishList} />}
      </MyContext.Provider>
    </BrowserRouter>
  );
};

export default App;
export { MyContext };