// MATERIAL UI
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// REACT
import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// COMPONENTS
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import { getThemeStyles } from "../../utils/themeConfig";

// ICONS
import { MdDriveFileRenameOutline, MdBrandingWatermark, MdCategory } from "react-icons/md";
import { IoMdPricetag, IoMdPricetags } from "react-icons/io";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaCartArrowDown } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";

// Styled Breadcrumb using Material UI theme
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];

  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.6),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});


const ProductDetails = () => {
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    brand: '',
    price: 0,
    oldPrice: 0,
    categoryId: '',
    categoryName: '',
    subCategoryId: '',
    subCategoryName: '',
    countInStock: 0,
    isFeatured: '',
    images: [],
  });

  const [imageSlider, setImageSlider] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  let { id } = useParams();
  const context = useContext(MyContext);
  const { mainBackgroundClass, modeGradientClass, modeProductDetailsTextClass } = getThemeStyles(context.themeMode);

  useEffect(() => {
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      setFormFields({
        name: res.name,
        description: res.description,
        brand: res.brand,
        price: res.price.$numberDecimal,
        oldPrice: res.oldPrice.$numberDecimal,
        categoryId: res.category.id,
        subCategoryId: res.subCategory.id,
        categoryName: res.categoryName,  // Using the category name from the API
        subCategoryName: res.subCategoryName,  // Using the subcategory name from the API
        countInStock: res.countInStock,
        isFeatured: res.isFeatured,
      });
      setImageSlider(res.images);
    });
  }, [id, context]);

  const productDetails = [
    { label: "Name", value: formFields.name, icon: <MdDriveFileRenameOutline /> },
    { label: "Brand", value: formFields.brand, icon: <MdBrandingWatermark /> },
    { label: "Category", value: `${formFields.categoryName} [ ID: ${formFields.categoryId} ]`, icon: <MdCategory /> },
    { label: "Subcategory", value: `${formFields.subCategoryName} [ ID: ${formFields.subCategoryId} ]`, icon: <BiSolidCategoryAlt /> },
    { label: "Price", value: `$${formFields.price}`, icon: <IoMdPricetags /> },
    { label: "Old Price", value: `$${formFields.oldPrice}`, icon: <IoMdPricetag /> },
    { label: "Discount", value: `${((1 - formFields.price / formFields.oldPrice) * 100).toFixed(2)}%`, icon: <RiDiscountPercentFill /> },
    { label: "Stock", value: formFields.countInStock, icon: <FaCartArrowDown /> },
    { label: "Featured", value: formFields.isFeatured ? "True" : "False", icon: <FaRankingStar /> },
  ];

  const formatDescription = (description) => {
    // Find the index of the first occurrence of ' - '
    const firstHyphenIndex = description.indexOf('-');

    // Check if the hyphen exists
    if (firstHyphenIndex === -1) {
      return (
        <div className="mt-8 col-span-12">
          <h3 className="text-xl font-bold tracking-widest mb-4">Description</h3>
          <p className="text-base leading-relaxed text-justify">{description}</p>
        </div>
      );
    }

    // Get the main text (up to the first hyphen)
    const mainText = description.substring(0, firstHyphenIndex).trim();
    const listText = description.substring(firstHyphenIndex);

    // Split the list text into individual items and clean them
    const splitInfo = listText.split('-').map(part => part.trim()).filter(part => part.length > 0);

    return (
      <div className="mt-8 col-span-12">
        <h3 className="text-xl font-bold tracking-widest mb-4">Description</h3>
        <p className="text-base leading-relaxed text-justify">{mainText}</p>
        <ul className="list-disc pl-5 mt-4">
          {splitInfo.map((item, index) => (
            <li key={index} className="text-base leading-relaxed">
              {item.replace(/[-]+/g, "").trim()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Helper to navigate through images
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageSlider.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageSlider.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={`flex flex-col ${mainBackgroundClass} ${modeProductDetailsTextClass} p-10`}>
      {/* Breadcrumb Section */}
      <div className={`container ${modeGradientClass} shadow-md rounded-lg mb-6 px-4`}>
        <div className="flex justify-between items-center p-4">
          <h5 className="text-xl font-bold tracking-widest">Product Details</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto">
            <Link to='/products'>
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
              label="Product Details"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>
      </div>

      {/* Product Image and Details Section */}
      <div className={`container mx-auto grid grid-cols-12 gap-8 ${modeGradientClass} rounded-lg shadow-md p-8`}>
        {/* Left Section: Product Gallery */}
        <div className="col-span-4">
          <h3 className="text-xl font-bold tracking-widest mb-4">Product Gallery</h3>
          <div className="relative flex flex-row items-center">
            <IconButton
              onClick={handlePrevImage}
              className="absolute left-0 transform -translate-y-1/2 top-1/2 z-10"
            >
              <ArrowBackIosIcon />
            </IconButton>
            <img
              src={imageSlider.length > 0 ? imageSlider[currentImageIndex]?.url : ""}
              alt="Product"
              className="w-full h-auto object-cover rounded-lg mb-4 border border-2 border-dashed	"
            />
            <IconButton
              onClick={handleNextImage}
              className="absolute right-0 transform -translate-y-1/2 top-1/2 z-10"
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>

          <div className="ml-10 w-full">
            <div className="grid grid-cols-3 gap-2 mt-4">
              {imageSlider.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer border border-2 border-dashed transition duration-500 ${currentImageIndex === index ? "border-2 border-black scale-75 " : "scale-100"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="col-span-8 text-base ml-40">
          <h3 className="text-xl font-bold tracking-widest mb-4">PRODUCT DETAIL</h3>
          <h3 className="text-xl font-bold tracking-widest">Basic Information</h3>

          <div className="w-full overflow-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-semibold text-gray-700"></th>
                  <th className="px-4 py-2 font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {productDetails.map((detail, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 flex items-center">
                      {detail.icon}
                      <span className="ml-2">{detail.label}</span>
                    </td>
                    <td className="px-4 py-2">{detail.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <div className="mt-8 col-span-12"> {/* Adds spacing between sections */}
          {
            formatDescription(formFields.description)
          }
        </div>

      </div>



    </div>
  );
};

export default ProductDetails;

// Hardcoded product details for now (can be replaced with API data)
// const product = {
//   name: "Product Name Example",
//   subCat: "Example Subcategory",
//   description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
//   brand: "Example Brand",
//   price: 100,
//   oldPrice: 120,
//   category: "Example Category",
//   countInStock: 50,
//   isFeatured: true,
//   discount: 20,
//   productRAMS: ["8GB", "16GB", "24GB", "36GB"],
//   productSIZE: ["15 inches", "20 inches", "30 inches"],
//   productWEIGHT: "1.5 kg",
//   images: [
//     "https://achaumobile.com/wp-content/uploads/2022/03/iPhone-X-2.jpg.webp",
//     "https://achaumobile.com/wp-content/uploads/2022/03/iPhone-X-2.jpg.webp",
//     "https://achaumobile.com/wp-content/uploads/2022/03/iPhone-X-2.jpg.webp",
//   ],
// };