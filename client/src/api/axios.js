import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, //import for cookie-based auth
});

export default instance;