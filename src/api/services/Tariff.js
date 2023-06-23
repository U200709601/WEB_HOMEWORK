import api from "src/api/Api";
import urls from "src/api/Urls";


export const addSmsTariff = (payload) => {
    return api.post(urls.add_sms_tariff, payload);
}

export const listSmsTariffs = (params) => {
    return api.get(urls.list_sms_tariffs, { params: params });
}

export const deleteSmsTariff = (id) => {
    return api.delete(urls.delete_sms_tariff(id));
}

export const updateSmsTariff = (id, payload) => {
    return api.put(urls.update_sms_tariff(id), payload);
}
