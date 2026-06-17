import { api } from '@/library/api/axios';

export const getGeolocationService = async () => {

    const { data } = await api.get('/auth/geolocation');
    return data;

};