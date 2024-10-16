import React, { useState, useContext, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import { Link, useNavigate } from "react-router-dom";
import food_banner from "../../assets/food/banner_food_2.jpg";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const Sidebar = () => {
    const context = useContext(MyContext);
    const navigator = useNavigate();

    const productStatus = ['In Stock', 'Out of Stock']; // Adjusted to handle stock status

    // Fetch and set the price range based on product data
    // Group brands by category based on product data
    useEffect(() => {
        const brandsMap = {};

        context.productData?.productList?.forEach(product => {
            const category = product.category.name;
            const brand = product.brand; // Assuming the product data includes a 'brand' field

            if (!brandsMap[category]) {
                brandsMap[category] = new Set();
            }

            brandsMap[category].add(brand);
        });

        context.setBrandsByCategory(brandsMap);
    }, [context.productData]);

    useEffect(() => {
        if (context.productData?.productList?.length > 0) {
            const prices = context.productData.productList.map((item) => parseFloat(item.price.$numberDecimal));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            context.setMinPrice(minPrice);
            context.setMaxPrice(maxPrice);
            context.setValue([minPrice, maxPrice]);
        }
    }, [context.productData]);

    // Ensure the slider values are within bounds
    useEffect(() => {
        context.setValue((prev) => {
            const newValue = [...prev];
            newValue[0] = Math.max(context.minPrice, Math.min(context.maxPrice, newValue[0]));
            newValue[1] = Math.max(context.minPrice, Math.min(context.maxPrice, newValue[1]));
            return newValue;
        });
    }, [context.minPrice, context.maxPrice]);

    // Handle slider value change
    const handleChange = (event, newValue) => {
        context.setValue(newValue);
    };

    // Handle when the slider interaction is finished (user releases the slider)
    const handleSliderCommit = async () => {
        window.scrollTo(0, 0);
        context.setProductData([]);
        context.setIsLoading(true);
        
        try {
            const categoryQuery = context.selectedCategories.join(',');
            const statusQuery = context.selectedStatus.length > 0 ? `&status=${context.selectedStatus.join(',')}` : '';
            
            // Encode brand names using encodeURIComponent to handle spaces and special characters
            const brandsQuery = context.selectedBrands.length > 0 ? `&brands=${context.selectedBrands.map(encodeURIComponent).join(',')}` : '';
    
            const url = `/api/product?category=${categoryQuery}&minPrice=${context.value[0]}&maxPrice=${context.value[1]}${statusQuery}${brandsQuery}&page=${context.pageFilter}&limit=${context.itemsPerPageFilter}&search=${context.searchFilterQuery}&sortBy=${context.sortByFilter}`;
    
            console.log(`Fetching from: ${url}`);
            const res = await fetchDataFromApi(url);
            context.setProductData(res);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            context.setIsLoading(false);
        }
    };
    

    // Handle checkbox change for categories
    const handleCheckboxChange = (event, categoryId) => {
        navigator('/search');
        context.setPageFilter(1);
        context.setSelectedCategories(prev => {
            if (event.target.checked) {
                return [...prev, categoryId]; // Add category if checked
            } else {
                return prev.filter(id => id !== categoryId); // Remove category if unchecked
            }
        });
    };

    // Handle checkbox change for stock status
    const handleStatusChange = (event, status) => {
        navigator('/search');
        context.setPageFilter(1);
        context.setSelectedStatus(prev => {
            if (event.target.checked) {
                return [...prev, status]; // Add status if checked
            } else {
                return prev.filter(s => s !== status); // Remove status if unchecked
            }
        });
    };

    const handleBrandChange = (event, brand) => {
        navigator('/search');
        context.setPageFilter(1);
        context.setSelectedBrands(prev => {
            if (event.target.checked) {
                return [...prev, brand];
            } else {
                return prev.filter(b => b !== brand);
            }
        });
    };

    // API call whenever selectedCategories or selectedStatus changes
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProducts = async () => {
            context.setProductData([]);
            context.setIsLoading(true);
            try {
                const categoryQuery = context.selectedCategories.join(',');
                const statusQuery = context.selectedStatus.length > 0 ? `&inStock=${context.selectedStatus.join(',')}` : '';
                const brandsQuery = context.selectedBrands.length > 0 ? `&brands=${context.selectedBrands.map(encodeURIComponent).join(',')}` : '';

                const url = `/api/product?category=${categoryQuery}&minPrice=&maxPrice=${statusQuery}${brandsQuery}&page=${context.pageFilter}&limit=${context.itemsPerPageFilter}&search=${context.searchFilterQuery}&sortBy=${context.sortByFilter}`;

                console.log(url);
                console.log(`Fetching from: ${url}`);
                const res = await fetchDataFromApi(url);
                context.setProductData(res);

            
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                context.setIsLoading(false);
            }
        };

        fetchProducts();
    }, [context.selectedCategories, 
        context.selectedStatus, 
        context.selectedBrands, 
        context.pageFilter, 
        context.itemsPerPageFilter, 
        context.searchFilterQuery, 
        context.sortByFilter]);

    return (
        <div className="w-1/5 sticky top-5 h-fit">
            <div className="space-y-6">
                {/* Product Categories */}
                <div className="space-y-3">
                    <h6 className="text-lg font-medium">Product Categories</h6>
                    <div className="max-h-60 overflow-y-auto">
                        <ul>
                            {context.catData?.categoryList?.map((item, index) => (
                                <li key={`${index} ${item._id}`} value={item._id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => handleCheckboxChange(e, item._id)}
                                            />
                                        }
                                        label={item.name}
                                        componentsProps={{
                                            typography: {
                                                sx: {
                                                    fontFamily: '"New Amsterdam", sans-serif',
                                                },
                                            },
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Filter by Price */}
                <div className="space-y-3">
                    <h6 className="text-lg font-medium">Filter by Price</h6>
                    <Slider
                        value={context.value}
                        onChange={handleChange}
                        onChangeCommitted={handleSliderCommit}  // Trigger fetch when slider interaction is done
                        min={context.minPrice}
                        max={context.maxPrice}
                        valueLabelDisplay="auto"
                        step={0.01}
                        sx={{}}
                    />
                    <div className="flex justify-between text-sm">
                        <span>From: <strong className="text-green-600">${context.value[0]}</strong></span>
                        <span>To: <strong className="text-green-600">${context.value[1]}</strong></span>
                    </div>
                </div>

                {/* Product Status */}
                <div className="space-y-3">
                    <h6 className="text-lg font-medium">Product Status</h6>
                    <div className="max-h-60 overflow-y-auto">
                        <ul>
                            {productStatus.map((item, index) => (
                                <li key={`${index} ${item}`} value={item === 'In Stock' ? true : false}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => handleStatusChange(e, item === 'In Stock' ? true : false)}  // Correctly passing the boolean value
                                            />
                                        }
                                        label={item}
                                        componentsProps={{
                                            typography: {
                                                sx: {
                                                    fontFamily: '"New Amsterdam", sans-serif',
                                                },
                                            }
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Brands */}
                <div className="space-y-3">
                    <h6 className="text-lg font-medium">Brands</h6>
                    <div className="max-h-60 overflow-y-auto">
                        {Object.entries(context.brandsByCategory).map(([category, brands], index) => (
                            <div key={index}>
                                <h6 className="font-medium">{category}</h6>
                                <ul>
                                    {[...brands].map((brand, i) => (
                                        <li key={`${i} ${brand}`} value={`${brand}`}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={context.selectedBrands.includes(brand)} // Update to check if the brand is selected
                                                        onChange={(e) => handleBrandChange(e, brand)}
                                                    />
                                                }
                                                label={brand}
                                                componentsProps={{
                                                    typography: {
                                                        sx: {
                                                            fontFamily: '"New Amsterdam", sans-serif',
                                                        },
                                                    }
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Banner */}
                <div>
                    <Link to="#">
                        <img src={food_banner} className="w-full" alt="banner" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
