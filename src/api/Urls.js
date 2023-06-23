const urls = {
    // common
    tts_languages: "tts_languages/", // GET
    countries: "countries/", // GET
    get_file: (uuid) => { return `files/${uuid}/` }, // GET
    documentation: "swagger.json", // GET
    // user
    login: "login/",
    admin_login: "admin_login/",
    update_profile: (id) => { return `users/${id}/`; }, // PUT
    get_profile: (id) => { return `users/${id}/`; }, // GET
    change_password: "change_password/", // PUT
    // 2fa
    tfa_services: "2fa_services/",
    tfa_services_update: (id) => { return `2fa_services/${id}/`; },
    otp_send: "2fa/send/",
    otp_verify: "2fa/verify/",
    tfa_service_reports: "reports/2fa_services/",
    account_reports: "reports/account/",
    //number masking
    number_masking_services: "number_masking_services/",
    number_masking_services_update: (id) => { return `number_masking_services/${id}/`; },
    masking_numbers: "masking_numbers/",
    add_masking_number: "number_masking_services/add_masking_number/",
    number_masking_sessions: "number_masking_sessions/",
    number_masking_participants: "number_masking_participants/",
    // campaign management
    list_campaigns: "campaigns/", // GET
    add_campaign: "campaigns/", // POST
    get_campaign: (id) => { return `campaigns/${id}/`; }, // GET
    update_campaign: (id) => { return `campaigns/${id}/`; }, // PATCH
    delete_campaign: (id) => { return `campaigns/${id}/`; }, // DELETE
    clone_campaign: (id) => { return `campaigns/${id}/clone/`; }, // POST
    // announcement
    list_announcements: "announcements/", // GET
    add_announcement: "announcements/", // POST
    get_announcement: (id) => { return `announcements/${id}/`; }, // GET
    update_announcement: (id) => { return `announcements/${id}/`; }, // POST,
    delete_announcement: (id) => { return `announcements/${id}/`; }, // DELETE,
    // programmable sms
    list_sms: "programmable_sms/", // GET
    send_sms: "programmable_sms/", // POST
    //--------------------------------admin-----------------------------------//
    // organization accounts
    list_organization_accounts: (id) => {return `organizations/admin/${id}/list_accounts/`}, // GET
    get_organization_accounts_report: (id) => {return `organizations/admin/${id}/accounts_report/`}, // GET
    add_organization_account: (id) => {return `organizations/admin/${id}/add_account/`}, // POST
    delete_organization_account: (id) => {return `organizations/admin/${id}/delete_account/`}, // DELETE
    // sms tariffs
    list_sms_tariffs: "/sms_tariffs/admin/", // GET
    get_sms_tariff: (id) => {return `/sms_tariffs/admin/${id}/`}, // GET
    add_sms_tariff: "/sms_tariffs/admin/", // POST
    update_sms_tariff: (id) => {return `/sms_tariffs/admin/${id}/`}, // PUT
    delete_sms_tariff: (id) => {return `/sms_tariffs/admin/${id}/`}, // DELETE
}

export default urls;
