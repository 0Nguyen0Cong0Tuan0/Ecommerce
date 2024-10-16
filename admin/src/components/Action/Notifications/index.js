// ICONS
import { BiSolidBellRing } from "react-icons/bi";

// MATERIAL UI
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

// COMPONENTS
import { MyContext } from "../../../App";

// REACT
import { useState, useContext } from 'react';

// Import theme styles
import { getThemeStyles } from '../../../utils/themeConfig';

const Notifications = () => {
    const context = useContext(MyContext);
    const { iconClass, modeGradientClass, modeGradientTextClass, backgroundColorClass, textColorClass ,hoverBtnClass, modeNotificationTextClass } = getThemeStyles(context.themeMode);

    const [isOpenNotifications, setIsOpenNotifications] = useState(false);

    const handleOpenNotificationDropDownBox = (event) => {
        setIsOpenNotifications(event.currentTarget);
    };

    const handleCloseNotificationDropDownBox = () => {
        setIsOpenNotifications(null);
    };

    return (
        <>
            <Button
                className="hover:bg-transparent"
                onClick={handleOpenNotificationDropDownBox}
            >
                <BiSolidBellRing
                    className={`${iconClass}`}
                    size={30}
                />
            </Button>

            <Menu
                anchorEl={isOpenNotifications}
                id="notifications"
                open={Boolean(isOpenNotifications)}
                onClose={handleCloseNotificationDropDownBox}
                onClick={handleCloseNotificationDropDownBox}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        maxHeight: 400, // Set a maximum height for the whole menu
                        overflowY: 'visible', // Enable vertical scrolling for inner content
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        backgroundColor: backgroundColorClass,  // Apply the theme background color
                        color: textColorClass, // Apply text color based on theme mode
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 27,
                            width: 10,
                            height: 10,
                            bgcolor: backgroundColorClass,
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Notification Header (Non-scrollable) */}
                <div className={`flex justify-between items-center mx-8 m-3`}>
                    <h3 className={`text-lg ${modeGradientTextClass}`}>NOTIFICATION (12)</h3>
                    <Button>
                        <p className={`text-white text-lg ${modeGradientClass} p-1 px-4 rounded-lg ${hoverBtnClass} transition duration-300`}>
                            View All
                        </p>
                    </Button>
                </div>

                <div className={`w-full h-0.5 ${modeGradientClass}`}></div>

                {/* Scrollable notifications start here */}
                <div style={{ maxHeight: 250, overflowY: 'auto' }} className="divide-y divide-black">
                    {Array(12).fill(0).map((_, index) => (
                        <div key={index}>
                            <MenuItem className="h-20" onClick={handleCloseNotificationDropDownBox}>
                                <IconButton className="rounded-full m-0 p-0">
                                    <Avatar
                                        src="https://external-preview.redd.it/gzR5Doqv9u5LMpkMkbC6zUXvmI81XLYYZxNe63N-M4o.jpg?width=640&crop=smart&auto=webp&s=2542193506e91aa13bf104d9142a3eae651b6f59"
                                        className="w-10 h-10"
                                    />
                                </IconButton>
                                <div id="notification content mr-3">
                                    <span className={`${modeGradientTextClass} text-xs`}>
                                        Nguyen Cong Tuan
                                    </span>
                                    <span className={`text-xs ${modeNotificationTextClass}`}> has updated new Category</span>
                                    <div className="text-blue-500 text-xs font-bold">few seconds ago</div>
                                </div>
                            </MenuItem>
                        </div>
                    ))}
                </div>
            </Menu>
        </>
    );
};

export default Notifications;
