import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { Cdr, Sdr } from '../logViewer';
// ----------------------------------------------------------------------

const TABS = [
    { id: 0, label: "Voice CDR", component: <Cdr cdrType="voice" /> },
    { id: 1, label: "SMS CDR", component: <Cdr cdrType="sms" /> },
    { id: 2, label: "Programmable SMS Logs", component: <Sdr sdrType="programmablesms" /> },
    { id: 3, label: "2FA Logs", component: <Sdr sdrType="twofa" /> },
    { id: 4, label: "Campaign Logs", component: <Sdr sdrType="campaign" /> },
];

const TITLE = "Log Viewer";

// ----------------------------------------------------------------------

export default function LogViewer() {
    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
