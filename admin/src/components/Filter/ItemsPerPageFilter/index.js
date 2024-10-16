import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useContext } from 'react';
import { MyContext } from '../../../App';
import { getThemeStyles } from '../../../utils/themeConfig';

const ItemsPerPageFilter = ({ itemsPerPage, setItemsPerPage }) => {
    const itemsPerPageOptions = [
        { key: 5, value: 5 },
        { key: 10, value: 10 },
        { key: 20, value: 20 },
        { key: 50, value: 50 },
    ];

    const context = useContext(MyContext);
    const { modeSelectionBoxClass, modeArrowSelectionBoxClass, modeGradientTextClass } = getThemeStyles(context.themeMode);

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
    };

    return (
        <div className="">
            <h4 className="text-white text-xl mb-2">{`Items Per Page`}</h4>
            <FormControl
                sx={{
                    minWidth: '19%',
                }}
                size="small"
            >
                <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    sx={{
                        backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                        '& .MuiSvgIcon-root': {
                            color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                        },
                    }}
                >

                    {itemsPerPageOptions && itemsPerPageOptions.map((item, index) => (
                        <MenuItem key={index} value={item.value} className='menuItem'>
                            <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>{item.key}</p>
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>
        </div>
    );
};

export default ItemsPerPageFilter;
