import api from "src/api/Api";
import urls from "src/api/Urls";


export const listTwoFAServices = (params) => {
    return api.get(urls.tfa_services, { params: params });
}

export const addTwoFAService = (payload) => {
    return api.post(urls.tfa_services, payload);
}

export const deleteTwoFAService = (id) => {
    return api.delete(urls.tfa_services_update(id));
}

export const updateTwoFAService = (id, payload) => {
    return api.put(urls.tfa_services_update(id), payload);
}

export const getTwoFAReport = (params) => {
    return api.get(urls.account_reports, { params: params });
}

export const sendOTPMessage = (payload) => {
    return api.post(urls.otp_send, payload);
}

export const verifyOTPMessage = (payload) => {
    return api.post(urls.otp_verify, payload);
}
