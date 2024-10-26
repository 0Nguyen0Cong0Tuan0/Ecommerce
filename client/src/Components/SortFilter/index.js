import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const SortFilter = ({ sortBy, setSortBy }) => {
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    return (
        <>
            <div>
                <h4 className="text-white text-xl">{`SORT BY`}</h4>
                <FormControl
                    sx={{
                        minWidth: '150px', // Increased the minimum width
                    }}
                    size="small"
                >
                    <Select
                        value={sortBy}
                        onChange={handleSortChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{
                            width: '200px', // Set a fixed width for the Select component
                            '& .MuiSvgIcon-root': {},
                        }}
                    >
                        <MenuItem value="">
                            <p className={`font-bold tracking-widest`}>None</p>
                        </MenuItem>
                        <MenuItem value="rating-asc">
                            <p className={`font-bold tracking-widest`}>Sort by Rating ASC</p>
                        </MenuItem>
                        <MenuItem value="rating-desc">
                            <p className={`font-bold tracking-widest`}>Sort by Rating DESC</p>
                        </MenuItem>
                        <MenuItem value="date-asc">
                            <p className={`font-bold tracking-widest`}>Sort by Date ASC</p>
                        </MenuItem>
                        <MenuItem value="date-desc">
                            <p className={`font-bold tracking-widest`}>Sort by Date DESC</p>
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
        </>
    );
};

export default SortFilter;
