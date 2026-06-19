import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";


export const useAmount = (ticketPrice: number) => {
    const geolocation = useAuthStore((state) => state.geolocation);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(1)
    useEffect(() => {
        setIsLoading(true);
        if (geolocation) {
            const tPrice = ticketPrice * geolocation.exchangeRate;
            setPrice(tPrice);
        }

        setIsLoading(false);
    }, [ticketPrice, geolocation]);

    return { price, isLoading };
}