import Button from '@mui/material/Button';
import { useState } from 'react';
import { FaMinus, FaPlus } from "react-icons/fa";

const QuantityBox = () => {
    const [inputValue, setInputValue] = useState(1);

    const minus = () => {
        inputValue > 1 ? setInputValue(inputValue - 1) : setInputValue(1);
    }

    const plus = () => {
        inputValue < 1000 ? setInputValue(inputValue + 1) : setInputValue(1000);
    }

    return(
        <>
            <div className="quantityDrop">
                <Button onClick={minus}><FaMinus/></Button>
                <input type='text' value={inputValue}/>
                <Button onClick={plus}><FaPlus/></Button>
            </div>
        </>
    )
}

export default QuantityBox;