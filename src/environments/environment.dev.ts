// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// AMBIENTE DEV desarrollo
// ng serve --configuration=dev
// ng build --configuration=dev
export const environment = {
  production: true,
  // para mi fiel /////
  APP_ID: '',
  APP_SECRET: '',
  URL_MIFIEL: '',
  // para mi fiel /////
  URL_SERVICIOS: 'https://dev.devfactorgfc.com/api/v1',
 // SECRET_KEY: '71e141d3a016ffd6bd94558a5bb80b15',
  SECRET_KEY: '93302eef21f513a83748e5104874bb7d',
  CLIENTE: 'FACTORGFCGLOBAL',
  firebase: {
    apiKey: 'AIzaSyDYG3emwtZxKZP_hyzL0vv4nOtzs80wDbM',
    authDomain: 'devfactoring.firebaseapp.com',
    databaseURL: 'https://devfactoring.firebaseio.com',
    projectId: 'devfactoring',
    storageBucket: 'devfactoring.appspot.com',
    messagingSenderId: '22228535082',
    appId: '1:22228535082:web:fa11da5b84bbee3b5a0053',
    measurementId: 'G-9H98G93ZF2'
  }

};
