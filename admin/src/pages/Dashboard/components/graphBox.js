import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosTime } from "react-icons/io";


// MATERIAL UI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// REACT
import { useState, useContext } from "react";

// COMPONENTS
import { MyContext } from "../../../App";
import { getThemeStyles } from "../../../utils/themeConfig";

const DashboardBox = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const context = useContext(MyContext);
    const { modeGradientClass } = getThemeStyles(context.themeMode);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const options = [
        'Last Day',
        'Last Week',
        'Last Month',
        'Last Year'
    ];

    const ITEM_HEIGHT = 48;

    return (
        <>
            <div className={`w-full h-full ${props.bg} ${modeGradientClass} px-8 py-5 rounded-xl relative`}>

                {/* Flex row for title and icon */}
                <div className="flex flex-row justify-between items-center relative z-10">
                    <div className="flex flex-col items-start">
                        <h4 className='text-white text-xl'>{props.title}</h4>
                    </div>

                    <Button
                        className='dotsVertical hover:bg-transparent focus:ring focus:ring-violet-300'
                        style={{ justifyContent: 'flex-end', padding: '0px' }}
                        sx={{
                            minWidth: '20px'
                        }}
                        onClick={handleClick}
                    >
                        <HiDotsHorizontal className="text-white text-xl" />
                    </Button>
                </div>

                <div className="flex flex-row justify-between items-center mt-8 relative z-10">
                    <p className='text-white text-4xl'>$3,787,681.00</p>
                </div>

                {
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            },
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem key={option} onClick={handleClose}>
                                <IoIosTime className="fill-red-700 mr-3" />
                                <p className="bg-gradient-to-r from-red-700 via-red-500 to-black text-transparent bg-clip-text">
                                    {option}
                                </p>
                            </MenuItem>
                        ))}
                    </Menu>
                }
            </div>
        </>
    )
}

export default DashboardBox;
