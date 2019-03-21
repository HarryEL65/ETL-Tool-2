// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  beURL: 'http://localhost:8080',
  eventBusURL: 'http://localhost:8080/eventbus/',
  production: false,
  CAMPAIGNS: 'CAMPAIGNS',
  ACCOUNTS: 'ACCOUNTS',
  BRANDS: 'BRANDS',
  CAMPAIGNS_CHANGES: 'CAMPAIGNS_CHANGES',
  WEBPALS_MOBILE: {
      accID: 9,
      reportType: 'ExternalData'
  }
};
