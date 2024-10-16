import { FaPencilAlt, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import { useContext } from "react";
import { MyContext } from "../../../App";
import { getThemeStyles } from "../../../utils/themeConfig";

const TableProduct = ({ productTableTitle, deleteProduct, handleChangePage }) => {
    const context = useContext(MyContext);
    const { actionBtnClass, modeCheckBoxCheckedClass } = getThemeStyles(context.themeMode);


    return (
        <div className="overflow-x-auto mt-5 rounded-xl">
            <table className="table-auto min-w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-700 text-xs text-white">
                    <tr className="text-lg tracking-widest">
                        {productTableTitle.map((title, idx) => (
                            <th key={idx} scope="col" className="py-2 px-4 text-left text-sm font-medium text-white">
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        context.productData?.productList?.length !== 0 && context.productData?.productList?.map((item, index) => (
                            <tr key={item._id} className="border-b bg-gray-800">
                                <td className="py-2 px-4">
                                    <div className="flex items-center">
                                        <Checkbox
                                            sx={{
                                                color: 'white',
                                                '&.Mui-checked': {
                                                    color: modeCheckBoxCheckedClass,
                                                },
                                            }}
                                        />
                                        <span>#{index + 1}</span>
                                    </div>
                                </td>
                                <td className="py-2 px-4 flex items-center">
                                    <img
                                        src={item.images[0].url}
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded-md" />
                                    <span className="py-2 px-4">{item.name}</span>
                                </td>

                                <td className="py-2 px-4">{item.category.name}</td>
                                <td className="py-2 px-4">{item.subCategory.name}</td>
                                <td className="py-2 px-4">{item.brand}</td>
                                <td className="py-2 px-4">
                                    <span className="line-through text-gray-400 mr-2">
                                        ${item.oldPrice.$numberDecimal}
                                    </span>
                                    <span className="text-white">${item.price.$numberDecimal}</span>
                                </td>

                                <td className="py-2 px-4">{item.countInStock}</td>
                                <td className="py-2 px-4">
                                    {
                                        item.isFeatured ? 'True' : 'False'
                                    }
                                </td>
                                <td className="py-2 px-4">
                                    <div className='flex space-x-2'>
                                        <Link to={`/product/info/${item._id}`}>
                                            <button className={`${actionBtnClass} text-white py-2 px-4 rounded`}>
                                                <FaEye className="text-md" />
                                            </button>
                                        </Link>
                                        <Link to={`/product/edit/${item._id}`}>
                                            <button className={`${actionBtnClass} text-white py-2 px-4 rounded`}>
                                                <FaPencilAlt className="text-md" />
                                            </button>
                                        </Link>
                                        <button className={`${actionBtnClass} text-white py-2 px-4 rounded`} onClick={() => deleteProduct(item._id)}>
                                            <MdDelete className="text-md" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {context.productData?.totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        count={context.productData?.totalPages}
                        color='primary'
                        onChange={handleChangePage} // Use handleChangePage prop here
                    />
                </div>
            )}
        </div>
    );
};

export default TableProduct;
