import axios from "axios";


const instance = axios.create({
    headers: {
        "Content-Type": "application/json",
    }
});

instance.interceptors.response.use((response) => {
    return Promise.resolve(response);
}, error => {
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location = "/";
    }
    return Promise.reject(error);
});

instance.interceptors.request.use((request) => {
    if (!("Authorization" in request.headers.common) && localStorage.getItem("token")) {
        request.headers.common["Authorization"] = `Token ${localStorage.getItem("token")}`;
    }
    return request;
}, error => {
    return Promise.reject(error);
});

export default instance;
