import Button from '@mui/material/Button';
import { IoSearch } from 'react-icons/io5';

const SearchBox = () => {
    return (
        <div className='w-[50%] h-[50px] bg-[#f3f4f7] rounded-lg border border-gray-200 relative flex flex-row justify-round'>
            <input 
                type='text' 
                placeholder='Search for products ...' 
                className='w-full text-[14px] text-black/80 outline-none bg-transparent px-5'
            />
            <Button className='absolute top-0 right-0 z-10 w-[60px] h-[50px] flex justify-center items-center text-[#2bbef9]'>
                <IoSearch/>
            </Button>
        </div>
    )
}

export default SearchBox;