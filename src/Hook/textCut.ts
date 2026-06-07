import { useEffect, useState } from "react";

export const useCutTitle = ({ text1, text2 }: { text1: string; text2: string }) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width < 640 ? text1 : text2;
};
