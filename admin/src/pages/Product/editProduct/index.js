// MATERIAL UI
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { emphasize, styled } from "@mui/material/styles";

// ICONS
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegImages } from "react-icons/fa";

// REACT
import { useContext, useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

// COMPONENTS
import { fetchDataFromApi, editData } from "../../../utils/api";
import { MyContext } from "../../../App";
import { getThemeStyles } from "../../../utils/themeConfig";

// breadcrumb code
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

const ProductEdit = () => {
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error_, setError] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
        brand: '',
        price: 0,
        oldPrice: 0,
        category: '',
        subCategory: '',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        isFeatured: '',
        discount: 0,
        images: [],
    });

    const [previews, setPreviews] = useState([]);

    const formData = new FormData();
    let { id } = useParams();
    let imgFiles;
    const navigate = useNavigate();

    const context = useContext(MyContext);
    const { mainBackgroundClass, modeGradientClass, modeInputClass, modeImagesInputClass, modeGradientTextClass, modeInputIconClass, modeSelectionBoxClass, modeArrowSelectionBoxClass } = getThemeStyles(context.themeMode);

    useEffect(() => {
        if (!imgFiles) return;

        let tmp = [];
        for (let i = 0; i < imgFiles.length; i++) {
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }

        setPreviews(tmp);

        // Clean up previous URLs
        return () => {
            tmp.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imgFiles]);

    useEffect(() => {
        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            setFormFields({
                name: res.name,
                description: res.description,
                brand: res.brand,
                price: res.price.$numberDecimal,
                oldPrice: res.oldPrice.$numberDecimal,
                category: res.category.id,  // assuming this is the category _id
                subCategory: res.subCategory.id,
                countInStock: res.countInStock,
                isFeatured: res.isFeatured,
            });
            setPreviews(res.images);

            // Filter subcategories based on the fetched category
            const filteredSubs = context.subCatDataBox?.subCategoryList?.filter((sub) => sub.category.id === res.category.id);
            setFilteredSubCategories(filteredSubs);
        });
    }, [id, context]);

    const changeInput = (e) => {
        setFormFields({ ...formFields, [e.target.name]: e.target.value });
    };

    // Modified onChangeFile function
    const onChangeFile = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an Array
        setUploading(true);

        // Make sure to check if formFields.images is an array, or default to an empty array
        const tempPreviews = [...previews]; // Keep existing previews
        const tempImages = Array.isArray(formFields.images) ? [...formFields.images] : []; // Keep existing images

        files.forEach((file) => {
            if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
                formData.append('images', [...previews, file]); // Append the file to FormData
                tempPreviews.push(URL.createObjectURL(file)); // Create preview for each valid image
                tempImages.push(file); // Append the new image to the formFields.images array
            }
        });

        // Update previews and formFields.images to include both previous and newly uploaded images
        setPreviews(tempPreviews);
        setFormFields((prev) => ({ ...prev, images: tempImages }));
        setUploading(false);
    };

    const inputCategoryChange = async (e) => {
        const { name, value } = e.target;

        // Update the selected category in form fields
        setFormFields((prev) => ({ ...prev, [name]: value, ['subCategory']: '' }));
        formFields.subCategory = '';

        // Ensure subcategories are filtered based on selected category
        if (context.subCatDataBox?.subCategoryList) {
            const filteredSubs = await context.subCatDataBox.subCategoryList.filter((sub) => sub.category.id === value);
            setFilteredSubCategories(filteredSubs);
            console.log("Filtered Subcategories:", filteredSubs);
        } else {
            setFilteredSubCategories([]); // Clear if no subcategories are found
        }
    };

    const EditProduct = (e) => {
        e.preventDefault();

        formData.append('name', formFields.name);
        formData.append('description', formFields.description);
        formData.append('brand', formFields.brand);
        formData.append('price', formFields.price);
        formData.append('oldPrice', formFields.oldPrice);
        formData.append('category', formFields.category);
        formData.append('subCategory', formFields.subCategory);
        formData.append('countInStock', formFields.countInStock);
        formData.append('isFeatured', formFields.isFeatured);

        // Ensure `formFields.images` is defined and is an array
        if (Array.isArray(formFields.images)) {
            // Append newly uploaded images
            formFields.images.forEach((file) => {
                formData.append('images', file);
            });
        }

        if (formFields.name &&
            formFields.description &&
            formFields.brand &&
            formFields.category &&
            formFields.subCategory &&
            (formFields.isFeatured === true || formFields.isFeatured === false || formFields.isFeatured === "true" || formFields.isFeatured === "false")) {
            setIsLoading(true);

            if (!id) {
                console.error("Product ID is undefined");
                return;
            }

            editData(`/api/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    setIsLoading(false);

                    fetchDataFromApi(`/api/product?page=${context.page}&limit=${context.itemsPerPage}&search=${context.searchQuery}&sortBy=${context.sortBy}`).then((res) => {
                        context.setProductData(res);
                    });

                    navigate('/products');
                })
                .catch((err) => {
                    setIsLoading(false);
                    console.error("Error updating sub category:", err);
                });
        } else {
            setError(true);
        }
    };

    const removeImg = (index) => {
        // Remove the image from previews
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);

        // Remove the image from formFields.images
        if (Array.isArray(formFields.images)) {
            const newImages = formFields.images.filter((_, i) => i !== index);
            setFormFields((prev) => ({
                ...prev,
                images: newImages,
            }));
        }
    };

    return (
        <>
            <div className={`flex flex-col ${mainBackgroundClass} p-10 min-h-[calc(100vh-84px)]`}>
                <div className={`${modeGradientClass} shadow-md rounded-lg mb-6 px-4`}>
                    <div className="flex justify-between items-center p-4">
                        <h5 className="text-xl font-bold tracking-widest text-white">Edit Category</h5>
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto">
                            <Link to='/'>
                                <StyledBreadcrumb

                                    label="Dashboard"
                                    icon={<HomeIcon fontSize="small" />}
                                />
                            </Link>

                            <Link to='/products'>
                                <StyledBreadcrumb

                                    label="Products"
                                    deleteIcon={<ExpandMoreIcon />}
                                />
                            </Link>
                            <StyledBreadcrumb
                                label="Edit Product"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>
                    </div>
                </div>

                <form className={`rounded-lg p-8 ${modeGradientClass} flex-grow`} onSubmit={EditProduct}>
                    <section className="mb-8">
                        {error_ && <p className="text-red-600">Please fill all the fields</p>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Product Name */}
                            <div>
                                <label className="block font-medium text-white">Product Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    value={formFields.name}
                                    onChange={changeInput}
                                    className={`mt-1 p-2 block w-full border rounded-md ${modeInputClass}`}
                                />
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="block font-medium text-white">Brand</label>
                                <input
                                    type="text"
                                    name='brand'
                                    value={formFields.brand}
                                    onChange={changeInput}
                                    className={`mt-1 p-2 block w-full border rounded-md ${modeInputClass}`}
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block font-medium text-white">Price</label>
                                <input
                                    type="number"
                                    name='price'
                                    min={0}
                                    step="0.01"
                                    value={formFields.price}
                                    onChange={changeInput}
                                    className={`mt-1 py-2 pl-5 block w-full border rounded-md ${modeInputClass}`}
                                />
                            </div>

                            {/* Old Price */}
                            <div>
                                <label className="block font-medium text-white">Old Price</label>
                                <input
                                    type="number"
                                    name='oldPrice'
                                    min={0}
                                    step="0.01"
                                    value={formFields.oldPrice}
                                    onChange={changeInput}
                                    className={`mt-1 py-2 pl-5 block w-full border rounded-md ${modeInputClass}`}
                                />
                            </div>

                            {/* Count in Stock */}
                            <div>
                                <label className="block font-medium text-white">Count in Stock</label>
                                <input
                                    type="number"
                                    name='countInStock'
                                    value={formFields.countInStock}
                                    onChange={changeInput}
                                    className={`mt-1 py-2 pl-5 block w-full border rounded-md ${modeInputClass}`}
                                />
                            </div>

                            {/* isFeatured */}
                            <div>
                                <label className="block font-medium text-white">Is Featured</label>
                                <Select
                                    value={formFields.isFeatured}
                                    onChange={changeInput}
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
                                    sx={{
                                        height: '45px',
                                        borderRadius: '5px',
                                        backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                                        '& .MuiSvgIcon-root': {
                                            color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200, // Set a fixed height to enable scroll
                                                overflowY: 'scroll', // Enable scrolling
                                            },
                                        },
                                    }}
                                    className="mt-1 p-2 block w-full border rounded-md bg-white text-black"
                                >
                                    <MenuItem value=''>
                                        <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>Select a Category</p>
                                    </MenuItem>
                                    {context.catDataBox?.categoryList?.map((cat, index) => (
                                        <MenuItem key={index} value={cat._id}>  {/* Use _id */}
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
                                    onChange={changeInput}
                                    name="subCategory"
                                    displayEmpty
                                    sx={{
                                        height: '45px',
                                        borderRadius: '5px',
                                        backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                                        '& .MuiSvgIcon-root': {
                                            color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200, // Set a fixed height to enable scroll
                                                overflowY: 'scroll', // Enable scrolling
                                            },
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
                                <textarea rows={5} name='description' value={formFields.description} onChange={changeInput} className={`mt-1 p-2 block w-full border rounded-md ${modeInputClass}`}></textarea>
                            </div>
                        </div>



                        <div className="my-8">
                            <h5 className="block font-medium text-white">Media and Published</h5>


                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md w-full p-4 relative">
                                    {previews && (
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            {previews.map((img, index) => (
                                                <div className="relative" key={index}>
                                                    <img
                                                        src={img.url ? img.url : img}
                                                        alt={`Preview ${index}`}
                                                        className="w-32 h-32 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImg(index)}
                                                        className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full">
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
                    </section>

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
        </>
    );
};

export default ProductEdit;
