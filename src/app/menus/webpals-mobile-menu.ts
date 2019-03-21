import { NavItem } from '../models/nav-item';

export const webpalsMobileMenu: NavItem[] = [
    {
        "path": '/home',
        "title": 'Home Page',
        "iconName": 'home',
        "hasChildren": false
    },
    {
        "path": '/reruns',
        "title": 'Reruns',
        "iconName": 'reruns',
        "hasChildren": false
    }
];

export const webpalsMobileTabs = {
    "home": {
        "tabs": [
            {
                "label":  'WEBPALS MOBILE',
                "link": '/home/rptId::webpals-mobile'
            }
        ]
    },
    "reruns": {
        "tabs": [
            {
                "label":  'WEBPALS MOBILE',
                "link": '/reruns/rptId::webpals-mobile'
            }
        ]
    },
}; 