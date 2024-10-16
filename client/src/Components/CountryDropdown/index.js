import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { MdClose } from 'react-icons/md';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide'
import { MyContext } from '../../App';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
});

const CountryDropdown = () => {
    const [isOpenModel, setisOPenModel] = useState(false);
    const [selectedTab, setselectedTab] = useState(null);
    const [countryList, setcountryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Add search term state

    const context = useContext(MyContext);

    const selectCountry = (countryName) => {
        // Find the index of the selected country in the original context.countryList
        const originalIndex = context.countryList.findIndex(item => item.country === countryName);
        setselectedTab(originalIndex); // Set the selected country index from the original list
        setisOPenModel(false); // Close the modal
    };

    useEffect(() => {
        if (isOpenModel) {
            setcountryList(context.countryList); // Reset the list when the modal opens
            setSearchTerm(""); // Clear the search term when the modal opens
        }
    }, [isOpenModel, context.countryList]); // Make sure to add isOpenModel to the dependency array

    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchTerm(keyword); // Update the search term state

        if (keyword !== "") {
            const list = context.countryList.filter((item) =>
                item.country.toLowerCase().includes(keyword)
            );

            setcountryList(list);
        } else {
            setcountryList(context.countryList);
        }
    };

    return (
        <>
            <Button
                sx={{
                    border: '2px solid #ccc', // Light gray border
                    borderRadius: '8px',       // Rounded corners
                    padding: '4px 16px',       // Padding for better spacing
                    height: '50px',
                    '&:hover': {
                        borderColor: '#888',     // Darker border on hover
                    }
                }}
                onClick={() => setisOPenModel(true)}>
                <div className='flex flex-col items-start'>
                    <span className='label text-xs'>Your Location</span>
                    <span className='name text-sm'>
                        {selectedTab !== null ? context.countryList[selectedTab].country : 'Select your Location'}
                    </span>
                </div>
                <span className='pl-3'><FaAngleDown /></span>
            </Button>

            <Dialog open={isOpenModel} onClose={() => setisOPenModel(false)} TransitionComponent={Transition} className='locationModel'>
                <h4 className="mb-4">Choose your Delivery Location</h4>
                <p className='mb-2'>Enter your address and we will specify the offer for your area</p>

                <Button className='close_' onClick={() => setisOPenModel(false)}><MdClose /></Button>

                <div className='relative w-full h-12 bg-gray-100 rounded-lg border border-gray-300 p-2'>
                    <Button
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '60px',
                            minWidth: '50px',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#2bbef9'
                        }}>
                        <IoIosSearch />
                    </Button>
                    <input
                        type='text'
                        placeholder='Search for your location...'
                        value={searchTerm}
                        onChange={filterList}
                        className='w-full h-8 bg-transparent outline-none text-sm text-black/80 border-0 pl-2 pr-5'
                    />
                </div>

                <ul className='mt-6 mb-0 max-h-[400px] overflow-y-scroll overflow-x-hidden'>
                    {countryList?.length !== 0 && countryList?.map((item, index) => (
                        <li key={index} className="w-full list-none">
                            <Button
                                onClick={() => selectCountry(item.country)}
                                className={`relative w-full capitalize justify-start py-4 px-5 ${selectedTab !== null && context.countryList[selectedTab].country === item.country
                                        ? 'before:content-["✔"] before:text-2xl before:absolute before:right-5'
                                        : 'hover:bg-gray-200 hover:before:content-["❓"] hover:before:text-xl hover:before:absolute hover:before:right-5'
                                    }`}
                            >
                                <p className='text-black'>{item.country}</p>
                            </Button>
                        </li>
                    ))}
                </ul>
            </Dialog>
        </>
    );
};

export default CountryDropdown;
