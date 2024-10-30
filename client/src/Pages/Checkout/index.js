import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { IoCartSharp } from 'react-icons/io5';
import useAuthStore from '../../store/authStore';

// Define the muiStyles and selectStyles
const muiStyles = {
    marginBottom: '1rem',  // Add any other styles you need here
    "& .MuiInputBase-input": {
        fontFamily: '"New Amsterdam", sans-serif',
    },
    "& .MuiInputLabel-root": {
        fontFamily: '"New Amsterdam", sans-serif',
    }
};

const selectStyles = {
    minWidth: '200px',     // Example style for the select element
    fontFamily: '"New Amsterdam", sans-serif',
};

const menuItemStyles = {
    fontFamily: '"New Amsterdam", sans-serif',
};

const Checkout = () => {
    const { client } = useAuthStore();
    const [country, setCountry] = useState('');
    const context = useContext(MyContext);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [formFields, setFormFields] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: {
            house: '',
            apartment: '',
            town_city: '',
            country: '',
            postcode_zip: '',
        },
        orderNotes: '',
        clientId: client._id,
    });

    const navigate = useNavigate();

    const total = useMemo(() => {
        return context.cartData.reduce((total_temp, item) => {
            const subTotalValue = item.subTotal?.$numberDecimal || item.subTotal || 0;
            return total_temp + Number(subTotalValue);
        }, 0);
    }, [context.cartData]);
    

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormFields((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { id, value } = e.target;
        setFormFields((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [id]: value,
            },
        }));
    };

    const handleChangeCountry = (event) => {
        const selectedCountry = event.target.value;
        setCountry(selectedCountry);
        setFormFields((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                country: selectedCountry,
            },
        }));
    };

    const handleTermsChange = () => {
        setTermsAgreed(!termsAgreed);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!termsAgreed) {
            alert('Please agree to the Terms and Conditions');
            return;
        }

        // Submit form logic goes here
        console.log('Form submitted:', formFields);
        context.setPaymentProcess(true);
        context.setClientInfo(formFields);

        // Navigate to payment page after setting the context
        navigate('/payment');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-semibold text-center">Checkout</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Billing Details Section */}
                    <div className="flex-1 bg-gray-100 px-12 py-8 border border-gray-300 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-2">Billing Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name Field */}
                            <TextField
                                sx={muiStyles}
                                id="firstName"
                                label="First Name"
                                fullWidth
                                required
                                value={formFields.firstName}
                                onChange={handleInputChange}
                            />

                            {/* Last Name Field */}
                            <TextField
                                sx={muiStyles}
                                id="lastName"
                                label="Last Name"
                                fullWidth
                                required
                                value={formFields.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Phone Field */}
                            <TextField
                                sx={muiStyles}
                                id="phone"
                                label="Phone"
                                fullWidth
                                required
                                value={formFields.phone}
                                onChange={handleInputChange}
                            />

                            {/* Email Field */}
                            <TextField
                                sx={muiStyles}
                                id="email"
                                label="Email"
                                fullWidth
                                required
                                value={formFields.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Address Fields */}
                        <h2 className="text-lg font-semibold mt-8 mb-2">Address</h2>
                        <TextField
                            sx={muiStyles}
                            id="house"
                            label="House Number and Street Name"
                            fullWidth
                            required
                            value={formFields.address.house}
                            onChange={handleAddressChange}
                            className="mb-4"
                        />
                        <TextField
                            sx={muiStyles}
                            id="apartment"
                            label="Apartment, Suite, Unit (optional)"
                            fullWidth
                            value={formFields.address.apartment}
                            onChange={handleAddressChange}
                            className="mb-4"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField
                                sx={muiStyles}
                                id="town_city"
                                label="Town/City"
                                fullWidth
                                required
                                value={formFields.address.town_city}
                                onChange={handleAddressChange}
                                className="mt-2"
                            />

                            <FormControl fullWidth className="mt-2">
                                <Select
                                    value={country}
                                    onChange={handleChangeCountry}
                                    displayEmpty
                                    required
                                    sx={selectStyles}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                                width: 200,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled sx={menuItemStyles}>
                                        Select a Country
                                    </MenuItem>
                                    {context.countryList.map((countryItem, index) => (
                                        <MenuItem key={countryItem.iso3} value={countryItem.country} sx={menuItemStyles}>
                                            {countryItem.country}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <TextField
                            sx={muiStyles}
                            id="postcode_zip"
                            label="Postcode/ZIP"
                            fullWidth
                            required
                            value={formFields.address.postcode_zip}
                            onChange={handleAddressChange}
                            className="my-3"
                        />

                        {/* Order Notes */}
                        <TextField
                            sx={muiStyles}
                            id="orderNotes"
                            label="Order Notes (optional)"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={formFields.orderNotes}
                            onChange={handleInputChange}
                            className="my-3"
                        />

                        {/* Terms and Conditions */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={termsAgreed}
                                onChange={handleTermsChange}
                                className="mr-2"
                            />
                            <label htmlFor="terms" className="text-sm mt-2">
                                I agree to the Terms and Conditions
                            </label>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="w-full md:w-1/3 bg-gray-100 p-4 border border-gray-300 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-2">Your Order</h2>

                        {/* Scrollable container for the table */}
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-200" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold">Product</th>
                                        <th className="pl-56 py-2 text-left font-semibold">SubTotal</th>
                                    </tr>
                                </thead>
                            </table>

                            <div className="overflow-y-auto" style={{ maxHeight: context.cartData.length > 8 ? '600px' : 'auto' }}>
                                <table className="min-w-full divide-y divide-gray-300">
                                    <tbody className="bg-white divide-y divide-gray-300">
                                        {context.cartData.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="px-4 py-2">
                                                    {item.productTitle} <strong className="text-gray-400">x{item.quantity}</strong>
                                                </td>
                                                <td className="px-4 py-2">${item.subTotal.$numberDecimal || item.subTotal || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        <div className="mt-4 text-right">
                            <h2 className="text-xl font-semibold">Total: ${total.toFixed(2)}</h2>
                        </div>

                        {/* Checkout Button */}
                        <div className="mt-6">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={!termsAgreed}
                                startIcon={<IoCartSharp />}
                            >
                                <p className="text-lg">Checkout</p>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;