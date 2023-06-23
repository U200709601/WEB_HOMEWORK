import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { SmsTariff } from './smsTariff';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------


export default function SmsTariffs() {
    const { t } = useTranslation();

    const TABS = [
        { id: 0, label: "Sms Tariffs", component: <SmsTariff /> },
    ];

    const TITLE = "Tariffs";

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
