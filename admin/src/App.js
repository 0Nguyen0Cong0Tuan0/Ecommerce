import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { createContext, useState, useEffect } from 'react';

// APIS
import { fetchDataFromApi } from './utils/api';

// PAGES
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProductDetails from './pages/ProductDetails';
import ProductList from './pages/Product/productList';
import ProductUpload from './pages/Product/addProduct';
import ProductEdit from './pages/Product/editProduct';
import CategoryList from './pages/Category/categoryList';
import CategoryUpload from './pages/Category/addCategory';
import CategoryEdit from './pages/Category/editCategory';
import SubCategory from './pages/SubCategory/subCategoryList';
import SubCategoryUpload from './pages/SubCategory/addSubCategory';
import SubCategoryEdit from './pages/SubCategory/editSubCategory';

// COMPONENTS
import LoadingSpinner from './components/LoadingSpinner';
import useAuthStore from './store/authStore';

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




const App = () => {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
  const [themeMode, setThemeMode] = useState(false); // True -> Light || False -> Dark

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  // CATEGORIES FOR DASHBOARD TABLE
  const [catData, setCatData] = useState([]);
  // CATEGORIES FOR SELECTION BOX
  const [catDataBox, setCatDataBox] = useState([]);

  // SUB CATEGORIES FOR DASHBOARD TABLE
  const [subCatData, setSubCatData] = useState([]);
  // CATEGORIES FOR SELECTION BOX
  const [subCatDataBox, setSubCatDataBox] = useState([]); 

  // PRODUCTS
  const [productData, setProductData] = useState([]);

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setIsHideSidebarAndHeader,
    themeMode,
    setThemeMode,
    catData,
    setCatData,
    subCatData,
    setSubCatData,
    productData,
    setProductData,

    itemsPerPage,
    setItemsPerPage,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,

    catDataBox,
    subCatDataBox,
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

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data concurrently
        const [catRes, subCatRes, productRes, catAllRes, subCatAllRes] = await Promise.all([
          fetchDataFromApi(`/api/category?page=${page}&limit=${itemsPerPage}&search=${searchQuery}&sortBy=${sortBy}`),
          fetchDataFromApi(`/api/subcategory?page=${page}&limit=${itemsPerPage}&search=${searchQuery}&sortBy=${sortBy}`),
          fetchDataFromApi(`/api/product?page=${page}&limit=${itemsPerPage}&search=${searchQuery}&sortBy=${sortBy}`),
          fetchDataFromApi(`/api/category?limit=${1000}`),
          fetchDataFromApi(`/api/subcategory?limit=${1000}`),
        ]);

        // Set data
        setCatData(catRes);
        setSubCatData(subCatRes);
        setProductData(productRes);
        setCatDataBox(catAllRes);
        setSubCatDataBox(subCatAllRes);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page, itemsPerPage, searchQuery, sortBy]); // Dependency array


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
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home content={<Dashboard />} /></ProtectedRoute>} />
          <Route path='/signup' element={<RedirectAuthenticatedUser><SignUp /></RedirectAuthenticatedUser>} />
          <Route path='/login' element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
          <Route path='/verify-email' element={<EmailVerification />} />
          <Route path='/forgot-password' element={<RedirectAuthenticatedUser><ForgotPassword /></RedirectAuthenticatedUser>} />
          <Route path='/reset-password/:token' element={<RedirectAuthenticatedUser><ResetPassword /></RedirectAuthenticatedUser>} />
          <Route path='/products' element={<ProtectedRoute><Home content={<ProductList />} /></ProtectedRoute>} />
          <Route path='/product/upload' element={<ProtectedRoute><Home content={<ProductUpload />} /></ProtectedRoute>} />
          <Route path='/product/edit/:id' element={<ProtectedRoute><Home content={<ProductEdit />} /></ProtectedRoute>} />
          <Route path='/product/info/:id' element={<ProtectedRoute><Home content={<ProductDetails />} /></ProtectedRoute>} />
          <Route path='/categories' element={<ProtectedRoute><Home content={<CategoryList />} /></ProtectedRoute>} />
          <Route path='/category/upload' element={<ProtectedRoute><Home content={<CategoryUpload />} /></ProtectedRoute>} />
          <Route path='/category/edit/:id' element={<ProtectedRoute><Home content={<CategoryEdit />} /></ProtectedRoute>} />
          <Route path='/subcategories' element={<ProtectedRoute><Home content={<SubCategory />} /></ProtectedRoute>} />
          <Route path='/subcategory/upload' element={<ProtectedRoute><Home content={<SubCategoryUpload />} /></ProtectedRoute>} />
          <Route path='/subcategory/edit/:id' element={<ProtectedRoute><Home content={<SubCategoryEdit />} /></ProtectedRoute>} />

        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
};

export default App;
export { MyContext };
