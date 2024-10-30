import React, { useState, useContext, useEffect } from 'react';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { IoCartSharp } from 'react-icons/io5';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Payment method icons
import { FaCcVisa, FaCcMastercard, FaPaypal, FaGooglePay } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";

// Shipping method icons
import { MdLocalShipping } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { GiCardPickup } from "react-icons/gi";
import { MyContext } from '../../App';
import { postData } from "../../utils/api";


const StyledButton = styled(Button)(({ theme, selected }) => ({
    backgroundColor: selected ? theme.palette.primary.main : 'white',
    color: selected ? 'white' : theme.palette.text.primary,
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
        backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
    },
}));

const muiStyles = {
    marginBottom: '1rem',  // Add any other styles you need here
    "& .MuiInputBase-input": {
        fontFamily: '"New Amsterdam", sans-serif',
    },
    "& .MuiInputLabel-root": {
        fontFamily: '"New Amsterdam", sans-serif',
    }
};

const PaymentShippingPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shippingMethod, setShippingMethod] = useState('');
    const [shippingFee, setShippingFee] = useState(null);
    const [timeEstimate, setTimeEstimate] = useState('');
    const [subtotal, setSubtotal] = useState(0); // New state for subtotal
    const [vat, setVat] = useState(0); // New state for VAT
    const [total, setTotal] = useState(0); // New state for total
    const [isDisablePaymentBtn, setDisablePayBtn] = useState(true);
    const [loading, setLoading] = useState(false); // Loading state
    const context = useContext(MyContext);

    const navigate = useNavigate();

    // Calculate shipping and total whenever both paymentMethod and shippingMethod are selected
    useEffect(() => {
        if (paymentMethod && shippingMethod) {
            calculateShippingAndTotal();
            setDisablePayBtn(false);
        } else {
            setDisablePayBtn(true);
        }
    }, [paymentMethod, shippingMethod]);

    useEffect(() => {
        if (context.clientInfo) {
            localStorage.setItem('clientInfo', JSON.stringify(context.clientInfo));
        }
    }, [context.clientInfo]); // Make sure you're including only `clientInfo` in the dependency array    

    useEffect(() => {
        const savedClientInfo = localStorage.getItem('clientInfo');
        if (savedClientInfo) {
            context.setClientInfo(JSON.parse(savedClientInfo)); 
        }
    }, [context.setClientInfo]); // Include `setClientInfo` as the dependency    

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleShippingChange = (event) => {
        setShippingMethod(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent form from refreshing the page

        const paymentInfo = {
            paymentMethod, shippingMethod, shippingFee, subtotal, vat, total, clientInfo: context.clientInfo, // Assuming client info is stored in context
        };

        let paymentDetails = {};

        if (paymentMethod === 'visa' || paymentMethod === 'mastercard') {
            // Collect card info from the form fields
            const cardNumber = document.querySelector('[name="cardNumber"]').value;
            const expiryDate = document.querySelector('[name="expiryDate"]').value;
            const cvv = document.querySelector('[name="cvv"]').value;

            paymentDetails = { cardNumber, expiryDate, cvv };
        } else if (paymentMethod === 'paypal') {
            // Collect PayPal info
            const paypalEmail = document.querySelector('[name="paypalEmail"]').value;
            paymentDetails = { paypalEmail };
        } else if (paymentMethod === 'bank') {
            // Collect bank account info
            const bankAccountNumber = document.querySelector('[name="bankAccountNumber"]').value;
            paymentDetails = { bankAccountNumber };
        }

        try {
            const orderData = {
                ...paymentInfo,
                paymentDetails,
            };

            // Use postData to send the request
            const result = await postData(`/api/orders/placeOrder`, orderData, false);

            // Log the result of the successful order placement
            console.log('Order placed successfully:', result);
            // You can perform further actions like redirecting the user or updating the UI
            navigate('/thankyou');
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const calculateShippingAndTotal = async () => {
        setLoading(true); // Start loading state

        const info = context.clientInfo;
        try {
            const response = await fetch('http://localhost:5000/api/calculate-shipping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ info, shippingMethod }),
            });

            const textResponse = await response.text();

            if (!response.ok) {
                throw new Error(textResponse || 'Failed to calculate shipping fee');
            }

            const data = JSON.parse(textResponse);
            const { shippingFee, timeEstimate } = data;

            // Update state with shipping details
            setShippingFee(shippingFee);
            setTimeEstimate(timeEstimate);

            // Calculate subtotal, VAT, and total
            const subtotal = context.cartData.reduce((total_temp, item) => {
                const subTotalValue = item.subTotal?.$numberDecimal || item.subTotal || 0;
                return total_temp + Number(subTotalValue);
            }, 0);
            const vat = subtotal * 0.2; // Example: 20% VAT
            const total = subtotal + vat + shippingFee;

            setSubtotal(subtotal);
            setVat(vat);
            setTotal(total);

        } catch (error) {
            console.error('Error calculating shipping fee:', error);
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div className="relative">
            {/* Overlay when loading */}
            {loading && (
                <div className="absolute inset-0 bg-gray-300 opacity-10 z-10 pointer-events-none"></div>
            )}

            {/* Blurred content when loading */}
            <div className={`container mx-auto px-4 py-8 transition-filter duration-300 ${loading ? 'blur-md' : ''}`}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-semibold text-center tracking-wider">Payment and Shipping</h2>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Payment Method Section */}
                        <div className="flex-1 bg-gray-100 px-12 py-8 border border-gray-300 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-2 tracking-wider">Select Payment Method</h2>
                            <FormControl component="fieldset">
                                <FormLabel component="legend"><p>Payment Options</p></FormLabel>
                                {/* Flex container for payment buttons */}
                                <RadioGroup className="pl-2" value={paymentMethod} onChange={handlePaymentChange}>
                                    <div className="flex flex-wrap gap-2">
                                        <FormControlLabel
                                            value="visa"
                                            control={<Radio style={{ display: 'none' }} />} // Hide default radio
                                            label={
                                                <StyledButton fullWidth variant="outlined" selected={paymentMethod === 'visa'} onClick={() => setPaymentMethod('visa')}>
                                                    <FaCcVisa className="mr-2 size-6" /> <span>Visa</span>
                                                </StyledButton>
                                            }
                                        />
                                        <FormControlLabel
                                            value="mastercard"
                                            control={<Radio style={{ display: 'none' }} />}
                                            label={
                                                <StyledButton fullWidth variant="outlined" selected={paymentMethod === 'mastercard'} onClick={() => setPaymentMethod('mastercard')}>
                                                    <FaCcMastercard className="mr-2 size-6" /><span>Mastercard</span>
                                                </StyledButton>
                                            }
                                        />
                                        <FormControlLabel
                                            value="googlePay"
                                            control={<Radio style={{ display: 'none' }} />}
                                            label={
                                                <StyledButton fullWidth variant="outlined" selected={paymentMethod === 'googlePay'} onClick={() => setPaymentMethod('googlePay')} >
                                                    <FaGooglePay className="mr-2 size-6" /><span>Google Pay</span>
                                                </StyledButton>
                                            }
                                        />
                                        <FormControlLabel
                                            value="paypal"
                                            control={<Radio style={{ display: 'none' }} />}
                                            label={
                                                <StyledButton fullWidth variant="outlined" selected={paymentMethod === 'paypal'} onClick={() => setPaymentMethod('paypal')}>
                                                    <FaPaypal className="mr-2 size-6" /><span>PayPal</span>
                                                </StyledButton>
                                            }
                                        />
                                        <FormControlLabel
                                            value="bank"
                                            control={<Radio style={{ display: 'none' }} />}
                                            label={
                                                <StyledButton fullWidth variant="outlined" selected={paymentMethod === 'bank'} onClick={() => setPaymentMethod('bank')}>
                                                    <BsBank2 className="mr-2 size-6" /><span>Bank</span>
                                                </StyledButton>
                                            }
                                        />
                                    </div>
                                </RadioGroup>
                            </FormControl>

                            {/* Conditionally render form fields based on selected payment method */}
                            {/* For Visa/Mastercard */}
                            {paymentMethod === 'visa' || paymentMethod === 'mastercard' ? (
                                <div className="mt-4">
                                    <TextField sx={muiStyles} fullWidth label="Card Number" variant="outlined" required type="text" name="cardNumber" />
                                    <div className="flex space-x-4 mt-2">
                                        <TextField sx={muiStyles} fullWidth label="Expiry Date" variant="outlined" required type="text" placeholder="MM/YY" name="expiryDate" />
                                        <TextField sx={muiStyles} fullWidth label="CVV" variant="outlined" required type="password" name="cvv"/>
                                    </div>
                                </div>
                            ) : paymentMethod === 'paypal' ? (
                                <div className="mt-4">
                                    <TextField
                                        sx={muiStyles}
                                        fullWidth
                                        label="PayPal Email"
                                        variant="outlined"
                                        required
                                        type="email"
                                        name="paypalEmail" // Add name attribute
                                    />
                                </div>
                            ) : paymentMethod === 'bank' ? (
                                <div className="mt-4">
                                    <TextField
                                        sx={muiStyles}
                                        fullWidth
                                        label="Bank Account Number"
                                        variant="outlined"
                                        required
                                        type="text"
                                        name="bankAccountNumber" // Add name attribute
                                    />
                                </div>
                            ) : null}
                        </div>

                        {/* Shipping Method Section */}
                        <div className="flex-1 bg-gray-100 px-12 py-8 border border-gray-300 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-2 tracking-wider">Select Shipping Method</h2>
                            <FormControl component="fieldset">
                                <FormLabel component="legend"><p>Shipping Options</p></FormLabel>
                                <RadioGroup className="pl-2" value={shippingMethod} onChange={handleShippingChange}>
                                    <div className="flex flex-wrap gap-4">
                                        <FormControlLabel
                                            value="standard"
                                            control={<Radio style={{ display: 'none' }} />}
                                            label={
                                                <StyledButton
                                                    fullWidth
                                                    variant="outlined"
                                                    selected={shippingMethod === 'standard'}
                                                    onClick={() => setShippingMethod('standard')}
                                                >
                                                    <MdLocalShipping className="mr-2 size-6" />
                                                    <span>Standard</span>
                                                </StyledButton>
                                            }
                                        />
                                        <FormControlLabel
                                            value="express"
                                            control={<Radio style={{ display: 'none' }} />}
                                            label={
                                                <StyledButton
                                                    fullWidth
                                                    variant="outlined"
                                                    selected={shippingMethod === 'express'}
                                                    onClick={() => setShippingMethod('express')}
                                                >
                                                    <FaShippingFast className="mr-2 size=6" />
                                                    <span>Express</span>
                                                </StyledButton>
                                            }
                                        />
                                        <FormControlLabel
                                            value="pickup"
                                            control={<Radio style={{ display: 'none' }} />}
                                            label={
                                                <StyledButton fullWidth variant="outlined" selected={shippingMethod === 'pickup'} onClick={() => setShippingMethod('pickup')}>
                                                    <GiCardPickup className="mr-2 size-6" />
                                                    <span>Pickup</span>
                                                </StyledButton>
                                            }
                                        />
                                    </div>
                                </RadioGroup>
                            </FormControl>
                        </div>

                    </div>

                    {/* Order Summary Section */}
                    {shippingFee !== null && (
                        <>
                            <div className={`mt-6 bg-gray-50 px-12 py-8 rounded-lg border border-gray-300 shadow-md transition-filter duration-300`}>
                                <h3 className="text-2xl font-semibold mb-2 tracking-wider">Order Summary</h3>
                                <div className="flex justify-between">
                                    <h3 className="text-md">Shipping Fee</h3>
                                    <p>${shippingFee.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <h3 className="text-md">Subtotal</h3>
                                    <p>${subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <h3 className="text-md">VAT (20%)</h3>
                                    <p>${vat.toFixed(2)}</p>
                                </div>

                                <div className="flex justify-between font-bold text-lg mt-4 tracking-wider">
                                    <h3>Total</h3>
                                    <p>${total.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between font-bold text-lg tracking-wider">
                                    <h3>Estimated Delivery Time</h3>
                                    <p>{timeEstimate}</p>
                                </div>
                            </div>
                            {/* Checkout Button */}
                            <div className="mt-6">
                                <Button variant="contained" color="primary" type="submit" fullWidth disabled={isDisablePaymentBtn} startIcon={<IoCartSharp />}>
                                    <p className="text-lg">Proceed to Payment</p>
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PaymentShippingPage;
