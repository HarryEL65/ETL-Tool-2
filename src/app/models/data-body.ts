export class DataBody {
    accounts: Array<any>;
    config: {};
    fromDate: string;
    toDate: string;
    reportType: string;
    recordType: string;

    constructor() {
        this.accounts = [];
        this.config = {};
        this.fromDate = '';
        this.toDate = '';
        this.reportType = 'MERCHANT DATA';
        this.recordType = '';
    }

    setRecordType(recordType) {
        this.recordType = recordType;
    }
    
    setFromDate($fromDate) {
        // console.log('/*---------- choose Populattion Comp. --------------*/');
        // // console.log('this is the "Date From" selected ', $fromDate);
        this.fromDate = '01/' + $fromDate.label;
    }

    setToDate($toDate) {
        const dayOfMOnth =  new Date().getDate();
        const currYear = new Date().getFullYear();

        // console.log('/*---------- choose Populattion Comp. --------------*/');
        // console.log('this is the "Date To" selected ', $toDate);
        // if( $toDate.label )
        const selectedMonth = parseInt($toDate.label.split('/')[0], 10);
        // The getMonth() method returns the month (from 0 to 11) for the specified date, according to local time.
        // Note: January is 0, February is 1, and so on.
        const selectedYear = parseInt($toDate.label.split('/')[1], 10);

        const currentMonth = new Date().getMonth() + 1;

        // if the selected month is lower that the current month
        this.toDate = (selectedMonth === currentMonth) && (selectedYear === currYear) ?
        // set to the current date of current month
        (dayOfMOnth  < 10 ? '0' + dayOfMOnth : dayOfMOnth)  + '/' + $toDate.label  :
        // otherwise set to last day of selected month
        this.getLastDayOfMonth($toDate.label) + '/' + $toDate.label;

        // console.log('set to date: ', this.toDate);
    }

    setAccounts(accounts) {
        this.accounts = accounts;
    }

    setConfig(config) {
        this.config = config instanceof Object ?  config : null ;
    }

    private getLastDayOfMonth(date) {
        // Day 0 is the last day in the previous month
        const dateTo = date.split('/');
         return new Date(dateTo[1], dateTo[0], 0).getDate();
    }

}
