// MATERIAL UI
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';

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

const User = (props) => {
    const [anchorEl, setAnchorEl] = useState(false);

    const context = useContext(MyContext);
    const { logout } = useAuthStore();
    const { modeGradientTextClass, textColorClass } = getThemeStyles(context.themeMode);

    const handleOpenAccDropDownBox = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAccDropDownBox = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        setAnchorEl(null);
        await logout();
    }


    return (
        <>
            {/* User Image and Info */}
            <div className='flex flex-row'>
                <IconButton
                    onClick={handleOpenAccDropDownBox}
                    className='hover:bg-transparent'
                    style={{ borderRadius: '0px' }}
                >
                    <Avatar
                        src='https://external-preview.redd.it/gzR5Doqv9u5LMpkMkbC6zUXvmI81XLYYZxNe63N-M4o.jpg?width=640&crop=smart&auto=webp&s=2542193506e91aa13bf104d9142a3eae651b6f59'
                        className='w-10 h-10'
                    />

                    <div className='ml-3 text-right' id='User Information'>
                        <h4 className={`text-sm font-bold ${modeGradientTextClass}`}>{props.user.name}</h4>
                        <p className={`text-lg ${textColorClass}`}>{props.user.email.substr(0, 5) + '...' + props.user.email.substr(18)}</p>
                    </div>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={anchorEl}
                    onClose={handleCloseAccDropDownBox}
                    onClick={handleCloseAccDropDownBox}
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
                    <MenuItem onClick={handleCloseAccDropDownBox}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </>
    )
}

export default User;