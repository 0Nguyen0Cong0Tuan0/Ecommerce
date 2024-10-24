import React, { useContext } from 'react';
import { MyContext } from '../../App';

import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DialogAddToCart = ({ product }) => {
    const context = useContext(MyContext);
    const navigate = useNavigate();


    const navigateToCart = () => {
        context.setIsOpenDialogCart(false);
        navigate(`/cart`)

    }

    const closeDialogToCart = () => {
        context.setIsOpenDialogCart(false);
    }

    return (
        <Dialog
            open={context.isOpenDialogCart}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="flex items-center justify-center"
        >
            <div className="bg-white shadow-xl rounded-lg max-w-lg w-full p-6">
                <DialogTitle id="alert-dialog-title" className="text-xl font-bold text-gray-800">
                    <p>Added to your cart!</p>
                </DialogTitle>
                <DialogContent className="space-y-4">
                    <DialogContentText id="alert-dialog-description" className="text-gray-700">
                        <div className="flex items-center space-x-4">
                            {/* Product Image */}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />

                            <div>
                                <h2 className="font-semibold text-lg text-gray-800">{product.productTitle}</h2>
                                <div>
                                    <p className="text-gray-600">ID: {product.productId}</p>
                                    <span className="text-gray-600 mr-4">Price: ${product.price}</span>
                                    <span className="text-gray-600">Quantity: {product.quantity}</span>
                                </div>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="pt-4">
                    <Button
                        sx={{
                            background: '#4123ab',
                            borderRadius: '5px',
                        }}
                        onClick={closeDialogToCart}
                        className="hover:bg-red-600"
                    >
                        <p className='text-white'>Continue Shopping</p>
                    </Button>

                    <Button
                        sx={{
                            background: '#4123ab',
                            borderRadius: '5px',
                        }}
                        onClick={navigateToCart}
                        className="hover:bg-red-600"
                    >
                        <p className='text-white'>View My Cart ( {context.numberProduct} )</p>
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default DialogAddToCart;
