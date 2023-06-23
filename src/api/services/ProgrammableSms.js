import api from "src/api/Api";
import urls from "src/api/Urls";


export const sendSms = (payload) => {
    return api.post(urls.send_sms, payload);
}

export const listSms = (params) => {
    return api.get(urls.list_sms, { params: params });
}
