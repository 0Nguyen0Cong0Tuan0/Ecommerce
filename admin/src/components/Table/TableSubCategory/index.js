import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import { useContext } from "react";
import { MyContext } from "../../../App";
import { getThemeStyles } from "../../../utils/themeConfig";

const TableSubCategory = ({ subCategoryTableTitle, subCatData, deleteSubCat, handleChangePage }) => {
    const context = useContext(MyContext);
    const { actionBtnClass, modeCheckBoxCheckedClass } = getThemeStyles(context.themeMode);

    return (
        <div className="overflow-x-auto mt-5 rounded-xl">
            <table className="table-auto min-w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-700 text-xs text-white">
                    <tr className="text-lg tracking-widest">
                        {subCategoryTableTitle.map((title, idx) => (
                            <th key={idx} scope="col" className="py-2 px-4 text-left text-sm font-medium text-white">
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        context.subCatData?.subCategoryList?.length !== 0 && context.subCatData?.subCategoryList?.map((item, index) => (
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
                                <td className="py-2 px-4">{item.name}</td>
                                <td className="py-2 px-4">{item.category.name}</td>
                                <td className="py-2 px-4">
                                    <img src={item.images[0].url} alt={item.subCat} className="w-16 h-16 object-cover rounded-md" />
                                </td>
                                <td className="py-2 px-4">
                                    <span style={{ backgroundColor: item.color }} className="px-2 py-1 rounded-lg">
                                        {item.color}
                                    </span>
                                </td>
                                <td className="py-2 px-4">
                                    <div className='flex space-x-2'>
                                        <Link to={`/subcategory/edit/${item._id}`}>
                                            <button className={`${actionBtnClass} text-white py-2 px-4 rounded`}>
                                                <FaPencilAlt className="text-md" />
                                            </button>
                                        </Link>
                                        <button className={`${actionBtnClass} text-white py-2 px-4 rounded`} onClick={() => deleteSubCat(item._id)}>
                                            <MdDelete className="text-md" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {context.subCatData?.totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        count={context.subCatData?.totalPages}
                        color='primary'
                        onChange={handleChangePage} // Use handleChangePage prop here
                    />
                </div>
            )}
        </div>
    );
};

export default TableSubCategory;
