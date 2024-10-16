
// REACT
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ICONS
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

// COMPONENTS
import { postData, fetchDataFromApi } from "../../../utils/api";
import { MyContext } from "../../../App";
import { getThemeStyles } from "../../../utils/themeConfig";

// MATERIAL UI
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Styled Breadcrumb
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

const AddSubCategory = () => {
    const [categorySelected, setCategorySelected] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({ category: '', name: '', images: [], color: '', });
    const [previews, setPreviews] = useState([]);

    const navigate = useNavigate();

    const context = useContext(MyContext);
    const { modeSelectionBoxClass, modeArrowSelectionBoxClass, mainBackgroundClass, modeGradientClass, modeInputClass, modeImagesInputClass, modeGradientTextClass, modeInputIconClass } = getThemeStyles(context.themeMode);

    const changeInput = (e) => {
        setFormFields({ ...formFields, [e.target.name]: e.target.value });
    };

    const handleChangeSubCategory = (event) => {
        setCategorySelected(event.target.value);
        setFormFields((prevState) => ({
            ...prevState,
            category: event.target.value, // This stores the ObjectId of the category
        }));
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


    const addSubCat = async (e) => {
        e.preventDefault();

        const formData = new FormData(); // Make sure to reset FormData
        formData.append('category', formFields.category);
        formData.append('name', formFields.name);
        formData.append('color', formFields.color);

        // Append each selected image to FormData
        formFields.images.forEach(file => {
            formData.append('images', file);
        });

        // Debugging: Check if form data is correct before sending
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        if (formFields.name && formFields.category && formFields.color && formFields.images.length) {
            setIsLoading(true);
            try {
                const res = await postData('/api/subcategory/create', formData);
                console.log('SubCategory created:', res);

                await fetchDataFromApi(`/api/subcategory?page=${context.page}&limit=${context.itemsPerPage}&search=${context.searchQuery}&sortBy=${context.sortBy}`).then((res) => {
                    context.setSubCatData(res);
                });

                navigate('/subcategories');
            } catch (error) {
                console.error('Error creating subcategory:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please fill all fields and upload at least one image.');
        }
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
        <div className={`flex flex-col ${mainBackgroundClass} p-10 min-h-[calc(100vh-84px)]`}>
            <div className={`${modeGradientClass} shadow-md rounded-lg mb-6 px-4`}>
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-bold tracking-widest text-white">Add Sub Category</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto">
                        <Link to='/'>
                            <StyledBreadcrumb label='Dashboard' icon={<HomeIcon fontSize="small" />} />
                        </Link>
                        <Link to='/subcategories'>
                            <StyledBreadcrumb label='Sub Category' deleteIcon={<ExpandMoreIcon />} />
                        </Link>
                        <StyledBreadcrumb label='Add Sub Category' deleteIcon={<ExpandMoreIcon />} />
                    </Breadcrumbs>
                </div>
            </div>

            <form className={`rounded-lg p-8 ${modeGradientClass} flex-grow`} onSubmit={addSubCat}>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block font-medium text-white">Category Name</label>
                        <Select
                            value={categorySelected}
                            onChange={handleChangeSubCategory}
                            displayEmpty
                            className="mt-1 p-2 block w-full border rounded-md bg-white text-black"
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Set a fixed height to enable scroll
                                        overflowY: 'scroll', // Enable scrolling
                                    },
                                },
                            }}
                            sx={{
                                width: '50%',
                                height: '45px',
                                borderRadius: '5px',
                                backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                                '& .MuiSvgIcon-root': {
                                    color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                                },
                            }}
                        >
                            <MenuItem value="">
                                <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>None</p>
                            </MenuItem>
                            {
                                context.catDataBox?.categoryList?.map((cat, index) => (
                                    <MenuItem className="text-capitalize" value={cat._id} key={index}>
                                        <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>{cat.name}</p>
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </div>

                    <div>
                        <label className="block font-medium text-white">Sub Category Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formFields.name}
                            onChange={changeInput}
                            className={`mt-1 p-2 block w-full border rounded-md ${modeInputClass}`}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-white">Color</label>
                        <input
                            type='text'
                            name='color'
                            value={formFields.color}
                            onChange={changeInput}
                            className={`mt-1 p-2 block w-full border rounded-md ${modeInputClass}`}
                        />
                    </div>

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
                </div>

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
            </form >
        </div >
    );
};

export default AddSubCategory;
