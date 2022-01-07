// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// AMBIENTE TEST
// ng serve
// ng build

export const environment = {
  production: false,
  // para mi fiel /////
  APP_ID: '',
  APP_SECRET: '',
  URL_MIFIEL: '',
  // para mi fiel /////
  URL_SERVICIOS: 'https://test.devfactorgfc.com/api/v1',
 // SECRET_KEY: 'ae82033a0fb36d9783c1914086712df7',
  SECRET_KEY: '5f34ce6c418be1693e307e4ab162b368',
  CLIENTE: 'FACTORGFCGLOBAL',
  firebase: {
    apiKey: "AIzaSyBSkIcN365REv2F5jZECextxBjyEaacDI4",
  authDomain: "testfactoring-23c3f.firebaseapp.com",
  databaseURL: "https://testfactoring-23c3f.firebaseio.com",
  projectId: "testfactoring-23c3f",
  storageBucket: "testfactoring-23c3f.appspot.com",
  messagingSenderId: "626854324010",
  appId: "1:626854324010:web:297fff023e3a88f01f2053",
  measurementId: "G-KX9VSH1LLT"
  }
};
