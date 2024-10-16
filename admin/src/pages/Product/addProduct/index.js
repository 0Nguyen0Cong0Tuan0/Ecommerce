// MATERIAL UI
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import { MenuItem, Select } from "@mui/material";

// REACT
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

// ICONS
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";


// COMPONENTS
import { postData, fetchDataFromApi } from "../../../utils/api";
import { MyContext } from '../../../App';
import { getThemeStyles } from "../../../utils/themeConfig";

// breadcrumb styling
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.6),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const ProductUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);

    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
        brand: '',
        price: 0,
        oldPrice: 0,
        category: '',
        subCategory: '',
        countInStock: 0,
        isFeatured: '',
        images: [],
    });

    const navigate = useNavigate();

    const context = useContext(MyContext);
    const { modeGradientTextClass, mainBackgroundClass, modeProductDetailsTextClass, modeGradientClass, modeSelectionBoxClass, modeArrowSelectionBoxClass, modeInputClass, modeInputIconClass, modeImagesInputClass } = getThemeStyles(context.themeMode);

    const addProduct = async (e) => {
        e.preventDefault();

        // Basic validation example
        if (!formFields.name ||
            !formFields.description ||
            !formFields.brand ||
            formFields.price <= 0 ||
            formFields.oldPrice <= 0 ||
            !formFields.category ||
            !formFields.subCategory ||
            !formFields.countInStock < 0
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        const formData = new FormData(); // Make sure to reset FormData
        formData.append('name', formFields.name);
        formData.append('description', formFields.description);
        formData.append('brand', formFields.brand);
        formData.append('price', formFields.price);
        formData.append('oldPrice', formFields.oldPrice);
        formData.append('category', formFields.category);
        formData.append('subCategory', formFields.subCategory);
        formData.append('countInStock', formFields.countInStock);
        formData.append('isFeatured', formFields.isFeatured);

        // Append each selected image to FormData
        formFields.images.forEach(file => {
            formData.append('images', file);
        });

        // Debugging: Check if form data is correct before sending
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        if (formFields.name &&
            formFields.description &&
            formFields.brand &&
            formFields.category &&
            formFields.subCategory &&
            formFields.isFeatured &&
            formFields.images.length) {
            setIsLoading(true);
            try {
                const res = await postData('/api/product/create', formData);
                console.log('Product created:', res);

                await fetchDataFromApi(`/api/product?page=${context.page}&limit=${context.itemsPerPage}&search=${context.searchQuery}&sortBy=${context.sortBy}`).then((res) => {
                    context.setProductData(res);
                });

                navigate('/products');
            } catch (error) {
                console.error('Error creating product:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please fill all fields and upload at least one image.');
        }
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setFormFields((prev) => ({ ...prev, [name]: value }));
    };

    const inputCategoryChange = async (e) => {
        const { name, value } = e.target;

        // Update the selected category in form fields
        setFormFields((prev) => ({ ...prev, [name]: value }));

        // Ensure subcategories are filtered based on selected category
        if (context.subCatDataBox?.subCategoryList) {
            const filteredSubs = await context.subCatDataBox?.subCategoryList?.filter((sub) => sub.category.id === value);
            setFilteredSubCategories(filteredSubs);
            console.log("Filtered Subcategories:", filteredSubs);
        } else {
            setFilteredSubCategories([]); // Clear if no subcategories are found

        }
    };

    const onChangeFile = async (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an Array
        setUploading(true);
        const tempPreviews = [];
    
        const validFiles = files.filter((file) => 
            file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        );
    
        validFiles.forEach((file) => {
            // Create preview for each valid image
            tempPreviews.push(URL.createObjectURL(file));
        });
    
        // Append previews to the current preview state
        setPreviews((prev) => [...prev, ...tempPreviews]);
    
        // Append the valid files to the form fields for upload
        setFormFields((prev) => ({
            ...prev,
            images: [...prev.images, ...validFiles], // Append new files to the existing ones
        }));
    
        setUploading(false);
    };
    

    const removeImg = (index) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        // Optionally: Remove the corresponding file from formData here

        // Also, remove the corresponding file from formFields.images
        const newImages = formFields.images.filter((_, i) => i !== index);
        setFormFields((prev) => ({
            ...prev,
            images: newImages,
        }));
    };

    return (
        <div className={`flex flex-col ${mainBackgroundClass} ${modeProductDetailsTextClass} p-10`}>
            {/* Page Header */}
            <div className={`container ${modeGradientClass} shadow-md rounded-lg mb-6 px-4`}>
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-bold tracking-widest">Upload Product</h5>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to='/'>
                            <StyledBreadcrumb label='Dashboard' icon={<HomeIcon fontSize="small" />} />
                        </Link>
                        <Link to='/products'>
                            <StyledBreadcrumb label='Products' deleteIcon={<ExpandMoreIcon />} />
                        </Link>
                        <StyledBreadcrumb label='Add Product' deleteIcon={<ExpandMoreIcon />} />
                    </Breadcrumbs>
                </div>
            </div>

            {/* Product Upload Form */}
            <form className={`rounded-lg p-8 ${modeGradientClass}`} onSubmit={addProduct}>
                {/* Section: Basic Information */}
                <section className="mb-8">
                    <h5 className="text-xl font-bold tracking-widest mb-4">Basic Information</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Product Name */}
                        <div className="form-group">
                            <label className="block font-medium">Product Name</label>
                            <input type="text" name='name' value={formFields.name} onChange={inputChange} className={`mt-1 p-2 block w-full border rounded-md ${modeInputClass}`} />
                        </div>

                        {/* Brand */}
                        <div className="form-group">
                            <label className="block font-medium">Brand</label>
                            <input type="text" name='brand' value={formFields.brand} onChange={inputChange} className={`mt-1 p-2 block w-full border rounded-md ${modeInputClass}`} />
                        </div>

                        {/* Price */}
                        <div className="form-group">
                            <label className="block font-medium">Price</label>
                            <input type="number" name='price' min={0} step="0.01" value={formFields.price} onChange={inputChange} className={`mt-1 py-2 pl-5 block w-full border rounded-md ${modeInputClass}`} />
                        </div>

                        {/* Old Price */}
                        <div className="form-group">
                            <label className="block font-medium">Old Price</label>
                            <input type="number" name='oldPrice' min={0} step="0.01" value={formFields.oldPrice} onChange={inputChange} className={`mt-1 py-2 pl-5 block w-full border rounded-md ${modeInputClass}`} />
                        </div>

                        {/* Count in Stock */}
                        <div className="form-group">
                            <label className="block font-medium">Count in Stock</label>
                            <input type="number" name='countInStock' value={formFields.countInStock} onChange={inputChange} className={`mt-1 py-2 pl-5 block w-full border rounded-md ${modeInputClass}`} />
                        </div>

                        {/* isFeatured */}
                        <div className="form-group">
                            <label className="block font-medium">Is Featured</label>
                            <Select
                                value={formFields.isFeatured}
                                onChange={inputChange}
                                name="isFeatured"
                                displayEmpty
                                sx={{
                                    height: '45px',
                                    borderRadius: '5px',
                                    backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                                    '& .MuiSvgIcon-root': {
                                        color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                                    },
                                }}
                                className="mt-1 p-2 block w-full border rounded-md bg-white text-black"

                            >
                                <MenuItem value=""><p className={`font-bold tracking-widest ${modeGradientTextClass}`}>None</p></MenuItem>
                                <MenuItem value={"false"}>
                                    <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>False</p>
                                </MenuItem>
                                <MenuItem value={"true"}>
                                    <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>True</p>
                                </MenuItem>
                            </Select>
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label className="block font-medium">Category</label>
                            <Select
                                value={formFields.category}
                                onChange={inputCategoryChange}
                                name="category"
                                displayEmpty
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200, // Set a fixed height to enable scroll
                                            overflowY: 'scroll', // Enable scrolling
                                        },
                                    },
                                }}
                                sx={{
                                    height: '45px',
                                    borderRadius: '5px',
                                    backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                                    '& .MuiSvgIcon-root': {
                                        color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                                    },
                                }}
                                className="mt-1 p-2 block w-full border rounded-md bg-white text-black"
                            >
                                <MenuItem value=''><p className={`font-bold tracking-widest ${modeGradientTextClass}`}>Select a Category</p></MenuItem>
                                {context.catDataBox?.categoryList?.map((cat, index) => (
                                    <MenuItem key={index} value={cat._id}>
                                        <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>{cat.name}</p>
                                    </MenuItem>

                                ))}
                            </Select>
                        </div>

                        {/* Sub Category */}
                        <div className="form-group">
                            <label className="block font-medium">Sub Category</label>
                            <Select
                                value={formFields.subCategory}
                                onChange={inputChange}
                                name="subCategory"
                                displayEmpty
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200, // Set a fixed height to enable scroll
                                            overflowY: 'scroll', // Enable scrolling
                                        },
                                    },
                                }}
                                sx={{
                                    height: '45px',
                                    borderRadius: '5px',
                                    backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                                    '& .MuiSvgIcon-root': {
                                        color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                                    },
                                }}
                                className="mt-1 p-2 block w-full border rounded-md bg-white text-black"
                                disabled={!formFields.category}
                            >
                                <MenuItem value=''><p className={`font-bold tracking-widest ${modeGradientTextClass}`}>Select a Sub Category</p></MenuItem>
                                {filteredSubCategories?.map((sub, index) => (
                                    <MenuItem key={index} value={sub._id}>
                                        <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>{sub.name}</p>
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-4">
                        <div className="form-group">
                            <label className="block font-medium">Description</label>
                            <textarea rows={5} name='description' value={formFields.description} onChange={inputChange} className={`mt-1 p-2 block w-full border rounded-md ${modeInputClass}`}></textarea>
                        </div>
                    </div>
                </section>

                <div className="mb-8">
                    <h5 className="block font-medium text-white">Media and Published</h5>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md w-full p-4 relative">
                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {previews.map((img, index) => (
                                        <div className="relative" key={index}>
                                            <img src={img} alt={`Preview ${index}`} className="w-32 h-32 object-cover rounded-md" />
                                            <button type="button" onClick={() => removeImg(index)} className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full">
                                                <IoIosCloseCircleOutline />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {uploading ? (
                                <div className="flex flex-col items-center">
                                    <CircularProgress />
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={onChangeFile}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center w-full">
                                        <FaRegImages className={`text-4xl ${modeImagesInputClass}`} />
                                        <p className={`mt-2 ${modeImagesInputClass}`}>Drag & Drop your images here or Click to Upload</p>
                                    </label>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section: Image Upload */}
                {/* [Your existing image upload section code] */}

                {/* Submit Button */}
                <div className="text-right">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : <FaCloudUploadAlt className={`${modeInputIconClass}`} />}
                        className={`px-6 py-2`}
                        sx={{
                            backgroundColor: 'white',
                            '&:hover': {
                                backgroundColor: '#d1d5db',
                            },
                        }}
                    >
                        {isLoading ? 'Uploading...' : <p className={`${modeGradientTextClass} text-lg font-bold`}>Publish and View</p>}
                    </Button>
                </div>
            </form>
        </div>
    );
};


export default ProductUpload;
