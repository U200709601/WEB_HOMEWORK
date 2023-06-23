import api from "src/api/Api";
import urls from "src/api/Urls";


export const listOrganizationAccounts = (id) => {
    return api.get(urls.list_organization_accounts(id));
}

export const getOrganizationAccountsReport = (id) => {
    return api.get(urls.get_organization_accounts_report(id));
}

export const addOrganizationAccount = (id) => {
    return api.post(urls.add_organization_account(id));
}

export const deleteOrganizationAccount = (id) => {
    return api.delete(urls.delete_organization_account(id));
}