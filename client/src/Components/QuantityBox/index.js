import Button from '@mui/material/Button';
import { useEffect, useState, useRef } from 'react';
import { FaMinus, FaPlus } from "react-icons/fa";

const QuantityBox = (props) => {
    const [inputValue, setInputValue] = useState(props.initialQuantity || 1);
    const isFirstRender = useRef(true);  // Track if it's the first render

    const minus = () => {
        setInputValue((prevValue) => Math.max(prevValue - 1, 1));
    };

    const plus = () => {
        setInputValue((prevValue) => Math.min(prevValue + 1, 1000));
    };

    const handleInputChange = (e) => {
        const value = Math.max(1, Math.min(1000, Number(e.target.value)));
        setInputValue(value);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Skip the first render
        } else {
            if (props.quantity) {
                props.quantity(inputValue);
            }
            if (props.selectedItem) {
                // Pass the whole product item
                props.selectedItem({
                    ...props.item,
                    quantity: inputValue // Ensure the new quantity is passed to the selectedItem
                });
            }
        }
    }, [inputValue]);

    return (
        <div className="quantityDrop">
            <Button onClick={minus}><FaMinus /></Button>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <Button onClick={plus}><FaPlus /></Button>
        </div>
    );
};

export default QuantityBox;
