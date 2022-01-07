// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// AMBIENTE DEMO
// ng serve --configuration=demo
// ng build --configuration=demo
export const environment = {
  production: false,
  // para mi fiel /////
  APP_ID: '',
  APP_SECRET: '',
  URL_MIFIEL: '',
  // para mi fiel /////
  URL_SERVICIOS: 'https://demo.devfactorgfc.com/api/v1',
  SECRET_KEY: 'd88577bea5ba12e079a5ccd3c2face64',
  CLIENTE: 'FACTORGFCGLOBAL',
  firebase: {
    apiKey: 'AIzaSyBEo1ncrj28M6JjCmBVIzVsxfJ3Ilj8naQ',
    authDomain: 'demofactoring.firebaseapp.com',
    databaseURL: 'https://demofactoring.firebaseio.com',
    projectId: 'demofactoring',
    storageBucket: 'demofactoring.appspot.com',
    messagingSenderId: '496638880486',
    appId: '1:496638880486:web:0771355a5a6ea989992927',
    measurementId: 'G-SGDFL0CCJ1'
  }

};
