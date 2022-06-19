import axios from "axios";
import Nprogress from "nprogress";

axios.interceptors.request.use(
    config => {
        Nprogress.start();
        return config;
    },
    error => {
        Nprogress.done();
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        Nprogress.done();
        return response;
    },
    error => {
        Nprogress.done();
        return Promise.reject(error);
    }
);