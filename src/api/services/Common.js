import api from "src/api/Api";
import urls from "src/api/Urls";


export const getTTSLanguages = (params) => {
    return api.get(urls.tts_languages, { params: params });
}

export const getCountries = (params) => {
    return api.get(urls.countries, { params: params });
}

export const getFile = (uuid) => {
    return api.get(urls.get_file(uuid), { responseType: 'blob', timeout: 30000 });
}

export const getDocsSpec = () => {
    return api.get(urls.documentation);
}
