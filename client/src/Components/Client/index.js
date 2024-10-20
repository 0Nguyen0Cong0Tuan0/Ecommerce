// MATERIAL UI
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';

// SWITCH
import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

// ICONS
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

// REACT
import { useState, useContext } from 'react';

// COMPONENTS
import { MyContext } from '../../App';
import useAuthStore from '../../store/authStore';
import { getThemeStyles } from '../../utils/themeConfig';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: '100%',
    height: 34,
    padding: 9,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(105px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#aab4be',
                ...theme.applyStyles('dark', {
                    backgroundColor: '#8796A5',
                }),
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
        ...theme.applyStyles('dark', {
            backgroundColor: '#003892',
        }),
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        borderRadius: 20 / 2,
        ...theme.applyStyles('dark', {
            backgroundColor: '#8796A5',
        }),
    },
}));


const Client = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const context = useContext(MyContext);
    const { logout } = useAuthStore();
    const { modeGradientTextClass } = getThemeStyles(context.themeMode);

    const handleOpenAccDropDownBox = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAccDropDownBox = () => {
        setAnchorEl(null);
    };

    const handleChangeTheme = (event) => {
        // prevent menu from closing when interacting with the switch
        event.stopPropagation();
        // Add your theme change logic here, if any
    };

    const handleLogout = async () => {
        setAnchorEl(null);
        await logout();
    };

    return (
        <>
            {/* User Image and Info */}
            <div className="flex flex-row">
                <IconButton
                    onClick={handleOpenAccDropDownBox}
                    className="hover:bg-transparent"
                    style={{ borderRadius: "0px" }}
                >
                    <Avatar
                        src="https://external-preview.redd.it/gzR5Doqv9u5LMpkMkbC6zUXvmI81XLYYZxNe63N-M4o.jpg?width=640&crop=smart&auto=webp&s=2542193506e91aa13bf104d9142a3eae651b6f59"
                        className="w-10 h-10"
                    />
                    <div className="ml-3 text-right" id="User Information">
                        <h4 className={`text-sm font-bold ${modeGradientTextClass}`}>
                            {props.client.name}
                        </h4>
                        <p className="text-lg">
                            {props.client.email.substr(0, 5) + '...' + props.client.email.substr(18)}
                        </p>
                    </div>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={Boolean(anchorEl)}
                    onClose={handleCloseAccDropDownBox}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
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
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleCloseAccDropDownBox}>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        My account
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>

                    <div className='m-1'>
                        <MaterialUISwitch onClick={handleChangeTheme} />
                    </div>
                </Menu>
            </div>
        </>
    );
};

export default Client;