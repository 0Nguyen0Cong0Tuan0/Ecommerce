import newsLetterImg from '../../assets/coupon/coupon.png';
import { IoMailOutline } from "react-icons/io5";
import Button from '@mui/material/Button';

const NewsLetter = () => {
    return (
        <section className="w-full max-h-[400px] bg-gradient-to-r from-[#020024] via-[#080769] to-[#00d4ff] my-[100px] mb-[50px] overflow-hidden">
                <div className="flex flex-row px-20">
                    <div className="flex flex-col justify-center items-start w-7/12">
                        <p className="text-white text-lg mb-0">$20 discount for your first order</p>
                        <h2 className="text-white text-2xl mb-5">Join our newsletter and get some coupons</h2>
                        <p className="text-light">Join our email subscription now to get updates on promotions and coupons</p>
                        <form className="flex items-center w-[70%] h-[50px] bg-white rounded-lg mt-4 relative">
                            <IoMailOutline className="absolute left-5 text-[30px] opacity-60" />
                            <input 
                                type='email' 
                                placeholder="Your Email" 
                                className="w-full h-[40px] bg-white outline-none border-0 pl-[60px] pr-[30px] text-[20px]"
                            />
                            <Button 
                                sx={{
                                    background: '#3b33ac',
                                    fontFamily: '"New Amsterdam", sans-serif',
                                    fontSize: '18px',
                                    borderRadius: '0px 4px 4px 0px'
                                }}
                                className="text-white w-[30%] h-[50px]"
                            >
                                Subscribe
                            </Button>
                        </form>
                    </div>

                    <div className="flex flex-col justify-center items-center w-5/12">
                        <img src={newsLetterImg} alt='News Letter' className="size-96" />
                    </div>
                </div>
        </section>
    )
}

export default NewsLetter;
