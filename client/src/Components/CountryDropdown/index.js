import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { MyContext } from '../../App';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

const CountryDropdown = () => {
    const [isOpenModel, setisOPenModel] = useState(false);
    const [selectedTab, setselectedTab] = useState(null);
    const [countryList, setcountryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const context = useContext(MyContext);

    const selectCountry = (countryName) => {
        const originalIndex = context.countryList.findIndex(item => item.country === countryName);
        setselectedTab(originalIndex);
        setisOPenModel(false);
    };

    useEffect(() => {
        if (isOpenModel) {
            setcountryList(context.countryList);
            setSearchTerm("");
        }
    }, [isOpenModel, context.countryList]);

    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchTerm(keyword);

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
                    border: '2px solid #ccc',
                    borderRadius: '8px',
                    padding: '4px 16px',
                    height: '50px',
                    '&:hover': {
                        borderColor: '#888',
                    },
                }}
                onClick={() => setisOPenModel(true)}
            >
                <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500">Your Location</span>
                    <span className="text-sm text-black">
                        {selectedTab !== null ? context.countryList[selectedTab].country : 'Select your Location'}
                    </span>
                </div>
                <span className="pl-3"><FaAngleDown /></span>
            </Button>

            <Dialog
                open={isOpenModel}
                onClose={() => setisOPenModel(false)}
                TransitionComponent={Transition}
                className="locationModel"
            >
                <div className="p-6">
                    <div className='relative'>
                        <h4 className="mb-4 text-lg font-semibold text-black">Choose your Delivery Location</h4>
                    </div>
                    <Button
                        sx={{
                            position: 'absolute',
                            top: '15px',
                            right: '0px',
                            width: '60px',
                            minWidth: '50px',
                            color: '#2bbef9',
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setisOPenModel(false)}
                    >
                        <MdClose size={24} />
                    </Button>

                    <p className="mb-2 text-gray-500">Enter your address and we will specify the offer for your area</p>



                    <div className="relative w-full h-12 bg-gray-100 rounded-lg border border-gray-300 px-4">
                        <input
                            type="text"
                            placeholder="Search for your location..."
                            value={searchTerm}
                            onChange={filterList}
                            className="w-full h-full bg-transparent outline-none text-sm text-black/80 pr-12"
                        />
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
                                color: '#2bbef9',
                            }}
                        >
                            <IoIosSearch />
                        </Button>
                    </div>

                    <ul className="mt-6 mb-0 max-h-[400px] overflow-y-scroll overflow-x-hidden divide-y divide-gray-200">
                        {countryList?.length !== 0 &&
                            countryList.map((item, index) => (
                                <li key={index} className="w-full list-none">
                                    <Button
                                        onClick={() => selectCountry(item.country)}
                                        className={`relative w-full text-left capitalize justify-start py-4 px-5 text-sm font-medium ${selectedTab !== null && context.countryList[selectedTab].country === item.country
                                            ? 'bg-gray-200 before:content-["✔"] before:text-2xl before:absolute before:right-5'
                                            : 'hover:bg-gray-50 hover:before:content-["❓"] hover:before:text-xl hover:before:absolute hover:before:right-5'
                                            }`}
                                    >
                                        <p>{item.country}</p>
                                    </Button>
                                </li>
                            ))}
                    </ul>
                </div>
            </Dialog>
        </>
    );
};

export default CountryDropdown;
