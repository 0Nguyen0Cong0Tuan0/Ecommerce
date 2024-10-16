import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';

import { useContext } from 'react';
import { MyContext } from '../../../App';
import { getThemeStyles } from '../../../utils/themeConfig';

const SortFilter = ({ sortBy, setSortBy, searchQuery, setSearchQuery }) => {
    const context = useContext(MyContext);
    const { modeSelectionBoxClass, modeArrowSelectionBoxClass, modeGradientTextClass, modeTextFieldFocusClass, modeTextFieldInputClass } = getThemeStyles(context.themeMode);

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <>
            <div className="">
                <h4 className="text-white text-xl mb-2">{`Search By Category Name`}</h4>
                <TextField
                    defaultValue="Search by Category Name"
                    variant="outlined"
                    color="secondary"
                    focused
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                        backgroundColor: `${modeSelectionBoxClass}`, // Background color for the select box
                        width: "50%", // Adjust width to make it shorter
                        borderRadius: '5px',
                        '& .MuiOutlinedInput-root': {
                            '& input': {
                                color: `${modeTextFieldInputClass}`, // Change input text color to white
                                fontFamily: '"New Amsterdam", sans-serif',
                            },
                            '& fieldset': {
                                borderColor: "white", // Optional: change the border color to white
                                borderRadius: '5px',
                            },
                            '&.Mui-focused fieldset': {
                                border: `2px solid ${modeTextFieldFocusClass}`,
                            },
                        },
                    }}
                    size='small'
                />
            </div>

            <div>
                <h4 className="text-white text-xl mb-2">{`SORT BY`}</h4>
                <FormControl
                    sx={{
                        minWidth: '70%',
                    }}
                    size="small">
                    <Select
                        value={sortBy}
                        onChange={handleSortChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{
                            width: '55%',
                            backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                            '& .MuiSvgIcon-root': {
                                color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                            },
                        }}
                    >
                        <MenuItem value="">
                            <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>None</p></MenuItem>
                        <MenuItem value="name-asc">
                            <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>Sort by Name ASC</p>
                        </MenuItem>
                        <MenuItem value="name-desc">
                            <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>Sort by Name DESC</p>
                        </MenuItem>
                        <MenuItem value="date-asc">
                            <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>Sort by Date ASC</p>
                        </MenuItem>
                        <MenuItem value="date-desc">
                            <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>Sort by Date DESC</p>
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
        </>

    );
};

export default SortFilter;
