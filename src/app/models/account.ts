export interface Account {
     accountName:  string;
     accountSapId: number;
     accountCat:   string;
     isFeed:       string;
     status: {
        result:    string;
        data:      string;
        otherData: string;
     };
}

export interface Status {
    type: number;
    title: string;
    icon: string;
    class: string;
}

// ‘Date’, ‘Platform’, Affiliate Program’, ‘Account’, ‘Made by’,
// ‘Status (only failed/success, with the icon the same as in 'add account table),
// 'Rerun from date', 'Rerun to date'
export interface LastRerunsMade {
    date:           string;
    platform:       string;
    affiliate:      string;
    account:        string;
    madeBy:         string;
    status:         string;
    rerunFromDate:  string;
    rerunToDate:    string;
}

// ‘Date’, ‘Platform’, Affiliate Program’, ‘Account’, ‘Made by’, 
// ‘Status (failed, success) with the icon the same as in 'add account table,
// 'Show Config'
export interface LastAccountsRemoved {
    date:           string;
    platform:       string;
    affiliate:      string;
    account:        string;
    madeBy:         string;
    status:         string;
    config:         string;
}



