// ICONS
import { MdShoppingCart, MdEmail } from 'react-icons/md';

// COMPONENTS
import Notifications from './Notifications';
import { getThemeStyles } from '../../utils/themeConfig';
import { MyContext } from '../../App';

// MATERIAL UI
import Button from '@mui/material/Button';

// REACT
// import { useState } from 'react';
import { useContext } from 'react';

const Action = () => {
    const context = useContext(MyContext);

    const { iconClass, iconModeClass } = getThemeStyles(context.themeMode);

    return (
        <>
            <Button
                className='hover:bg-transparent'
                onClick={() => context.setThemeMode(!context.themeMode)}
            >
                {
                    iconModeClass
                }

            </Button>

            <Button className='hover:bg-transparent'>
                <MdShoppingCart className={`${iconClass}`} size={30} />
            </Button>

            <Button className='hover:bg-transparent'>
                <MdEmail className={`${iconClass}`} size={30} />
            </Button>

            <Notifications />


        </>
    )
}

export default Action;