import { NavItem } from '../models/nav-item';

export const adminMenu: NavItem[] = [
    {
        path: '/home',
        title: 'Home Page',
        iconName: 'home',
        hasChildren: false,
        level: 1
    },
    {
        path: '/acnt-mngmt',
        title: 'Account Management',
        iconName: 'acnt-mngmt',
        hasChildren: true,
        childrens: [
            {
                path: '/acnt-mngmt/add-account',
                title: 'Add Account',
                iconName: 'add-account',
                hasChildren: false,
                level: 2
            },
            {
                path: '/acnt-mngmt/remove-account',
                title: 'Remove Account',
                iconName: 'remove-account',
                hasChildren: false,
                level: 2
            },
            {
                path: '/acnt-mngmt/edit-account',
                title: 'Edit Account',
                iconName: 'edit-account',
                hasChildren: true,
                level: 2,
                childrens: [
                    {
                        path: '/acnt-mngmt/edit-account/change-record-type',
                        title: 'Change Record Type',
                        iconName: 'change-record-type',
                        hasChildren: false,
                        level: 3
                    },
                    {
                        path: '/acnt-mngmt/edit-account/change-mapping',
                        title: 'Change Mapping',
                        iconName: 'change-mapping',
                        hasChildren: false,
                        level: 3
                    }
                ]
            }
        ]
    },
    {
        path: '/import',
        title: 'Import',
        iconName: 'import',
        hasChildren: false
    },
    {
        path: '/reruns',
        title: 'Reruns',
        iconName: 'reruns',
        hasChildren: false
    },
    {
        path: '/user-management',
        title: 'User Management',
        iconName: 'user-management',
        hasChildren: false
    }
    // {
    //     path: '/admin',
    //     title: 'Admin',
    //     iconName: 'admin',
    //     hasChildren: true,
    //     childrens: [
    //         {
    //             path: '/admin/config',
    //             title: 'Configuration',
    //             iconName: 'config',
    //             hasChildren: false,
    //             level: 2
    //         },
    //         {
    //             path: '/admin/logs',
    //             title: 'Logs',
    //             iconName: 'logs',
    //             hasChildren: false,
    //             level: 2
    //         },
    //         {
    //             path: '/admin/settings',
    //             title: 'Settings',
    //             iconName: 'setting',
    //             hasChildren: false,
    //             level: 2
    //         }
    //     ]
    // }
];

export const adminTabs = {
    "home": {
        "tabs": [
            {
                "label": 'MERCHANT DATA',
                "link": '/home/rptId::merchant-data'
            },
            {
                "label": 'WEBPALS MOBILE',
                "link": '/home/rptId::webpals-mobile'
            }
        ]
    },
    "acnt-mngmt": {
        "children": {
            "add-account": {
                "tabs": [{
                    "label": 'MERCHANT DATA',
                    "link": '/acnt-mngmt/add-account/rptId::merchant-data'
                }]
            },
            "remove-account": {
                "tabs": [{
                    "label": 'MERCHANT DATA',
                    "link": '/acnt-mngmt/remove-account/rptId::merchant-data'
                }]
            },
            "edit-account": {
                "children": {
                    "change-mapping": {
                        "tabs": [{
                            "label": 'MERCHANT DATA',
                            "link": '/acnt-mngmt/edit-account/change-mapping/rptId::merchant-data'
                        }]
                    },
                    "change-record-type": {
                        "tabs": [{
                            "label": 'MERCHANT DATA',
                            "link": '/acnt-mngmt/edit-account/change-record-type/rptId::merchant-data'
                        }]
                    }
                }
            }
        }
    },
    "reruns": {
        "tabs": [
            {
                "label": 'MERCHANT DATA',
                "link": '/reruns/rptId::merchant-data'
            },
            {
                "label": 'WEBPALS MOBILE',
                "link": '/reruns/rptId::webpals-mobile'
            }]
    },
    "import": {
        "tabs": [{
            "label": 'MERCHANT DATA',
            "link": '/import/rptId::merchant-data'
        }]
    },
    "user-management": {
      "tabs": [{
            "label": 'ALL REPORTS ID',
            "link": '/user-management/rptId::all'
        }]
    }

    //  "admin": {
    //     "children": {
    //         "config": {
    //             "tabs": [{
    //                 "label": 'ALL REPORTS ID',
    //                 "link": '/admin/config'
    //             }]
    //         },
    //         "logs": {
    //             "tabs": [{
    //                 "label": 'ALL REPORTS ID',
    //                 "link": '/admin/logs'
    //             }]
    //         },
    //         "settings": {
    //             "tabs": [{
    //                 "label": 'ALL REPORTS ID',
    //                 "link": '/admin/settings'
    //             }]
    //         }
    //     }
    // }
}; 
