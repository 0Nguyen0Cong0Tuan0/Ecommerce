import React, { useContext } from 'react';
import { motion } from 'framer-motion'; // Import motion

// COMPONENTS
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

const Home = ({ content }) => {  // Destructure props here
    const context = useContext(MyContext);

    const { modeGradientNoDirection } = getThemeStyles(context.themeMode);

    return (
        <>
            <div className="sticky top-0 z-50">
                <Header />
            </div>

            <div className="main flex h-[calc(100vh-84px)]">
                {/* Sidebar Section */}
                {context.isHideSidebarAndHeader === false && (
                    <motion.div
                        className={`sidebarWrapper bg-gradient-to-b ${modeGradientNoDirection} ${context.isToggleSidebar ? '' : 'basis-2/12'
                            }`}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                            width: context.isToggleSidebar ? 0 : 300,
                            opacity: context.isToggleSidebar ? 0 : 1,
                        }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Sidebar />
                    </motion.div>
                )}

                {/* Content Section */}
                <motion.div
                    className={`content overflow-y-auto transition-all duration-0 ${context.isToggleSidebar ? 'basis-full' : 'basis-10/12'
                        }`}
                    initial={{ width: 'calc(100% - 300px)', opacity: 0 }}
                    animate={{
                        width: context.isToggleSidebar ? '100%' : 'calc(100% - 300px)',
                        opacity: 1,
                    }}
                    exit={{ width: 'calc(100% - 300px)', opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Render the passed content */}
                    {content}
                </motion.div>
            </div>
        </>
    );
};

export default Home;
