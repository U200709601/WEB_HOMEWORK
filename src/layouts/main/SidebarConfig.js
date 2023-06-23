import { Icon } from '@iconify/react';
import hashOutline from '@iconify/icons-eva/hash-outline';
import lockOutline from '@iconify/icons-eva/lock-outline';
import personOutline from '@iconify/icons-eva/person-outline';
import messageOutline from '@iconify/icons-eva/message-square-outline';
import layersOutline from '@iconify/icons-eva/layers-outline';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Programmable SMS',
    path: '/programmable-sms',
    icon: getIcon(messageOutline),
    adminOnly: false,
    addDividerAfter: false,
  },
  {
    title: 'Two-Factor Authentication',
    path: '/two-factor-authentication',
    icon: getIcon(lockOutline),
    adminOnly: false,
    addDividerAfter: false,
  },
  {
    title: 'Campaign Management',
    path: '/campaign-management',
    icon: getIcon(personOutline),
    adminOnly: false,
    addDividerAfter: false,
  },
  {
    title: 'Number Masking',
    path: '/number-masking',
    icon: getIcon(hashOutline),
    adminOnly: false,
    addDividerAfter: true,
  },
  {
    title: 'Log Viewer',
    path: '/log-viewer',
    icon: getIcon(layersOutline),
    adminOnly: false,
    addDividerAfter: false,
  },
];

export default sidebarConfig;
