// COMPONENTS
import FloatingShape from '../FloatingShape';
import { MyContext } from '../../App';
import { getThemeStyles } from '../../utils/themeConfig';

// REACT
import { useContext } from 'react';


const Background = () => {
    const context = useContext(MyContext);

    const { modeGradientNoDirection } = getThemeStyles(context.themeMode)

    return (
        <div className={`w-full min-h-screen bg-gradient-to-br ${modeGradientNoDirection} flex items-center justify-center relative overflow-hidden`}>
            <FloatingShape
                color="bg-black"
                size="w-64 h-64"
                top="-5%"
                left="10%"
                delay={0}
            />

            <FloatingShape
                color="bg-white"
                size="w-48 h-48"
                top="70%"
                left="80%"
                delay={5}
            />

            <FloatingShape
                color="bg-black"
                size="w-32 h-32"
                top="40%"
                left="-10%"
                delay={2}
            />
        </div>
    );
}

export default Background;