import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import {useTranslation} from 'react-i18next';
import { Account, Report } from './accounts/';
// ----------------------------------------------------------------------

const TABS = [
    {id: 0, label: "All Engines", component: <Account />},
    {id: 1, label: "Cpaas Engines", component: <Account />},
    {id: 2, label: "Report", component: <Report />},
];


export default function Accounts() {
    const {t} = useTranslation();

    const TITLE = t("common.engines.title");

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE}/>
    );
}
