import api from "src/api/Api";
import urls from "src/api/Urls";


export const listCampaigns = (params) => {
    return api.get(urls.list_campaigns, { params: params });
}

export const addCampaign = (payload) => {
    return api.post(urls.add_campaign, payload);
}

export const deleteCampaign = (id) => {
    return api.delete(urls.delete_campaign(id));
}

export const updateCampaign = (id, payload) => {
    return api.patch(urls.update_campaign(id), payload);
}

export const cloneCampaign = (id, payload) => {
    return api.post(urls.clone_campaign(id), payload);
}

export const getCampaign = (id) => {
    return api.get(urls.get_campaign(id));
}

export const listAnnouncements = (params) => {
    return api.get(urls.list_announcements, { params: params });
}

export const addAnnouncement = (payload) => {
    return api.post(urls.add_announcement, payload);
}

export const deleteAnnouncement = (id) => {
    return api.delete(urls.delete_announcement(id));
}

export const updateAnnouncement = (id, payload) => {
    return api.patch(urls.update_announcement(id), payload);
}

export const getAnnouncement = (id) => {
    return api.get(urls.get_announcement(id));
}
