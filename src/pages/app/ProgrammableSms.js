import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { SendSms, ViewSms } from '../programmableSMS';
import Documentation from 'src/components/Documentation';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------


export default function ProgrammableSms() {
    const { t } = useTranslation();

    const TABS = [
        { id: 0, label: t("common.programmableSms.sendSms"), component: <SendSms /> },
        { id: 1, label: t("common.programmableSms.viewSms"), component: <ViewSms /> },
        { id: 2, label: "SMS API", component: <Documentation onlySms={true} /> },
    ];

    const TITLE = t("common.programmableSms.title");

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
