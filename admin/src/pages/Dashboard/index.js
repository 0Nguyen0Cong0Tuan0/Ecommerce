// COMPONENTS
import DashboardBox from "./components/dashboardBox";
import GraphBox from './components/graphBox';
import Filter from "../../components/Filter";
import TableDashboard from "../../components/Table/TableDashboard";
import { MyContext } from "../../App";
import { getThemeStyles } from "../../utils/themeConfig";

// ICONS
import { FaUserCircle } from "react-icons/fa";
import { MdShoppingCart, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";


// REACT
import { useContext } from "react";

const showByOptions = [
    { key: "None", value: "" },
    { key: "Ten", value: 10 },
    { key: "Twenty", value: 20 },
    { key: "Thirty", value: 30 },
];

const catByOptions = [
    { key: "None", value: "" },
    { key: "Ten", value: 10 },
    { key: "Twenty", value: 20 },
    { key: "Thirty", value: 30 },
];

const productTableTitle = [
    "UID",
    "PRODUCT",
    "CATEGORY",
    "SUB CATEGORY",
    "BRAND",
    "PRICE",
    "STOCK",
    "RATING",
    "ORDER",
    "SALES",
    "ACTION"
];

const productInfo = [
    {
        uid: "001",
        name: "Smartphone X",
        imageUrl: "https://achaumobile.com/wp-content/uploads/2022/03/iPhone-X-2.jpg.webp",
        category: "Electronics",
        subCategory: "Smartphones",
        brand: "Brand A",
        oldPrice: "799",
        price: "699",
        stock: "120",
        rating: "4.5",
        orders: "350",
        sales: "300"
    },
    // More product data
];


const Dashboard = () => {
    const context = useContext(MyContext);
    const { mainBackgroundClass, modeGradientClass } = getThemeStyles(context.themeMode);

    return (
        <>
            <div className={`flex flex-col items-center ${mainBackgroundClass} p-10`}>

                {/* Main Grid Container */}
                <div className='grid grid-cols-12 grid-rows-10 gap-4 w-full'>

                    {/* Left-side container (spanning 4 rows and 4 columns) */}
                    <div className="row-span-10 col-span-4">
                        <GraphBox bg={'bg-gradient-to-t'} title={'Total Sales'} />
                    </div>

                    {/* Right-side grid (spanning the remaining 10 columns) */}
                    <div className="row-span-10 col-span-8 grid grid-cols-2 gap-4">

                        {/* USER */}
                        <div className="col-span-1 row-span-10">
                            <DashboardBox bg={'bg-gradient-to-tr'} icon={FaUserCircle} grow={true} />
                        </div>

                        {/* SHOPPING CART */}
                        <div className="col-span-1 row-span-10">
                            <DashboardBox bg={'bg-gradient-to-br'} icon={MdShoppingCart} />
                        </div>

                        {/* SHOPPING BAG */}
                        <div className="col-span-1 row-span-10">
                            <DashboardBox bg={'bg-gradient-to-tl'} icon={MdShoppingBag} />
                        </div>

                        {/* SHOPPING */}
                        <div className="col-span-1 row-span-10">
                            <DashboardBox bg={'bg-gradient-to-bl'} icon={GiStarsStack} />
                        </div>

                    </div>

                </div>

                {/* New div for Best Selling Products */}
                <div className={`bg-white mt-8 w-full px-10 py-5 rounded-xl ${modeGradientClass}`}>
                    <h3 className="text-white text-2xl">BEST SELLING PRODUCTS</h3>

                    <div id="Filter">
                        <div className="mt-5 grid grid-cols-4 gap-6">
                            <Filter type="SHOW BY" options={showByOptions}/>

                            <Filter type="CATEGORY BY" options={catByOptions} />
                        </div>
                    </div>

                    {/* Table */}
                    <TableDashboard tableTitles={productTableTitle} productData={productInfo} />

                </div>
            </div>
        </>
    );
}

export default Dashboard;

