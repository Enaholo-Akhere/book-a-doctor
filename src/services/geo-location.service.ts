import axios from 'axios'

export const getGeolocationService = async () => {
    const localUrl = import.meta.env.VITE_GEO_LOC_LOC;
    const prodUrl = import.meta.env.VITE_GEO_LOC_PROD;

    const geoURL = import.meta.env.MODE === "production" ? prodUrl : localUrl;

    const { data } = await axios.get(`${geoURL}`);
    return data;

};