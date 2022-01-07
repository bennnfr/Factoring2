// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// AMBIENTE PRODUCCION MIZRAFIN
// ng serve --configuration=dev
// ng build --configuration=dev
export const environment = {
  production: true,
  // para mi fiel /////
  APP_ID: '',
  APP_SECRET: '',
  URL_MIFIEL: '',
  // para mi fiel /////
  URL_SERVICIOS: 'https://apifactorajemz.com/api/v1',
  SECRET_KEY: '93302eef21f513a83748e5104874bb7d',
  CLIENTE: 'MIZRAFIN',
  firebase: {

    apiKey: "AIzaSyBvSH2IqVyJGVEGCG4uE-bDG8ru9dhWDlo",
  authDomain: "prodmz.firebaseapp.com",
  databaseURL: '',
  projectId: "prodmz",
  storageBucket: "prodmz.appspot.com",
  messagingSenderId: "685295917968",
  appId: "1:685295917968:web:a1a0cd6733e74f60407115",
  measurementId: "G-1PF1WR5MQV"
  }

};
