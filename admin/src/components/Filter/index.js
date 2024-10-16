// MATERIAL UI
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

// REACT
import { useState, useContext } from "react";

// COMPONENTS
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

const Filter = ({ type, options }) => {
    const context = useContext(MyContext);
    const { modeGradientTextClass, modeSelectionBoxClass, modeArrowSelectionBoxClass } = getThemeStyles(context.themeMode);

    const [option, setOption] = useState('');

    return (
        <>
            <div id={`${type}`}>
                <h4 className="text-white text-xl mb-2">{`${type}`}</h4>
                <FormControl
                    sx={{
                        minWidth: '50%',
                        maxHeight: '40px',
                    }}
                    size="small"
                >
                    <Select
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{
                            backgroundColor: `${modeSelectionBoxClass}`, // White background for the select box
                            '& .MuiSvgIcon-root': {
                                color: `${modeArrowSelectionBoxClass}`,   // Arrow icon color
                            },
                        }}
                    >
                        {options && options.map((item, index) => (
                            <MenuItem key={index} value={item.value} className='menuItem'>
                                <p className={`font-bold tracking-widest ${modeGradientTextClass}`}>{item.key}</p>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </>
    )
};

export default Filter;
