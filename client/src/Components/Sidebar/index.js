import React, { useContext, useEffect } from "react";
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

    const productStatus = ['In Stock', 'Out of Stock', 'On Sale']; // Adjusted to handle stock status

    // Fetch and set the price range based on product data
    useEffect(() => {
        const brandsMap = {};

        context.allProductData?.productList?.forEach(product => {
            const category = product.category.name;
            const brand = product.brand; // Assuming the product data includes a 'brand' field

            if (!brandsMap[category]) {
                brandsMap[category] = new Set();
            }

            brandsMap[category].add(brand);
        });

        context.setBrandsByCategory(brandsMap);
    }, [context.allProductData]);

    useEffect(() => {
        if (context.allProductData?.productList?.length > 0) {
            const prices = context.allProductData.productList.map((item) => parseFloat(item.price.$numberDecimal));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            context.setMinPrice(minPrice);
            context.setMaxPrice(maxPrice);
            context.setValue([minPrice, maxPrice]);
        }
    }, [context.allProductData]);

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
            const brandsQuery = context.selectedBrands.length > 0 ? `&brands=${context.selectedBrands.map(encodeURIComponent).join(',')}` : '';
            context.setPageFilter(1);

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

    const handleSelectStatus = (item) => {
        switch (item) {
            case 'In Stock':
                return 1;
            case 'Out of Stock':
                return 2;
            case 'On Sale':
                return 3;
            default:
                return;
        }
    }

    // Handle checkbox change for categories
    const handleCheckboxChange = (event, categoryId) => {
        context.setSelectedCategories(prev => {
            if (event.target.checked) {
                return [...prev, categoryId]; // Add category if checked
            } else {
                return prev.filter(id => id !== categoryId); // Remove category if unchecked
            }
        });
        navigator('/search');
    };

    // Handle checkbox change for stock status
    const handleStatusChange = (event, status) => {
        context.setSelectedStatus(prev => {
            if (event.target.checked) {
                return [...prev, status]; // Add status if checked
            } else {
                return prev.filter(s => s !== status); // Remove status if unchecked
            }
        });
        navigator('/search');
    };

    const handleBrandChange = (event, brand) => {
        context.setSelectedBrands(prev => {
            if (event.target.checked) {
                return [...prev, brand];
            } else {
                return prev.filter(b => b !== brand);
            }
        });
        navigator('/search');
    };

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
                                <li key={`${index} ${item}`} value={() => handleSelectStatus(item)}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => handleStatusChange(e, handleSelectStatus(item))} // Fix here
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
