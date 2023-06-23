import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
// ----------------------------------------------------------------------

const TABS = [
    { id: 0, label: "Service", component: "ServiceComponent" },
    { id: 1, label: "Numbers", component: "NumbersComponent" },
];

const TITLE = "Number Masking";

// ----------------------------------------------------------------------

export default function NumberMasking() {
    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
