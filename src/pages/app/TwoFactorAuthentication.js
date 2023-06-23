import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { Report, Service, Test } from '../twoFactorAuthentication';
// ----------------------------------------------------------------------

const TABS = [
    { id: 0, label: "Service", component: <Service /> },
    { id: 1, label: "Report", component: <Report /> },
    { id: 2, label: "Test", component: <Test /> },
];

const TITLE = "Two-Factor Authentication";

// ----------------------------------------------------------------------

export default function TwoFactorAuthentication() {
    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
