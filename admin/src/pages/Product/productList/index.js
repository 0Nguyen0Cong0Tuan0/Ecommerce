import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';

import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { MyContext } from '../../../App';
import { getThemeStyles } from '../../../utils/themeConfig';
import { emphasize, styled } from "@mui/material/styles";
import { deleteData, fetchDataFromApi } from '../../../utils/api';
import TableProduct from '../../../components/Table/TableProduct'; // Create Subcategory table component
import ItemsPerPageFilter from '../../../components/Filter/ItemsPerPageFilter';
import SortFilter from '../../../components/Filter/SortFilter';

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

const Product = () => {
    const context = useContext(MyContext);
    const { mainBackgroundClass, modeGradientClass, hoverBtnClass } = getThemeStyles(context.themeMode);

    const productTableTitle = ["UID", "NAME", "CATEGORY", "SUB CATEGORY", "BRAND", "PRICE", "COUNT_IN_STOCK", "IS_FEATURED", "ACTION"];

    const deleteProduct = (id) => {
        deleteData(`/api/product/${id}`).then(() => {
            fetchDataFromApi(`/api/product?page=${context.page}&limit=${context.itemsPerPage}&search=${context.searchQuery}&sortBy=${context.sortBy}`).then((res) => {
                context.setProductData(res);
            })
        });
    };

    const handleChangePage = (event, value) => {
        context.setPage(value);
    };

    return (
        <div className={`flex flex-col ${mainBackgroundClass} p-10 min-h-[calc(100vh-84px)]`}>
            <div className={`${modeGradientClass} shadow-md rounded-lg mb-6 px-4`}>
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-bold tracking-widest text-white">Product List</h5>
                    <div className="flex flex-row gap-2 items-center">
                        <Breadcrumbs aria-label='breadcrumb'>
                            <Link to='/'>
                                <StyledBreadcrumb label='Dashboard' icon={<HomeIcon fontSize="small" />} />
                            </Link>
                            <Link to='/products'>
                                <StyledBreadcrumb label='Product' deleteIcon={<ExpandMoreIcon />} />
                            </Link>
                        </Breadcrumbs>
                        <Link to='/product/upload'>
                            <Button className={hoverBtnClass}
                                sx={{
                                    fontFamily: '"New Amsterdam", sans-serif',
                                    background: 'white',
                                    borderRadius: '20px',
                                    marginLeft: '10px',
                                    padding: '2px 10px',
                                    transition: 'background-color 0.3s, color 0.3s',
                                    color: `black`,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    '&:hover': {
                                        color: 'white',
                                    },
                                }}
                            >
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={`bg-white mt-8 w-full px-10 py-5 rounded-xl ${modeGradientClass} flex-grow`}>
                <h3 className="text-white text-2xl">PRODUCT LIST</h3>

                {/* Filters */}
                <div id="Filter">
                    <div className="mt-5 grid grid-cols-2 gap-8">
                        <SortFilter
                            sortBy={context.sortBy}
                            setSortBy={context.setSortBy}
                            searchQuery={context.searchQuery}
                            setSearchQuery={context.setSearchQuery}
                        />
                        <ItemsPerPageFilter
                            itemsPerPage={context.itemsPerPage}
                            setItemsPerPage={context.setItemsPerPage}
                        />
                    </div>
                </div>
                <TableProduct
                    productTableTitle={productTableTitle}
                    deleteProduct={deleteProduct}
                    handleChangePage={handleChangePage}
                />
            </div>
        </div>
    );
};

export default Product;
