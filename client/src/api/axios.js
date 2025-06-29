import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://thrivespace-tieb.onrender.com/api',
    withCredentials: true, //import for cookie-based auth
});

export default instance;