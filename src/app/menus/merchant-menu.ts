import { NavItem } from '../models/nav-item';

export const merchantMenu: NavItem[] = [
    {
        "path": '/home',
        "title": 'Home Page',
        "iconName": 'home',
        "hasChildren": false
    },
    {
        "path": '/acnt-mngmt',
        "title": 'ACCOUNT MANAGEMENT',
        "iconName": 'acnt-mngmt',
        "hasChildren": true,
        "childrens": [
            {
                "path": '/acnt-mngmt/add-account',
                "title": 'Add Account',
                "iconName": 'add-account',
                "hasChildren": false
            },
            {
                "path": '/acnt-mngmt/remove-account',
                "title": 'Remove Account',
                "iconName": 'remove-account',
                "hasChildren": false
            },
            {
                "path": '/acnt-mngmt/edit-account',
                "title": 'Edit Account',
                "iconName": 'edit-account',
                "hasChildren": true,
                "childrens": [
                             {
                                "path": '/acnt-mngmt/edit-account/change-record-type',
                                "title": 'Change Record Type',
                                "iconName": 'change-record-type',
                                "hasChildren": false
                             }
                             // {
                             //   "path": '/acnt-mngmt/edit-account/change-mapping/rptId::merchant-data',
                             //   "title": 'Change Mapping',
                             //   "iconName": 'change-mapping',
                             //   "hasChildren": false
                             // } 
                ]
            }
 
         ]
    },
    {
        "path": '/import',
        "title": 'Import',
        "iconName": 'import',
        "hasChildren": false
    },
    {
        "path": '/reruns',
        "title": 'Reruns',
        "iconName": 'reruns',
        "hasChildren": false
    }
];

export const merchantTabs ={
    "home":{
      "tabs":[
     {
          "label":  'MERCHANT DATA',
          "link": '/home/rptId::merchant-data'
      }
    ]
    },
    "acnt-mngmt":{
      "children":{
        "add-account":{
          "tabs":[{
            "label":  'MERCHANT DATA',
            "link": '/acnt-mngmt/add-account/rptId::merchant-data'
          }]
        },
        "remove-account":{
            "tabs":[{
                "label":  'MERCHANT DATA',
                "link": '/acnt-mngmt/remove-account/rptId::merchant-data'
            }]
        }, 
        "edit-account": {
            children: {
                // "change-mapping":{ 
                //     "tabs":[{
                //         "label":  'MERCHANT DATA',
                //         "link": '/acnt-mngmt/edit-account/change-mapping/rptId::merchant-data'
                //     }]
                // },
                "change-record-type":{ 
                    "tabs":[{ 
                        "label":  'MERCHANT DATA', 
                        "link": '/acnt-mngmt/edit-account/change-record-type/rptId::merchant-data' 
                    }]
                }
            }
        }
      }
    },
    "reruns":{
        "tabs":[
        {
            "label":  'MERCHANT DATA',
            "link": '/reruns/rptId::merchant-data'
        }
    ]
      }
    //   "import":{ 
    //     "tabs":[{ 
    //         "label":  'MERCHANT DATA', 
    //         "link": '/import/rptId::merchant-data' 
    //     }] 
    //   }, 
  }; 