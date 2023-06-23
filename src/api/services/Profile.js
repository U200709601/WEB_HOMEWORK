import api from "src/api/Api";
import urls from "src/api/Urls";


export const login = (payload) => {
    return api.post(urls.login, payload);
}

export const adminLogin = (payload) => {
    return api.post(urls.admin_login, payload);
}

export const getProfile = (id) => {
    return api.get(urls.get_profile(id));
}

export const updateProfile = (id, payload) => {
    return api.put(urls.update_profile(id), payload);
}

export const changePassword = (payload) => {
    return api.put(urls.change_password, payload);
}
