// ICONS
import { HiDotsVertical } from "react-icons/hi";
import { IoIosTime } from "react-icons/io";


// MATERIAL UI
import Button from '@mui/material/Button';
import TrendingUp from "@mui/icons-material/TrendingUp";
import TrendingDown from "@mui/icons-material/TrendingDown";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// REACT
import { useState, useContext } from "react";

// COMPONENT
import { MyContext } from "../../../App";
import { getThemeStyles } from "../../../utils/themeConfig";

const DashboardBox = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const context = useContext(MyContext);
    const { modeGradientClass, iconClass, backgroundColorClass, textColorClass, modeGradientTextClass } = getThemeStyles(context.themeMode); 

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
                        <h4 className='text-white text-xl'>Total User</h4>
                        <p className='text-white text-5xl'>277</p>
                    </div>

                    <div className="size-14 bg-gray-500 flex justify-center items-center rounded-xl opacity-80">
                        {
                            props.icon ? <props.icon className='text-white text-4xl' /> : ''
                        }
                    </div>
                </div>

                {/* Flex row for last month and dots */}
                <div className="flex flex-row justify-between items-center mt-8 relative z-10">
                    <p className='text-white text-xl'>LAST MONTH</p>
                    <Button
                        className='dotsVertical hover:bg-transparent focus:ring focus:ring-violet-300'
                        style={{ justifyContent: 'flex-end', padding: '0px' }}
                        onClick={handleClick}
                        sx={{
                            minWidth: '20px'
                        }}
                    >
                        <HiDotsVertical className="text-white text-xl" />
                    </Button>
                </div>

                {/* Conditional rendering of the trending icon behind the content */}
                {
                    props.grow === true ?
                        <span className="chart absolute top-0 left-10 opacity-30 z-0">
                            <TrendingUp style={{ fontSize: '200px' }} />
                        </span>
                        :
                        <span className="chart absolute top-0 left-10 opacity-30 z-0">
                            <TrendingDown style={{ fontSize: '200px' }} />
                        </span>
                }

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
                                sx: {
                                    backgroundColor: backgroundColorClass,  // Apply the theme background color
                                    color: textColorClass, // Apply text color based on theme mode
                                }
                            },
                            
                        }}
                        
                    >
                        {options.map((option) => (
                            <MenuItem 
                                key={option} 
                                onClick={handleClose}
                            >
                                <IoIosTime className={`${iconClass} mr-3`} />
                                <p className={`tracking-wider font-bold ${modeGradientTextClass}`}>
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
