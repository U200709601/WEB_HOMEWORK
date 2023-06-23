import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { Campaign, Announcement, Report } from './campaignManagement/';
// ----------------------------------------------------------------------

const TABS = [
    { id: 0, label: "Campaign", component: <Campaign /> },
    { id: 1, label: "Announcement", component: <Announcement /> },
    { id: 2, label: "Report", component: <Report /> },
    { id: 3, label: "Log", component: "LogComponent" },
];

const TITLE = "Campaign Management";

// ----------------------------------------------------------------------

export default function CampaignManagement() {
    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
