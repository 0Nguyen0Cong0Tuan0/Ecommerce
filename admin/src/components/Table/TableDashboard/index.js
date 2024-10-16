// ICONS
import { FaEye, FaTrash, FaStar } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

// COMPONENTS
import { MyContext } from "../../../App";
import { getThemeStyles } from "../../../utils/themeConfig";

// REACT
import { useContext } from "react";

const Table = ({ tableTitles, productData }) => {
    const context = useContext(MyContext);
    const { actionBtnClass } = getThemeStyles(context.themeMode);

    return (
        <div className="overflow-x-auto mt-8 rounded-xl">
            <table className="table-auto min-w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-700 text-xs text-white">
                    <tr className="text-lg tracking-widest">
                        {tableTitles.map((title, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="py-2 px-4 text-sm font-medium text-white"
                            >
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {productData.map((product, index) => (
                        <tr key={index} className="border-b bg-gray-800">
                            <td className="py-2 px-4 ">{product.uid}</td>
                            <td className="py-2 px-4 flex items-center">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded-full mr-3"
                                />
                                <span>{product.name}</span>
                            </td>
                            <td className="py-2 px-4">{product.category}</td>
                            <td className="py-2 px-4">{product.subCategory}</td>
                            <td className="py-2 px-4">{product.brand}</td>
                            <td className="py-2 px-4">
                                <span className="line-through text-gray-400 mr-2">
                                    ${product.oldPrice}
                                </span>
                                <span className="text-white">${product.price}</span>
                            </td>
                            <td className="py-2 px-4">{product.stock}</td>
                            <td className="py-2 px-4">
                                <FaStar className="fill-yellow-400 inline" /> {product.rating}
                            </td>
                            <td className="py-2 px-4">{product.orders}</td>
                            <td className="py-2 px-4">{product.sales}</td>
                            <td className="py-2 px-4 whitespace-nowrap overflow-x-auto">
                                <div className="flex space-x-2">
                                    <button className={`${actionBtnClass} text-white py-2 px-4 rounded`}>
                                        <FaEye className="text-md" />
                                    </button>
                                    <button className={`${actionBtnClass} text-white py-2 px-4 rounded`}>
                                        <FaPencil className="text-md" />
                                    </button>
                                    <button className={`${actionBtnClass} text-white py-2 px-4 rounded`}>
                                        <FaTrash className="text-md" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
