// ICONS
import { IoIosSearch } from "react-icons/io";

// COMPONENTS
import Button from '@mui/material/Button';
import { MyContext } from "../../App";

// REACT
import { useContext } from "react";

// THEME MODE
import { getThemeStyles } from '../../utils/themeConfig';


const Searchbox = () => {
    const context = useContext(MyContext);

    const { modeGradientClass } = getThemeStyles(context.themeMode)

    return (
        <>
            <div className={`searchbox bottom-1 relative w-96 h-12 rounded-3xl bg-gradient-to-r ${modeGradientClass}`}>
                <input type="text" placeholder="Search ..." className="absolute text-white font-bold text-2xl bg-transparent top-2 left-7 w-72" />

                <Button className="absolute top-0 left-80">
                    <IoIosSearch size={36} className="text-white" />
                </Button>
            </div>

        </>
    )
}

export default Searchbox;