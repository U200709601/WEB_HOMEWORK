import {
    MenuItem,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel,
    RadioGroup,
} from '@mui/material';
import i18n from 'src/i18n';

export const getSelectOptions = (options, emptyText = i18n.t("common.form.any")) => {
    let items = emptyText ? [
        <MenuItem key="empty" value="0">{emptyText}</MenuItem>
    ] : [];
    options.map((data, idx) => {
        items.push(
            <MenuItem key={idx} value={data.value}>{data.label}</MenuItem>
        );
    });
    return items;
};

export const getRadioButtonOptions = (options, disabled = false) => {
    let items = [];
    options.map((data, idx) => {
        items.push(
            <FormControlLabel disabled={disabled} key={`${data.value}-${idx}`} value={data.value} control={<Radio />} label={data.label} />
        );
    });
    return items;
};

export const getRadioButtonComponent = (options, props, title, direction = "row") => {
    const disabled = props.disabled ? true : false;
    return (
        <FormControl sx={{ textAlign: "left" }} component="fieldset">
            <FormLabel disabled={disabled} color="secondary" >{title}</FormLabel>
            <RadioGroup {...props} row={direction === "row" ? true : false}>
                {getRadioButtonOptions(options, disabled)}
            </RadioGroup>
        </FormControl>
    );
};

export const getItemDetails = (options, key = "value") => {
    let items = [];
    options.map((data, idx) => {
        items.push(options[key]);
    });
    return items;
};

export const getValueByLabel = (options, label) => {
    for (const idx in options) {
        if (options[idx].label == label) {
            return options[idx].value;
        }
    }
};

export const getLabelByValue = (options, value) => {
    for (const idx in options) {
        if (options[idx].value == value) {
            return options[idx].label;
        }
    }
};

export const TwoFAServiceTypes = [
    { value: "1", label: i18n.t("common.sms") },
    { value: "2", label: i18n.t("common.voice") },
];

export const TwoFAServiceStatuses = [
    { value: "1", label: i18n.t("common.active") },
    { value: "2", label: i18n.t("common.inactive") },
];

export const TwoFAServiceCodeLengths = [
    { value: "4", label: i18n.t("common.digits", { count: 4 }) },
    { value: "6", label: i18n.t("common.digits", { count: 6 }) },
];

export const ProgrammableSmsStatuses = [
    { value: "1", label: i18n.t("common.sent") },
    { value: "2", label: i18n.t("common.failed") },
    { value: "3", label: i18n.t("common.success") },
];

export const CampaignStatuses = [
    { value: "1", label: i18n.t("common.initiating") },
    { value: "2", label: i18n.t("common.inProgress") },
    { value: "3", label: i18n.t("common.scheduled") },
    { value: "4", label: i18n.t("common.completed") },
    { value: "5", label: i18n.t("common.cancelled") },
    { value: "6", label: i18n.t("common.failed") },
];

export const CampaignSmsEncodings = [
    { value: "1", label: "GMS7" },
    { value: "2", label: "UCS2" },
];

export const CampaignChannelTypes = [
    { value: "1", label: i18n.t("common.sms") },
    { value: "2", label: i18n.t("common.voice") },
];

export const CampaignAnnouncementTypes = [
    { value: "1", label: i18n.t("common.audioFile") },
    { value: "2", label: i18n.t("common.textToSpeech") },
];

export const DefaultPaginationData = {
    page: 0, rowsPerPage: 10, totalCount: 0
};

export const AccountStatuses = [
    { value: "1", label: i18n.t("common.active") },
    { value: "2", label: i18n.t("common.inactive") },
];

export const AccountTypes = [
    { value: "1", label: "Jambonz" },
    { value: "2", label: "Telesmart" },
    { value: "3", label: "Vonage" },
    { value: "4", label: "SMSX" },
];

export const AccountChannelTypes = [
    { value: "1", label: i18n.t("common.sms") },
    { value: "2", label: i18n.t("common.voice") },
];